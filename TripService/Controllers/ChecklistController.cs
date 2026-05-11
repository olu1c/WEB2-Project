using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.Models.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [Authorize]
    [Route("api/trips/{tripId}/checklist")]
    [ApiController]
    public class ChecklistController : ControllerBase
    {
        private readonly IChecklistService _service;

        public ChecklistController(IChecklistService service)
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
        public async Task<IActionResult> Create(int tripId, [FromBody] ChecklistItemCreateDto dto)
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int tripId, int id, [FromBody] ChecklistItemUpdateDto dto)
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
