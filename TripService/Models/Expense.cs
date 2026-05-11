using System.ComponentModel.DataAnnotations.Schema;

namespace TripService.Models
{
    public enum ExpenseCategory { Transport, Accommodation, Food, Tickets, Shopping, Other }

    public class Expense
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public required string Name { get; set; }
        public ExpenseCategory Category { get; set; }
        public decimal Amount { get; set; }

        [Column("ExpenseDate")]
        public DateTime Date { get; set; }

        public string Description { get; set; } = string.Empty;

        public Trip Trip { get; set; } = null!;
    }
}
