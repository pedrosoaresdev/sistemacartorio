namespace Cartorio.Api.Models;

public class Folder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Protocol { get; set; } = "";
    public string PersonName { get; set; } = "";
    public string? Cpf { get; set; }
    public string Category { get; set; } = "Geral";
    public string Status { get; set; } = "Ativa"; // Ativa, Arquivada, Encerrada
    public string? Description { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}