namespace Expenses.API.Models
{
    public class User : Base.BaseEntity
    {
        public required string Email { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }

        public List<Transaction>? Transactions { get; set; }
    }
}