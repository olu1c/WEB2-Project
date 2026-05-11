export class Destination {
  constructor({ id, tripId, name, location, arrivalDate, departureDate, description }) {
    this.id = id;
    this.tripId = tripId;
    this.name = name;
    this.location = location;
    this.arrivalDate = arrivalDate;
    this.departureDate = departureDate;
    this.description = description;
  }
}
