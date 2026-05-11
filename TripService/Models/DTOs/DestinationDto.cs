namespace TripService.Models.DTOs
{
    public class DestinationDto
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public required string Name { get; set; }
        public required string Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
