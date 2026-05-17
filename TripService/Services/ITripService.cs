using TripService.Models.DTOs;

namespace TripService.Services
{
    public interface ITripService
    {
        Task<TripDto> CreateAsync(int userId, TripCreateDto dto);
        Task<List<TripDto>> GetAllAsync(int userId);
        Task<TripDto?> GetByIdAsync(int userId, int id);
        Task<bool> UpdateAsync(int userId, int id, TripUpdateDto dto);
        Task<bool> DeleteAsync(int userId, int id);
        Task<TripDto?> GetSharedAsync(int id);
    }
}
