using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;
using TripService.Models.DTOs;

namespace TripService.Services
{
    public class DestinationService : IDestinationService
    {
        private readonly AppDbContext _db;

        public DestinationService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<DestinationDto> CreateAsync(int userId, int tripId, DestinationCreateDto dto)
        {
            if (dto.DepartureDate < dto.ArrivalDate)
                throw new ArgumentException("Departure date cannot be before arrival date.");

            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null) throw new KeyNotFoundException("Trip not found.");

            if (dto.ArrivalDate < trip.StartDate || dto.DepartureDate > trip.EndDate)
                throw new ArgumentException($"Destination dates must be within trip dates ({trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd}).");

            var destination = new Destination
            {
                TripId = tripId,
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Description = dto.Description
            };

            _db.Destinations.Add(destination);
            await _db.SaveChangesAsync();
            return Map(destination);
        }

        public async Task<List<DestinationDto>> GetAllAsync(int userId, int tripId)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            return await _db.Destinations
                .Where(d => d.TripId == tripId)
                .Select(d => Map(d))
                .ToListAsync();
        }

        public async Task<DestinationDto?> GetByIdAsync(int userId, int tripId, int id)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var d = await _db.Destinations.FirstOrDefaultAsync(d => d.Id == id && d.TripId == tripId);
            return d == null ? null : Map(d);
        }

        public async Task<bool> UpdateAsync(int userId, int tripId, int id, DestinationUpdateDto dto)
        {
            if (dto.DepartureDate < dto.ArrivalDate)
                throw new ArgumentException("Departure date cannot be before arrival date.");

            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null) throw new KeyNotFoundException("Trip not found.");

            if (dto.ArrivalDate < trip.StartDate || dto.DepartureDate > trip.EndDate)
                throw new ArgumentException($"Destination dates must be within trip dates ({trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd}).");

            var destination = await _db.Destinations.FirstOrDefaultAsync(d => d.Id == id && d.TripId == tripId);
            if (destination == null) return false;

            destination.Name = dto.Name;
            destination.Location = dto.Location;
            destination.ArrivalDate = dto.ArrivalDate;
            destination.DepartureDate = dto.DepartureDate;
            destination.Description = dto.Description;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int tripId, int id)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var destination = await _db.Destinations.FirstOrDefaultAsync(d => d.Id == id && d.TripId == tripId);
            if (destination == null) return false;

            _db.Destinations.Remove(destination);
            await _db.SaveChangesAsync();
            return true;
        }

        private static DestinationDto Map(Destination d) => new DestinationDto
        {
            Id = d.Id,
            TripId = d.TripId,
            Name = d.Name,
            Location = d.Location,
            ArrivalDate = d.ArrivalDate,
            DepartureDate = d.DepartureDate,
            Description = d.Description
        };
    }
}
