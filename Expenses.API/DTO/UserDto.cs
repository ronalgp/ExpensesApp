using Expenses.API.Models.Base;

namespace Expenses.API.DTO;

public class UserDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}
