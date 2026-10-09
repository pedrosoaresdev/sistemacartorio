using Cartorio.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Cartorio.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Folder> Folders => Set<Folder>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(u => u.Username).IsUnique();
        b.Entity<Folder>().HasIndex(f => f.Protocol).IsUnique();
    }
}