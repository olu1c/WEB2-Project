using Microsoft.EntityFrameworkCore;
using TripService.Data;
using TripService.Models;
using TripService.Models.DTOs;

namespace TripService.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly AppDbContext _db;

        public ExpenseService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ExpenseDto> CreateAsync(int userId, int tripId, ExpenseCreateDto dto)
        {
            if (dto.Amount < 0)
                throw new ArgumentException("Amount cannot be negative.");

            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null) throw new KeyNotFoundException("Trip not found.");

            if (dto.Date < trip.StartDate || dto.Date > trip.EndDate)
                throw new ArgumentException($"Expense date must be within trip dates ({trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd}).");

            var expense = new Expense
            {
                TripId = tripId,
                Name = dto.Name,
                Category = dto.Category,
                Amount = dto.Amount,
                Date = dto.Date,
                Description = dto.Description
            };

            _db.Expenses.Add(expense);
            await _db.SaveChangesAsync();
            return Map(expense);
        }

        public async Task<List<ExpenseDto>> GetAllAsync(int userId, int tripId)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            return await _db.Expenses
                .Where(e => e.TripId == tripId)
                .Select(e => Map(e))
                .ToListAsync();
        }

        public async Task<ExpenseDto?> GetByIdAsync(int userId, int tripId, int id)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var e = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.TripId == tripId);
            return e == null ? null : Map(e);
        }

        public async Task<bool> UpdateAsync(int userId, int tripId, int id, ExpenseUpdateDto dto)
        {
            if (dto.Amount < 0)
                throw new ArgumentException("Amount cannot be negative.");

            var trip = await _db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null) throw new KeyNotFoundException("Trip not found.");

            if (dto.Date < trip.StartDate || dto.Date > trip.EndDate)
                throw new ArgumentException($"Expense date must be within trip dates ({trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd}).");

            var expense = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.TripId == tripId);
            if (expense == null) return false;

            expense.Name = dto.Name;
            expense.Category = dto.Category;
            expense.Amount = dto.Amount;
            expense.Date = dto.Date;
            expense.Description = dto.Description;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int tripId, int id)
        {
            var tripExists = await _db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);
            if (!tripExists) throw new KeyNotFoundException("Trip not found.");

            var expense = await _db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.TripId == tripId);
            if (expense == null) return false;

            _db.Expenses.Remove(expense);
            await _db.SaveChangesAsync();
            return true;
        }

        private static ExpenseDto Map(Expense e) => new ExpenseDto
        {
            Id = e.Id,
            TripId = e.TripId,
            Name = e.Name,
            Category = e.Category,
            Amount = e.Amount,
            Date = e.Date,
            Description = e.Description
        };
    }
}
