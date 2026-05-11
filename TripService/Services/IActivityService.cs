using TripService.Models.DTOs;

namespace TripService.Services
{
    public interface IActivityService
    {
        Task<ActivityDto> CreateAsync(int userId, int tripId, ActivityCreateDto dto);
        Task<List<ActivityDto>> GetAllAsync(int userId, int tripId);
        Task<ActivityDto?> GetByIdAsync(int userId, int tripId, int id);
        Task<bool> UpdateAsync(int userId, int tripId, int id, ActivityUpdateDto dto);
        Task<bool> DeleteAsync(int userId, int tripId, int id);
    }
}
