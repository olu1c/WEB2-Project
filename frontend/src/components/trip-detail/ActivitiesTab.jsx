import { useState } from 'react';
import { activityService } from '../../services/activityService';
import { ActivityStatus } from '../../models/Activity';
import CalendarView from './CalendarView';
import Toast from '../common/Toast';

export default function ActivitiesTab({ tripId, activities, setActivities, trip }) {
  const tripStart = trip?.startDate?.slice(0, 10);
  const tripEnd = trip?.endDate?.slice(0, 10);

  const [form, setForm] = useState({ name: '', date: '', time: '00:00:00', location: '', description: '', estimatedCost: '', status: ActivityStatus.Planned });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.date) e.date = 'Date is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (form.estimatedCost !== '' && Number(form.estimatedCost) < 0)
      e.estimatedCost = 'Cost cannot be negative.';
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
        await activityService.update(tripId, editingId, { ...form, estimatedCost: Number(form.estimatedCost) });
        setActivities(prev => prev.map(a => a.id === editingId ? { ...a, ...form, estimatedCost: Number(form.estimatedCost) } : a));
        setEditingId(null);
        setToast({ message: 'Activity updated successfully!', type: 'success' });
      } else {
        const created = await activityService.create(tripId, { ...form, estimatedCost: Number(form.estimatedCost) });
        setActivities(prev => [...prev, created]);
        setToast({ message: 'Activity added successfully!', type: 'success' });
      }
      setForm({ name: '', date: '', time: '00:00:00', location: '', description: '', estimatedCost: '', status: ActivityStatus.Planned });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setErrors({});
    setForm({
      name: a.name, date: a.date?.slice(0, 10), time: a.time || '00:00:00',
      location: a.location, description: a.description || '',
      estimatedCost: a.estimatedCost, status: a.status
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setForm({ name: '', date: '', time: '00:00:00', location: '', description: '', estimatedCost: '', status: ActivityStatus.Planned });
  };

  const handleDelete = async (id) => {
    try {
      await activityService.delete(tripId, id);
      setActivities(prev => prev.filter(a => a.id !== id));
      setToast({ message: 'Activity deleted.', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  const grouped = activities.reduce((acc, a) => {
    const day = a.date?.slice(0, 10) ?? 'Unknown';
    if (!acc[day]) acc[day] = [];
    acc[day].push(a);
    return acc;
  }, {});

  return (
    <div className="card">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Activities</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => setView('list')}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #6366f1', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              background: view === 'list' ? '#6366f1' : 'transparent', color: view === 'list' ? 'white' : '#6366f1' }}>
            List
          </button>
          <button type="button" onClick={() => setView('calendar')}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #6366f1', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              background: view === 'calendar' ? '#6366f1' : 'transparent', color: view === 'calendar' ? 'white' : '#6366f1' }}>
            Calendar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        {errors.name && <p className="field-error">{errors.name}</p>}
        <input type="date" min={tripStart} max={tripEnd} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        {errors.date && <p className="field-error">{errors.date}</p>}
        <input type="time" value={form.time?.slice(0, 5)} onChange={e => setForm({ ...form, time: e.target.value + ':00' })} />
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        {errors.location && <p className="field-error">{errors.location}</p>}
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="number" min="0" placeholder="Estimated cost (€)" value={form.estimatedCost} onChange={e => setForm({ ...form, estimatedCost: e.target.value })} />
        {errors.estimatedCost && <p className="field-error">{errors.estimatedCost}</p>}
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {Object.values(ActivityStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit">{editingId ? 'Save' : 'Add'}</button>
        {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>

      {view === 'list' ? (
        Object.entries(grouped).sort().map(([day, acts]) => (
          <div key={day}>
            <h4>📅 {day}</h4>
            <ul>
              {acts.map(a => (
                <li key={a.id}>
                  {a.time?.slice(0, 5)} — <strong>{a.name}</strong> 📍{a.location} [{a.status}] {a.estimatedCost}€
                  <button onClick={() => handleEdit(a)}>✏️</button>
                  <button onClick={() => handleDelete(a.id)}>🗑</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <CalendarView activities={activities} onDeleteActivity={handleDelete} />
      )}
    </div>
  );
}
