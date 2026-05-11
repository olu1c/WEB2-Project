export const ActivityStatus = {
  Planned: 'Planned',
  Reserved: 'Reserved',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

export class Activity {
  constructor({ id, tripId, name, date, time, location, description, estimatedCost, status }) {
    this.id = id;
    this.tripId = tripId;
    this.name = name;
    this.date = date;
    this.time = time;
    this.location = location;
    this.description = description;
    this.estimatedCost = estimatedCost;
    this.status = status ?? ActivityStatus.Planned;
  }
}
