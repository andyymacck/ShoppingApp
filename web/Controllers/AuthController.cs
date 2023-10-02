using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication;
using Npgsql;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<IdentityUser> userManager, IConfiguration configuration, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
    {
        var user = new IdentityUser
        {
            UserName = userForRegisterDto.username,
            Email = userForRegisterDto.email
        };

        var result = await _userManager.CreateAsync(user, userForRegisterDto.password);

        if (result.Succeeded)
        {
            return Ok(new { Message = "Registration Successful" });
        }

        return BadRequest(new { Message = "Registration failed" });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
    {
        var user = await _userManager.FindByNameAsync(userForLoginDto.username);
        try
        {
            if (user != null && await _userManager.CheckPasswordAsync(user, userForLoginDto.password))
            {
                var userRoles = await _userManager.GetRolesAsync(user); // Get the roles of the user

                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
            };

                foreach (var role in userRoles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role)); // Add each role as a separate claim
                }

                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new { Token = tokenHandler.WriteToken(token) });
            }
            else
            {
                return Unauthorized();
            }
        }
        catch (Exception ex)
        {
            // Log the exception or handle it as appropriate
            return StatusCode(500, "Internal server error");
        }
    }
    [Authorize]
    [HttpGet("GetUserRole")]
    public async Task<IActionResult> GetUserRole()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Message = "Invalid user" });
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound(new { Message = "User not found" });
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new { Roles = roles });
    }

    [Authorize]
    [HttpPost("IsAuthenticated")]
    public IActionResult IsAuthenticated()
    {
        return Ok(new { isAuthenticated = true });
    }
}

public class UserForRegisterDto
{
    public string username { get; set; }
    public string password { get; set; }
    public string email { get; set; }
}

public class UserForLoginDto
{
    public string username { get; set; }
    public string password { get; set; }
}