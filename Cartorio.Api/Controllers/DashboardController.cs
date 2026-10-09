using System.Security.Claims;
using Cartorio.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cartorio.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var isAdmin = User.IsInRole("Admin");

        var recent = await _db.Folders.AsNoTracking()
            .OrderByDescending(f => f.CreatedAt)
            .Take(5)
            .Select(f => new { f.Protocol, f.PersonName, f.Status, f.CreatedAt })
            .ToListAsync();

        return Ok(new
        {
            totalFolders = await _db.Folders.CountAsync(),
            activeFolders = await _db.Folders.CountAsync(f => f.Status == "Ativa"),
            totalDocuments = 0, // será preenchido na Fase 3
            activeUsers = isAdmin ? await _db.Users.CountAsync(u => u.IsActive) : (int?)null,
            recentFolders = recent
        });
    }
}