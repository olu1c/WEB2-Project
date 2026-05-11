export const ExpenseCategory = {
  Transport: 'Transport',
  Accommodation: 'Accommodation',
  Food: 'Food',
  Tickets: 'Tickets',
  Shopping: 'Shopping',
  Other: 'Other',
};

export class Expense {
  constructor({ id, tripId, name, category, amount, date, description }) {
    this.id = id;
    this.tripId = tripId;
    this.name = name;
    this.category = category;
    this.amount = amount;
    this.date = date;
    this.description = description;
  }
}
