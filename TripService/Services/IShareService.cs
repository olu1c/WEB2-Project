using TripService.Models;
using TripService.Models.DTOs;

namespace TripService.Services
{
    public interface IShareService
    {
        Task<TripShareResponseDto> CreateShareAsync(int tripId, int userId, string accessType);
        Task<TripShare?> ValidateTokenAsync(string token);
        Task<SharedTripDataDto?> GetSharedDataAsync(string token);
    }
}
