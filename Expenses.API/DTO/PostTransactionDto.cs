namespace Expenses.API.DTO
{
    public class PostTransactionDto
    {
        public string? Type { get; set; }
        public double Amount { get; set; }
        public string? Category { get; set; }
    }
}