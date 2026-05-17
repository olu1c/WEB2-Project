import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { shareService } from '../services/shareService';
import './SharedTripPage.css';

export default function SharedTripPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!token) { setError('Invalid share link — missing token.'); setLoading(false); return; }
    shareService.getData(token)
      .then(res => setData(res))
      .catch(() => setError('Invalid or expired share link.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="shared-page"><p>Loading...</p></div>;
  if (error) return <div className="shared-page"><p style={{ color: '#f87171' }}>{error}</p></div>;

  const { trip, destinations, activities, expenses, checklistItems, accessType } = data;
  const isEdit = accessType === 'EDIT';
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const days = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const tabs = ['overview', 'destinations', 'activities', 'expenses', 'checklist'];

  return (
    <div className="shared-page">
      <div className="shared-header">
        <div>
          <h1>{trip.name}</h1>
          <p>{trip.startDate?.slice(0, 10)} → {trip.endDate?.slice(0, 10)} · {days} days</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className={`access-badge ${isEdit ? 'edit' : 'view'}`}>
            {isEdit ? '✏️ Edit Access' : '👁️ View Only'}
          </span>
          <p style={{ margin: '8px 0 0', color: 'white' }}>💰 {trip.budget}€ · Spent: {totalSpent}€</p>
        </div>
      </div>

      <div className="shared-body">
        <div className="shared-sidebar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'active-tab' : ''}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="shared-content">
          {activeTab === 'overview' && (
            <OverviewSection trip={trip} destinations={destinations} activities={activities} />
          )}
          {activeTab === 'destinations' && (
            <DestinationsSection token={token} destinations={destinations} setData={setData} isEdit={isEdit} />
          )}
          {activeTab === 'activities' && (
            <ActivitiesSection token={token} activities={activities} setData={setData} isEdit={isEdit} />
          )}
          {activeTab === 'expenses' && (
            <ExpensesSection token={token} expenses={expenses} budget={trip.budget} setData={setData} isEdit={isEdit} />
          )}
          {activeTab === 'checklist' && (
            <ChecklistSection token={token} checklistItems={checklistItems} setData={setData} isEdit={isEdit} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============ OVERVIEW ============
function OverviewSection({ trip, destinations, activities }) {
  return (
    <div className="shared-card">
      <h2>Overview</h2>
      {trip.description && <p>{trip.description}</p>}
      {trip.notes && <p style={{ color: '#94a3b8' }}>📝 {trip.notes}</p>}
      <div className="shared-stats">
        <div>📍 {destinations.length} Destinations</div>
        <div>📌 {activities.length} Activities</div>
      </div>
    </div>
  );
}

// ============ DESTINATIONS ============
function DestinationsSection({ token, destinations, setData, isEdit }) {
  const empty = { name: '', location: '', arrivalDate: '', departureDate: '', description: '' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState('');

  const refresh = async () => {
    const res = await shareService.getData(token);
    setData(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editingId) {
        await shareService.updateDestination(token, editingId, form);
      } else {
        await shareService.createDestination(token, form);
      }
      setForm(empty); setEditingId(null);
      await refresh();
    } catch (ex) {
      setErr(ex.response?.data || 'Error saving destination.');
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({ name: d.name, location: d.location, arrivalDate: d.arrivalDate?.slice(0,10), departureDate: d.departureDate?.slice(0,10), description: d.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    await shareService.deleteDestination(token, id);
    await refresh();
  };

  return (
    <div className="shared-card">
      <h2>Destinations</h2>
      {isEdit && (
        <form onSubmit={handleSubmit} className="shared-form">
          <h3>{editingId ? 'Edit Destination' : 'Add Destination'}</h3>
          {err && <p className="shared-error">{err}</p>}
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          <label>Arrival Date</label>
          <input type="date" value={form.arrivalDate} onChange={e => setForm({ ...form, arrivalDate: e.target.value })} required />
          <label>Departure Date</label>
          <input type="date" value={form.departureDate} onChange={e => setForm({ ...form, departureDate: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="shared-form-btns">
            <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setForm(empty); setEditingId(null); }}>Cancel</button>}
          </div>
        </form>
      )}
      {destinations.length === 0 ? <p style={{ color: '#475569' }}>No destinations yet.</p> : destinations.map(d => (
        <div key={d.id} className="shared-item">
          <div>
            <strong>{d.name}</strong> — {d.location}
            <p>{d.arrivalDate?.slice(0,10)} → {d.departureDate?.slice(0,10)}</p>
            {d.description && <p style={{ color: '#64748b' }}>{d.description}</p>}
          </div>
          {isEdit && (
            <div className="shared-item-btns">
              <button onClick={() => handleEdit(d)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(d.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============ ACTIVITIES ============
function ActivitiesSection({ token, activities, setData, isEdit }) {
  const empty = { name: '', date: '', time: '', location: '', description: '', estimatedCost: 0, status: 'Planned' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState('');

  const refresh = async () => setData(await shareService.getData(token));

  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const payload = { ...form, time: form.time + ':00' };
      if (editingId) await shareService.updateActivity(token, editingId, payload);
      else await shareService.createActivity(token, payload);
      setForm(empty); setEditingId(null);
      await refresh();
    } catch (ex) { setErr(ex.response?.data || 'Error saving activity.'); }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({ name: a.name, date: a.date?.slice(0,10), time: a.time?.slice(0,5), location: a.location, description: a.description, estimatedCost: a.estimatedCost, status: a.status });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    await shareService.deleteActivity(token, id);
    await refresh();
  };

  return (
    <div className="shared-card">
      <h2>Activities</h2>
      {isEdit && (
        <form onSubmit={handleSubmit} className="shared-form">
          <h3>{editingId ? 'Edit Activity' : 'Add Activity'}</h3>
          {err && <p className="shared-error">{err}</p>}
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <label>Time</label>
          <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
          <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input type="number" placeholder="Estimated Cost (€)" value={form.estimatedCost || ''} onChange={e => setForm({ ...form, estimatedCost: parseFloat(e.target.value) || 0 })} />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="Planned">Planned</option>
            <option value="Reserved">Reserved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="shared-form-btns">
            <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setForm(empty); setEditingId(null); }}>Cancel</button>}
          </div>
        </form>
      )}
      {activities.length === 0 ? <p style={{ color: '#475569' }}>No activities yet.</p> : activities.map(a => (
        <div key={a.id} className="shared-item">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>{a.name}</strong>
              <span className={`status-badge status-${a.status?.toLowerCase()}`}>{a.status}</span>
            </div>
            <p>📅 {a.date?.slice(0,10)} {a.time?.slice(0,5)} · 📍 {a.location}</p>
            {a.estimatedCost > 0 && <p style={{ color: '#6ee7b7' }}>💰 {a.estimatedCost}€</p>}
          </div>
          {isEdit && (
            <div className="shared-item-btns">
              <button onClick={() => handleEdit(a)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(a.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============ EXPENSES ============
function ExpensesSection({ token, expenses, budget, setData, isEdit }) {
  const empty = { name: '', category: 'Other', amount: '', date: '', description: '' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState('');
  const categories = ['Transport', 'Accommodation', 'Food', 'Tickets', 'Shopping', 'Other'];
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const refresh = async () => setData(await shareService.getData(token));

  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      if (editingId) await shareService.updateExpense(token, editingId, form);
      else await shareService.createExpense(token, form);
      setForm(empty); setEditingId(null);
      await refresh();
    } catch (ex) { setErr(ex.response?.data || 'Error saving expense.'); }
  };

  const handleEdit = (ex) => {
    setEditingId(ex.id);
    setForm({ name: ex.name, category: ex.category, amount: ex.amount, date: ex.date?.slice(0,10), description: ex.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await shareService.deleteExpense(token, id);
    await refresh();
  };

  return (
    <div className="shared-card">
      <h2>Expenses</h2>
      <div className="budget-summary">
        <span>Budget: {budget}€</span>
        <span>Spent: {totalSpent}€</span>
        <span style={{ color: budget - totalSpent < 0 ? '#f87171' : '#6ee7b7' }}>
          Remaining: {(budget - totalSpent).toFixed(2)}€
        </span>
      </div>
      {isEdit && (
        <form onSubmit={handleSubmit} className="shared-form">
          <h3>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
          {err && <p className="shared-error">{err}</p>}
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Amount (€)" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="shared-form-btns">
            <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={() => { setForm(empty); setEditingId(null); }}>Cancel</button>}
          </div>
        </form>
      )}
      {expenses.length === 0 ? <p style={{ color: '#475569' }}>No expenses yet.</p> : expenses.map(ex => (
        <div key={ex.id} className="shared-item">
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <strong>{ex.name}</strong>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{ex.category}</span>
            </div>
            <p>{ex.date?.slice(0,10)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#f87171', fontWeight: 700 }}>{ex.amount}€</span>
            {isEdit && (
              <div className="shared-item-btns">
                <button onClick={() => handleEdit(ex)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(ex.id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ CHECKLIST ============
function ChecklistSection({ token, checklistItems, setData, isEdit }) {
  const [text, setText] = useState('');

  const refresh = async () => setData(await shareService.getData(token));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await shareService.createChecklistItem(token, text.trim());
    setText('');
    await refresh();
  };

  const handleToggle = async (item) => {
    await shareService.updateChecklistItem(token, item.id, { text: item.text, isCompleted: !item.isCompleted });
    await refresh();
  };

  const handleDelete = async (id) => {
    await shareService.deleteChecklistItem(token, id);
    await refresh();
  };

  const done = checklistItems.filter(c => c.isCompleted).length;

  return (
    <div className="shared-card">
      <h2>Checklist ({done}/{checklistItems.length})</h2>
      {isEdit && (
        <form onSubmit={handleAdd} className="shared-form">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input placeholder="Add item..." value={text} onChange={e => setText(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" style={{ width: 'auto', flexShrink: 0 }}>Add</button>
          </div>
        </form>
      )}
      {checklistItems.length === 0 ? <p style={{ color: '#475569' }}>No items yet.</p> : checklistItems.map(c => (
        <div key={c.id} className="checklist-item">
          <span
            onClick={() => isEdit && handleToggle(c)}
            style={{ cursor: isEdit ? 'pointer' : 'default', fontSize: '20px' }}
          >
            {c.isCompleted ? '✅' : '⬜'}
          </span>
          <span style={{ flex: 1, color: c.isCompleted ? '#475569' : '#e2e8f0', textDecoration: c.isCompleted ? 'line-through' : 'none' }}>
            {c.text}
          </span>
          {isEdit && (
            <button className="danger small" onClick={() => handleDelete(c.id)}>✕</button>
          )}
        </div>
      ))}
    </div>
  );
}
