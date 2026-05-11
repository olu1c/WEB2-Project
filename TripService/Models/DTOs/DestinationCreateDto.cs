namespace TripService.Models.DTOs
{
    public class DestinationCreateDto
    {
        public required string Name { get; set; }
        public required string Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
