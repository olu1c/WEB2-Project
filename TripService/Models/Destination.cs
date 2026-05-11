using System.ComponentModel.DataAnnotations.Schema;

namespace TripService.Models
{
    public class Destination
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public required string Name { get; set; }
        public required string Location { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }

        [Column("Notes")]
        public string Description { get; set; } = string.Empty;

        public Trip Trip { get; set; } = null!;
    }
}
