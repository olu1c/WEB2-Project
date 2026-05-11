namespace TripService.Models.DTOs
{
    public class DestinationUpdateDto
    {
        public required string Name { get; set; }
        public required string Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
