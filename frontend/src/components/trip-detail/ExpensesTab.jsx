import { useState } from 'react';
import { expenseService } from '../../services/expenseService';
import { ExpenseCategory } from '../../models/Expense';
import Toast from '../common/Toast';

export default function ExpensesTab({ tripId, expenses, setExpenses, budget, trip }) {
  const tripStart = trip?.startDate?.slice(0, 10);
  const tripEnd = trip?.endDate?.slice(0, 10);

  const [form, setForm] = useState({ name: '', category: ExpenseCategory.Other, amount: '', date: '', description: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.amount && form.amount !== 0) e.amount = 'Amount is required.';
    else if (Number(form.amount) < 0) e.amount = 'Amount cannot be negative.';
    if (!form.date) e.date = 'Date is required.';
    if (tripStart && form.date && form.date < tripStart)
      e.date = `Cannot be before trip start (${tripStart}).`;
    if (tripEnd && form.date && form.date > tripEnd)
      e.date = `Cannot be after trip end (${tripEnd}).`;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      if (editingId) {
        await expenseService.update(tripId, editingId, { ...form, amount: Number(form.amount) });
        setExpenses(prev => prev.map(ex => ex.id === editingId ? { ...ex, ...form, amount: Number(form.amount) } : ex));
        setEditingId(null);
        setToast({ message: 'Expense updated successfully!', type: 'success' });
      } else {
        const created = await expenseService.create(tripId, { ...form, amount: Number(form.amount) });
        setExpenses(prev => [...prev, created]);
        setToast({ message: 'Expense added successfully!', type: 'success' });
      }
      setForm({ name: '', category: ExpenseCategory.Other, amount: '', date: '', description: '' });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  const handleEdit = (ex) => {
    setEditingId(ex.id);
    setErrors({});
    setForm({ name: ex.name, category: ex.category, amount: ex.amount, date: ex.date?.slice(0, 10), description: ex.description || '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setForm({ name: '', category: ExpenseCategory.Other, amount: '', date: '', description: '' });
  };

  const handleDelete = async (id) => {
    try {
      await expenseService.delete(tripId, id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      setToast({ message: 'Expense deleted.', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  return (
    <div className="card">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2>Expenses</h2>
      <p>💰 Total spent: <strong>{totalSpent}€</strong> / {budget}€ &nbsp;|&nbsp; Remaining: <strong style={{ color: remaining < 0 ? 'red' : 'green' }}>{remaining}€</strong></p>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        {errors.name && <p className="field-error">{errors.name}</p>}
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" min="0" placeholder="Amount (€)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        {errors.amount && <p className="field-error">{errors.amount}</p>}
        <input type="date" min={tripStart} max={tripEnd} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        {errors.date && <p className="field-error">{errors.date}</p>}
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">{editingId ? 'Save' : 'Add'}</button>
        {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            <strong>{e.name}</strong> [{e.category}] — {e.amount}€ ({e.date?.slice(0, 10)})
            <button onClick={() => handleEdit(e)}>✏️</button>
            <button onClick={() => handleDelete(e.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
