using TripService.Models.DTOs;

namespace TripService.Services
{
    public interface IDestinationService
    {
        Task<DestinationDto> CreateAsync(int userId, int tripId, DestinationCreateDto dto);
        Task<List<DestinationDto>> GetAllAsync(int userId, int tripId);
        Task<DestinationDto?> GetByIdAsync(int userId, int tripId, int id);
        Task<bool> UpdateAsync(int userId, int tripId, int id, DestinationUpdateDto dto);
        Task<bool> DeleteAsync(int userId, int tripId, int id);
    }
}
