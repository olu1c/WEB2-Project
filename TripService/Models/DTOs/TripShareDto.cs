namespace TripService.Models.DTOs
{
    public class TripShareCreateDto
    {
        public string AccessType { get; set; } // "VIEW" or "EDIT"
    }

    public class TripShareResponseDto
    {
        public string Token { get; set; }
        public string AccessType { get; set; }
    }

    public class SharedTripDataDto
    {
        public TripDto Trip { get; set; }
        public List<DestinationDto> Destinations { get; set; }
        public List<ActivityDto> Activities { get; set; }
        public List<ExpenseDto> Expenses { get; set; }
        public List<ChecklistItemDto> ChecklistItems { get; set; }
        public string AccessType { get; set; }
    }
}
