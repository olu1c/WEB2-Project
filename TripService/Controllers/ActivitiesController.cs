using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.Models.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [Authorize]
    [Route("api/trips/{tripId}/activities")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivityService _service;

        public ActivitiesController(IActivityService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                throw new UnauthorizedAccessException("Invalid userId claim.");
            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> Create(int tripId, [FromBody] ActivityCreateDto dto)
        {
            try
            {
                var result = await _service.CreateAsync(GetUserId(), tripId, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int tripId)
        {
            try { return Ok(await _service.GetAllAsync(GetUserId(), tripId)); }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int tripId, int id)
        {
            try
            {
                var result = await _service.GetByIdAsync(GetUserId(), tripId, id);
                return result == null ? NotFound() : Ok(result);
            }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int tripId, int id, [FromBody] ActivityUpdateDto dto)
        {
            try
            {
                var success = await _service.UpdateAsync(GetUserId(), tripId, id, dto);
                return success ? Ok() : NotFound();
            }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int tripId, int id)
        {
            try
            {
                var success = await _service.DeleteAsync(GetUserId(), tripId, id);
                return success ? NoContent() : NotFound();
            }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        }
    }
}
