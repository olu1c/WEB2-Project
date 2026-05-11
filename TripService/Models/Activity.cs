using System.ComponentModel.DataAnnotations.Schema;

namespace TripService.Models
{
    public enum ActivityStatus { Planned, Reserved, Completed, Cancelled }

    public class Activity
    {
        public int Id { get; set; }
        public int TripId { get; set; }

        [Column("Title")]
        public required string Name { get; set; }

        [Column("ActivityDate")]
        public DateTime Date { get; set; }

        public TimeSpan Time { get; set; }
        public required string Location { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal EstimatedCost { get; set; }
        public ActivityStatus Status { get; set; } = ActivityStatus.Planned;

        public Trip Trip { get; set; } = null!;
    }
}
