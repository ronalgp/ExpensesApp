namespace Expenses.API.Models
{
    public class User : Base.BaseEntity
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}