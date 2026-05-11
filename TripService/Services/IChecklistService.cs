using TripService.Models.DTOs;

namespace TripService.Services
{
    public interface IChecklistService
    {
        Task<ChecklistItemDto> CreateAsync(int userId, int tripId, ChecklistItemCreateDto dto);
        Task<List<ChecklistItemDto>> GetAllAsync(int userId, int tripId);
        Task<bool> UpdateAsync(int userId, int tripId, int id, ChecklistItemUpdateDto dto);
        Task<bool> DeleteAsync(int userId, int tripId, int id);
    }
}
