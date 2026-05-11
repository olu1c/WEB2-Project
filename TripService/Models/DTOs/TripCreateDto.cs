namespace TripService.Models.DTOs
{
    public class TripCreateDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? Notes { get; set; }
    }
}
