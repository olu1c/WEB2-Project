using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;
using TripService.Models.DTOs;

namespace TripService.Services
{
    public class ShareService : IShareService
    {
        private readonly AppDbContext _db;

        public ShareService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<TripShareResponseDto> CreateShareAsync(int tripId, int userId, string accessType)
        {
            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                throw new UnauthorizedAccessException("Trip not found or access denied.");

            if (!Enum.TryParse<ShareAccessType>(accessType.ToUpper(), out var accessEnum))
                throw new ArgumentException("Invalid access type. Use VIEW or EDIT.");

            var token = Guid.NewGuid().ToString("N");

            var share = new TripShare
            {
                TripId = tripId,
                Token = token,
                AccessType = accessEnum,
                CreatedAt = DateTime.UtcNow
            };

            _db.TripShares.Add(share);
            await _db.SaveChangesAsync();

            return new TripShareResponseDto
            {
                Token = token,
                AccessType = accessEnum.ToString()
            };
        }

        public async Task<TripShare?> ValidateTokenAsync(string token)
        {
            return await _db.TripShares.FirstOrDefaultAsync(s => s.Token == token);
        }

        public async Task<SharedTripDataDto?> GetSharedDataAsync(string token)
        {
            var share = await _db.TripShares
                .Include(s => s.Trip)
                .FirstOrDefaultAsync(s => s.Token == token);

            if (share == null) return null;

            var tripId = share.TripId;

            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
            var destinations = await _db.Destinations.Where(d => d.TripId == tripId).ToListAsync();
            var activities = await _db.Activities.Where(a => a.TripId == tripId).ToListAsync();
            var expenses = await _db.Expenses.Where(e => e.TripId == tripId).ToListAsync();
            var checklist = await _db.ChecklistItems.Where(c => c.TripId == tripId).ToListAsync();

            return new SharedTripDataDto
            {
                Trip = MapTrip(trip!),
                Destinations = destinations.Select(MapDestination).ToList(),
                Activities = activities.Select(MapActivity).ToList(),
                Expenses = expenses.Select(MapExpense).ToList(),
                ChecklistItems = checklist.Select(MapChecklist).ToList(),
                AccessType = share.AccessType.ToString()
            };
        }

        private static TripDto MapTrip(Trip t) => new TripDto
        {
            Id = t.Id, Name = t.Name, Description = t.Description,
            StartDate = t.StartDate, EndDate = t.EndDate, Budget = t.Budget, Notes = t.Notes
        };

        private static DestinationDto MapDestination(Destination d) => new DestinationDto
        {
            Id = d.Id, TripId = d.TripId, Name = d.Name, Location = d.Location,
            ArrivalDate = d.ArrivalDate, DepartureDate = d.DepartureDate, Description = d.Description
        };

        private static ActivityDto MapActivity(Activity a) => new ActivityDto
        {
            Id = a.Id, TripId = a.TripId, Name = a.Name, Date = a.Date, Time = a.Time,
            Location = a.Location, Description = a.Description, EstimatedCost = a.EstimatedCost, Status = a.Status
        };

        private static ExpenseDto MapExpense(Expense e) => new ExpenseDto
        {
            Id = e.Id, TripId = e.TripId, Name = e.Name, Category = e.Category,
            Amount = e.Amount, Date = e.Date, Description = e.Description
        };

        private static ChecklistItemDto MapChecklist(ChecklistItem c) => new ChecklistItemDto
        {
            Id = c.Id, TripId = c.TripId, Text = c.Text, IsCompleted = c.IsCompleted
        };
    }
}
