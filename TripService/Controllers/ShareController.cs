using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;
using TripService.Models.DTOs;
using TripService.Services;

namespace TripService.Controllers
{
    [Authorize]
    [Route("api/shares")]
    [ApiController]
    public class ShareController : ControllerBase
    {
        private readonly IShareService _shareService;
        private readonly AppDbContext _db;

        public ShareController(IShareService shareService, AppDbContext db)
        {
            _shareService = shareService;
            _db = db;
        }

        // POST /api/trips/{tripId}/shares — create share token (authenticated)
        [Authorize]
        [HttpPost("/api/trips/{tripId}/shares")]
        public async Task<IActionResult> CreateShare(int tripId, [FromBody] TripShareCreateDto dto)
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized();

            try
            {
                var result = await _shareService.CreateShareAsync(tripId, userId, dto.AccessType);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex) { return NotFound(ex.Message); }
            catch (ArgumentException ex) { return BadRequest(ex.Message); }
        }

        // GET /api/shares/{token} — get full trip data (public, VIEW or EDIT)
        [AllowAnonymous]
        [HttpGet("{token}")]
        public async Task<IActionResult> GetSharedTrip(string token)
        {
            var data = await _shareService.GetSharedDataAsync(token);
            if (data == null) return NotFound("Invalid share link.");
            return Ok(data);
        }

        // Helper: validate EDIT token and return tripId
        private async Task<TripShare?> GetEditShare(string token)
        {
            var share = await _shareService.ValidateTokenAsync(token);
            if (share == null || share.AccessType != ShareAccessType.EDIT) return null;
            return share;
        }

        // ======= DESTINATIONS =======

        [AllowAnonymous]
        [HttpPost("{token}/destinations")]
        public async Task<IActionResult> CreateDestination(string token, [FromBody] DestinationCreateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            if (dto.DepartureDate < dto.ArrivalDate)
                return BadRequest("Departure date cannot be before arrival date.");

            var destination = new Destination
            {
                TripId = share.TripId,
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Description = dto.Description
            };
            _db.Destinations.Add(destination);
            await _db.SaveChangesAsync();

            return Ok(new DestinationDto
            {
                Id = destination.Id, TripId = destination.TripId, Name = destination.Name,
                Location = destination.Location, ArrivalDate = destination.ArrivalDate,
                DepartureDate = destination.DepartureDate, Description = destination.Description
            });
        }

