using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    public class Trip
    {
        public int Id { get; set; } 
        public int UserId { get; set; }
        [Column("Title")]
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? Notes { get; set; }
    }
}
