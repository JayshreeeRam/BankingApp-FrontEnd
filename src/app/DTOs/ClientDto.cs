using BankingApp.Enums;

public class ClientDto
{
    public int ClientId { get; set; }
    public string Name { get; set; } = null!;
    public string? Address { get; set; }

    public int BankId { get; set; }   // required (not nullable)
    public int UserId { get; set; }   // required (not nullable)

    public string AccountNo { get; set; } = null!; // required

    public AccountStatus? VerificationStatus { get; set; } = AccountStatus.Pending; // mapped from enum
    public AccountType? AccountType { get; set; }       // mapped from enum
}