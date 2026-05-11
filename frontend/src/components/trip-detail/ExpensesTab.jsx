import { useState } from 'react';
import { expenseService } from '../../services/expenseService';
import { ExpenseCategory } from '../../models/Expense';

export default function ExpensesTab({ tripId, expenses, setExpenses, budget, trip }) {
  const tripStart = trip?.startDate?.slice(0, 10);
  const tripEnd = trip?.endDate?.slice(0, 10);

  const [form, setForm] = useState({ name: '', category: ExpenseCategory.Other, amount: '', date: '', description: '' });
  const [error, setError] = useState(null);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);

    if (tripStart && form.date < tripStart) {
      setError(`Expense date cannot be before trip start (${tripStart}).`);
      return;
    }
    if (tripEnd && form.date > tripEnd) {
      setError(`Expense date cannot be after trip end (${tripEnd}).`);
      return;
    }

    try {
      const created = await expenseService.create(tripId, { ...form, amount: Number(form.amount) });
      setExpenses(prev => [...prev, created]);
      setForm({ name: '', category: ExpenseCategory.Other, amount: '', date: '', description: '' });
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await expenseService.delete(tripId, id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="card">
      <h2>Expenses</h2>
      <p>💰 Total spent: <strong>{totalSpent}€</strong> / {budget}€ &nbsp;|&nbsp; Remaining: <strong style={{ color: remaining < 0 ? 'red' : 'green' }}>{remaining}€</strong></p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAdd}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" required min="0" placeholder="Amount (€)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input type="date" required min={tripStart} max={tripEnd} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            <strong>{e.name}</strong> [{e.category}] — {e.amount}€ ({e.date?.slice(0, 10)})
            <button onClick={() => handleDelete(e.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
