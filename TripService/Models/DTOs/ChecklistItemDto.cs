namespace TripService.Models.DTOs
{
    public class ChecklistItemDto
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public required string Text { get; set; }
        public bool IsCompleted { get; set; }
    }
}
