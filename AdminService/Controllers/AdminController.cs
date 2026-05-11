using AdminService.Data;
using AdminService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Controllers
{
    [Authorize(Roles ="Admin")]
    [Route("api/admin")]
    [ApiController]

    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminController(AppDbContext db) {
            _db = db;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _db.Users.Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Role
            }).ToListAsync();
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return
                    NotFound();
            var trips = await _db.Trips.Where(t => t.UserId == id).ToListAsync();
            _db.Trips.RemoveRange(trips);
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("trips")]
        public async Task<IActionResult> GetAllTrips()
        {
            var trips = await _db.Trips.Select(t => new
            {
                t.Id,
                t.UserId,
                t.Name,
                t.StartDate,
                t.EndDate,
                t.Budget
            }).ToListAsync();
            return Ok(trips);
        }
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] string role)
        {
            var user = await _db.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }
            user.Role = role;
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
