using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.Models.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [Authorize]
    [Route("api/trips")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly ITripService _service;
        public TripController(ITripService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                throw new UnauthorizedAccessException("Invalid userId");
            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TripCreateDto dto)
        {
            var result = await _service.CreateAsync(GetUserId(), dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync(GetUserId()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(GetUserId(), id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TripUpdateDto dto)
        {
            var success = await _service.UpdateAsync(GetUserId(), id, dto);
            if (!success) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(GetUserId(), id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
