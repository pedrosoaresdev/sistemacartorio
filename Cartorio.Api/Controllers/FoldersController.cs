using System.Security.Claims;
using Cartorio.Api.Data;
using Cartorio.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cartorio.Api.Controllers;

public record CreateFolderRequest(string PersonName, string? Cpf, string? Category, string? Description);

[ApiController]
[Route("api/folders")]
[Authorize]
public class FoldersController : ControllerBase
{
    private readonly AppDbContext _db;
    public FoldersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? q, [FromQuery] string? status)
    {
        var query = _db.Folders.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLower();
            query = query.Where(f =>
                f.PersonName.ToLower().Contains(term) ||
                f.Protocol.ToLower().Contains(term) ||
                (f.Cpf != null && f.Cpf.Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(f => f.Status == status);

        var list = await query.OrderByDescending(f => f.CreatedAt).Take(200).ToListAsync();
        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateFolderRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.PersonName))
            return BadRequest(new { message = "O nome da pessoa é obrigatório." });

        var year = DateTime.UtcNow.Year;
        var count = await _db.Folders.CountAsync(f => f.CreatedAt.Year == year);

        var folder = new Folder
        {
            Protocol = $"CRT-{year}-{count + 1:D6}",
            PersonName = req.PersonName.Trim(),
            Cpf = string.IsNullOrWhiteSpace(req.Cpf) ? null : req.Cpf.Trim(),
            Category = string.IsNullOrWhiteSpace(req.Category) ? "Geral" : req.Category.Trim(),
            Description = req.Description?.Trim(),
            CreatedByUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        };

        try
        {
            _db.Folders.Add(folder);
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Conflito ao gerar o protocolo. Tente novamente." });
        }

        return Created($"/api/folders/{folder.Id}", folder);
    }
}