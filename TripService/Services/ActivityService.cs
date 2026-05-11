using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;
using TripService.Models.DTOs;

namespace TripService.Services
{
    public class ActivityService : IActivityService
    {
        private readonly AppDbContext _db;

        public ActivityService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ActivityDto> CreateAsync(int userId, int tripId, ActivityCreateDto dto)
        {
            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null) throw new KeyNotFoundException("Trip not found.");

            if (dto.Date < trip.StartDate || dto.Date > trip.EndDate)
                throw new ArgumentException($"Activity date must be within trip dates ({trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd}).");

            var activity = new Activity
            {
                TripId = tripId,
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
            return Map(activity);
        }

        public async Task<List<ActivityDto>> GetAllAsync(int userId, int tripId)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            return await _db.Activities
                .Where(a => a.TripId == tripId)
                .OrderBy(a => a.Date).ThenBy(a => a.Time)
                .Select(a => Map(a))
                .ToListAsync();
        }

        public async Task<ActivityDto?> GetByIdAsync(int userId, int tripId, int id)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var a = await _db.Activities.FirstOrDefaultAsync(a => a.Id == id && a.TripId == tripId);
            return a == null ? null : Map(a);
        }

        public async Task<bool> UpdateAsync(int userId, int tripId, int id, ActivityUpdateDto dto)
        {
            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null) throw new KeyNotFoundException("Trip not found.");

            if (dto.Date < trip.StartDate || dto.Date > trip.EndDate)
                throw new ArgumentException($"Activity date must be within trip dates ({trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd}).");

            var activity = await _db.Activities.FirstOrDefaultAsync(a => a.Id == id && a.TripId == tripId);
            if (activity == null) return false;

            activity.Name = dto.Name;
            activity.Date = dto.Date;
            activity.Time = dto.Time;
            activity.Location = dto.Location;
            activity.Description = dto.Description;
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Status = dto.Status;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int tripId, int id)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var activity = await _db.Activities.FirstOrDefaultAsync(a => a.Id == id && a.TripId == tripId);
            if (activity == null) return false;

            _db.Activities.Remove(activity);
            await _db.SaveChangesAsync();
            return true;
        }

        private static ActivityDto Map(Activity a) => new ActivityDto
        {
            Id = a.Id,
            TripId = a.TripId,
            Name = a.Name,
            Date = a.Date,
            Time = a.Time,
            Location = a.Location,
            Description = a.Description,
            EstimatedCost = a.EstimatedCost,
            Status = a.Status
        };
    }
}
