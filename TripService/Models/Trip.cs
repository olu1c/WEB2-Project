using System.ComponentModel.DataAnnotations.Schema;

namespace TripService.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [Column("Title")]
        public required string Name { get; set; }

        public required string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? Notes { get; set; }

        public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
        public ICollection<Activity> Activities { get; set; } = new List<Activity>();
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<ChecklistItem> ChecklistItems { get; set; } = new List<ChecklistItem>();
        public ICollection<TripShare> TripShares { get; set; } = new List<TripShare>();
    }
}
