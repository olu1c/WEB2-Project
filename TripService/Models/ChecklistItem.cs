using System.ComponentModel.DataAnnotations.Schema;

namespace TripService.Models
{
    public class ChecklistItem
    {
        public int Id { get; set; }
        public int TripId { get; set; }

        [Column("Title")]
        public required string Text { get; set; }

        public bool IsCompleted { get; set; } = false;

        public Trip Trip { get; set; } = null!;
    }
}
