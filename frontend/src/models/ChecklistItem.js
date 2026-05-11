export class ChecklistItem {
  constructor({ id, tripId, text, isCompleted }) {
    this.id = id;
    this.tripId = tripId;
    this.text = text;
    this.isCompleted = isCompleted ?? false;
  }
}
