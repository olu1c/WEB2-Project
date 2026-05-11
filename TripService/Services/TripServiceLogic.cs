using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;
using TripService.Models.DTOs;

namespace TripService.Services
{
    public class TripServiceLogic : ITripService
    {
        private readonly AppDbContext _db;

        public TripServiceLogic(AppDbContext db)
        {
            _db = db;
        }

        public async Task<TripDto> CreateAsync(int userId, TripCreateDto dto)
        {
            if (dto.EndDate < dto.StartDate)
                throw new ArgumentException("End date cannot be before start date.");
            if (dto.Budget < 0)
                throw new ArgumentException("Budget cannot be negative.");

            var trip = new Trip
            {
                UserId = userId,
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Budget = dto.Budget,
                Notes = dto.Notes
            };

            _db.Trips.Add(trip);
            await _db.SaveChangesAsync();
            return Map(trip);
        }

        public async Task<List<TripDto>> GetAllAsync(int userId)
        {
            return await _db.Trips
                .Where(t => t.UserId == userId)
                .Select(t => Map(t))
                .ToListAsync();
        }

        public async Task<TripDto?> GetByIdAsync(int userId, int id)
        {
            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            return trip == null ? null : Map(trip);
        }

        public async Task<bool> UpdateAsync(int userId, int id, TripUpdateDto dto)
        {
            if (dto.EndDate < dto.StartDate)
                throw new ArgumentException("End date cannot be before start date.");
            if (dto.Budget < 0)
                throw new ArgumentException("Budget cannot be negative.");

            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (trip == null) return false;

            trip.Name = dto.Name;
            trip.Description = dto.Description;
            trip.StartDate = dto.StartDate;
            trip.EndDate = dto.EndDate;
            trip.Budget = dto.Budget;
            trip.Notes = dto.Notes;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (trip == null) return false;

            _db.Trips.Remove(trip);
            await _db.SaveChangesAsync();
            return true;
        }

        private static TripDto Map(Trip t) => new TripDto
        {
            Id = t.Id,
            Name = t.Name,
            Description = t.Description,
            StartDate = t.StartDate,
            EndDate = t.EndDate,
            Budget = t.Budget,
            Notes = t.Notes
        };
    }
}
