using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TripService.Models
{
    public enum ShareAccessType
    {
        VIEW,
        EDIT
    }

    public class TripShare
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TripId { get; set; }

        [ForeignKey("TripId")]
        public Trip Trip { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public ShareAccessType AccessType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
