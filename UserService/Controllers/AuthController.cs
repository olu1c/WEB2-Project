using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UserService.Data;
using UserService.Helpers;
using UserService.Models;
using UserService.Models.DTOs;
using UserService.Services;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly ILogger<AuthController> _logger;
        private readonly AppDbContext _context;


        public AuthController(JwtService jwtService, ILogger<AuthController> logger,AppDbContext context)
        {
            _jwtService = jwtService;
            _logger = logger;
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (_context.Users.Any(x => x.Username == dto.Username))
                return BadRequest("Username already exists.");

            if (_context.Users.Any(x => x.Email == dto.Email))
                return BadRequest("Email already in use.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHelper.HashPassword(dto.Password)
            };
            
            _context.Users.Add(user);
            _context.SaveChanges();
            _logger.LogInformation("USER CREATED: {Username}", dto.Username);
            return Ok("User registred");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            _logger.LogInformation("LOGIN REQUEST: {@Dto}", dto);

            var user = _context.Users
                .FirstOrDefault(x => x.Username == dto.Username);

            if (user == null)
            {
                _logger.LogWarning("Invalid username: {Username}", dto.Username);
                return Unauthorized("Invalid username");
            }

            if (!PasswordHelper.Verify(dto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Invalid password for: {Username}", dto.Username);
                return Unauthorized("Invalid password");
            }

            var token = _jwtService.GenerateToken(user.Username,user.Id,user.Role);

            _logger.LogInformation("LOGIN SUCCESS: {Username}", user.Username);

            return Ok(new { token });
        }

        

    }
}
