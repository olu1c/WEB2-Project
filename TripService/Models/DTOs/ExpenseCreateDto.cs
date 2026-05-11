using TripService.Models;

namespace TripService.Models.DTOs
{
    public class ExpenseCreateDto
    {
        public required string Name { get; set; }
        public ExpenseCategory Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
