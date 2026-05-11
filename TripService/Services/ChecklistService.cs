using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;
using TripService.Models.DTOs;

namespace TripService.Services
{
    public class ChecklistService : IChecklistService
    {
        private readonly AppDbContext _db;

        public ChecklistService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ChecklistItemDto> CreateAsync(int userId, int tripId, ChecklistItemCreateDto dto)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var item = new ChecklistItem
            {
                TripId = tripId,
                Text = dto.Text,
                IsCompleted = false
            };

            _db.ChecklistItems.Add(item);
            await _db.SaveChangesAsync();
            return Map(item);
        }

        public async Task<List<ChecklistItemDto>> GetAllAsync(int userId, int tripId)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            return await _db.ChecklistItems
                .Where(c => c.TripId == tripId)
                .Select(c => Map(c))
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(int userId, int tripId, int id, ChecklistItemUpdateDto dto)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var item = await _db.ChecklistItems.FirstOrDefaultAsync(c => c.Id == id && c.TripId == tripId);
            if (item == null) return false;

            item.Text = dto.Text;
            item.IsCompleted = dto.IsCompleted;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int tripId, int id)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var item = await _db.ChecklistItems.FirstOrDefaultAsync(c => c.Id == id && c.TripId == tripId);
            if (item == null) return false;

            _db.ChecklistItems.Remove(item);
            await _db.SaveChangesAsync();
            return true;
        }

        private static ChecklistItemDto Map(ChecklistItem c) => new ChecklistItemDto
        {
            Id = c.Id,
            TripId = c.TripId,
            Text = c.Text,
            IsCompleted = c.IsCompleted
        };
    }
}
