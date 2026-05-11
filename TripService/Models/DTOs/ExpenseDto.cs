using TripService.Models;

namespace TripService.Models.DTOs
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public required string Name { get; set; }
        public ExpenseCategory Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
