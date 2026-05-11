using TripService.Models.DTOs;

namespace TripService.Services
{
    public interface IExpenseService
    {
        Task<ExpenseDto> CreateAsync(int userId, int tripId, ExpenseCreateDto dto);
        Task<List<ExpenseDto>> GetAllAsync(int userId, int tripId);
        Task<ExpenseDto?> GetByIdAsync(int userId, int tripId, int id);
        Task<bool> UpdateAsync(int userId, int tripId, int id, ExpenseUpdateDto dto);
        Task<bool> DeleteAsync(int userId, int tripId, int id);
    }
}