        [AllowAnonymous]
        [HttpPut("{token}/destinations/{id}")]
        public async Task<IActionResult> UpdateDestination(string token, int id, [FromBody] DestinationUpdateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            if (dto.DepartureDate < dto.ArrivalDate)
                return BadRequest("Departure date cannot be before arrival date.");

            var dest = await _db.Destinations.FirstOrDefaultAsync(d => d.Id == id && d.TripId == share.TripId);
            if (dest == null) return NotFound();

            dest.Name = dto.Name;
            dest.Location = dto.Location;
            dest.ArrivalDate = dto.ArrivalDate;
            dest.DepartureDate = dto.DepartureDate;
            dest.Description = dto.Description;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [AllowAnonymous]
        [HttpDelete("{token}/destinations/{id}")]
        public async Task<IActionResult> DeleteDestination(string token, int id)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var dest = await _db.Destinations.FirstOrDefaultAsync(d => d.Id == id && d.TripId == share.TripId);
            if (dest == null) return NotFound();

            _db.Destinations.Remove(dest);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ======= ACTIVITIES =======

        [AllowAnonymous]
        [HttpPost("{token}/activities")]
        public async Task<IActionResult> CreateActivity(string token, [FromBody] ActivityCreateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var activity = new Activity
            {
                TripId = share.TripId,
                Name = dto.Name,
                Date = dto.Date,
                Time = dto.Time,
                Location = dto.Location,
                Description = dto.Description,
                EstimatedCost = dto.EstimatedCost,
                Status = dto.Status
            };
            _db.Activities.Add(activity);
            await _db.SaveChangesAsync();

            return Ok(new ActivityDto
            {
                Id = activity.Id, TripId = activity.TripId, Name = activity.Name,
                Date = activity.Date, Time = activity.Time, Location = activity.Location,
                Description = activity.Description, EstimatedCost = activity.EstimatedCost,
                Status = activity.Status
            });
        }

        [AllowAnonymous]
        [HttpPut("{token}/activities/{id}")]
        public async Task<IActionResult> UpdateActivity(string token, int id, [FromBody] ActivityUpdateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var activity = await _db.Activities.FirstOrDefaultAsync(a => a.Id == id && a.TripId == share.TripId);
            if (activity == null) return NotFound();

            activity.Name = dto.Name;
            activity.Date = dto.Date;
            activity.Time = dto.Time;
            activity.Location = dto.Location;
            activity.Description = dto.Description;
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Status = dto.Status;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [AllowAnonymous]
        [HttpDelete("{token}/activities/{id}")]
        public async Task<IActionResult> DeleteActivity(string token, int id)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var activity = await _db.Activities.FirstOrDefaultAsync(a => a.Id == id && a.TripId == share.TripId);
            if (activity == null) return NotFound();

            _db.Activities.Remove(activity);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ======= EXPENSES =======

        [AllowAnonymous]
        [HttpPost("{token}/expenses")]
        public async Task<IActionResult> CreateExpense(string token, [FromBody] ExpenseCreateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            if (dto.Amount < 0) return BadRequest("Amount cannot be negative.");

            var expense = new Expense
            {
                TripId = share.TripId,
                Name = dto.Name,
                Category = dto.Category,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description
            };
            _db.Expenses.Add(expense);
            await _db.SaveChangesAsync();

            return Ok(new ExpenseDto
            {
                Id = expense.Id, TripId = expense.TripId, Name = expense.Name,
                Category = expense.Category, Amount = expense.Amount,
                Date = expense.Date, Description = expense.Description
            });
        }

        [AllowAnonymous]
        [HttpPut("{token}/expenses/{id}")]
        public async Task<IActionResult> UpdateExpense(string token, int id, [FromBody] ExpenseUpdateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            if (dto.Amount < 0) return BadRequest("Amount cannot be negative.");

            var expense = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.TripId == share.TripId);
            if (expense == null) return NotFound();

            expense.Name = dto.Name;
            expense.Category = dto.Category;
            expense.Amount = dto.Amount;
            expense.Date = dto.Date;
            expense.Description = dto.Description;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [AllowAnonymous]
        [HttpDelete("{token}/expenses/{id}")]
        public async Task<IActionResult> DeleteExpense(string token, int id)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var expense = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.TripId == share.TripId);
            if (expense == null) return NotFound();

            _db.Expenses.Remove(expense);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ======= CHECKLIST =======

        [AllowAnonymous]
        [HttpPost("{token}/checklist")]
        public async Task<IActionResult> CreateChecklistItem(string token, [FromBody] ChecklistItemCreateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var item = new ChecklistItem
            {
                TripId = share.TripId,
                Text = dto.Text,
                IsCompleted = false
            };
            _db.ChecklistItems.Add(item);
            await _db.SaveChangesAsync();

            return Ok(new ChecklistItemDto { Id = item.Id, TripId = item.TripId, Text = item.Text, IsCompleted = item.IsCompleted });
        }

        [AllowAnonymous]
        [HttpPut("{token}/checklist/{id}")]
        public async Task<IActionResult> UpdateChecklistItem(string token, int id, [FromBody] ChecklistItemUpdateDto dto)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var item = await _db.ChecklistItems.FirstOrDefaultAsync(c => c.Id == id && c.TripId == share.TripId);
            if (item == null) return NotFound();

            item.Text = dto.Text;
            item.IsCompleted = dto.IsCompleted;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [AllowAnonymous]
        [HttpDelete("{token}/checklist/{id}")]
        public async Task<IActionResult> DeleteChecklistItem(string token, int id)
        {
            var share = await GetEditShare(token);
            if (share == null) return Forbid();

            var item = await _db.ChecklistItems.FirstOrDefaultAsync(c => c.Id == id && c.TripId == share.TripId);
            if (item == null) return NotFound();

            _db.ChecklistItems.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
