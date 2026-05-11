namespace TripService.Models.DTOs
{
    public class ChecklistItemUpdateDto
    {
        public required string Text { get; set; }
        public bool IsCompleted { get; set; }
    }
}
