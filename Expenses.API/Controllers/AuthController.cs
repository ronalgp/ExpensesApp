using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Expenses.API.Data;
using Expenses.API.DTO;
using Expenses.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Expenses.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AppDbContext context) : ControllerBase
    {
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginUserDto userDto)
        {
            var user = context.Users.FirstOrDefault(u => u.Email == userDto.Email);
            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid credentials.");
            }
            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }

        [HttpPost("Register")]
        public IActionResult Register([FromBody] UserDto userDto)
        {
            // Check if the user already exists
            var existingUser = context.Users.FirstOrDefault(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return BadRequest("User already exists.");
            }

            using var hmac = new HMACSHA512();
            // Create a new user
            var user = new User
            {
                Email = userDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password)), // Hash the password,
                PasswordSalt = hmac.Key, // Store the salt
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            context.SaveChanges();

            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("Your-Super-Secret-Key-Here-32-Characters-Long"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "dotnethow.net",
                audience: "dotnethow.net",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
