using TripService.Models;

namespace TripService.Models.DTOs
{
    public class ActivityCreateDto
    {
        public required string Name { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public required string Location { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal EstimatedCost { get; set; }
        public ActivityStatus Status { get; set; } = ActivityStatus.Planned;
    }
}
