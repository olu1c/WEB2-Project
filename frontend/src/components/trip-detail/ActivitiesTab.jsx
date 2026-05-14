import { useState } from 'react';
import { activityService } from '../../services/activityService';
import { ActivityStatus } from '../../models/Activity';
import CalendarView from './CalendarView';

export default function ActivitiesTab({ tripId, activities, setActivities, trip }) {
  const tripStart = trip?.startDate?.slice(0, 10);
  const tripEnd = trip?.endDate?.slice(0, 10);

  const [form, setForm] = useState({ name: '', date: '', time: '00:00:00', location: '', description: '', estimatedCost: 0, status: ActivityStatus.Planned });
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);

    if (tripStart && form.date < tripStart) {
      setError(`Activity date cannot be before trip start (${tripStart}).`);
      return;
    }
    if (tripEnd && form.date > tripEnd) {
      setError(`Activity date cannot be after trip end (${tripEnd}).`);
      return;
    }

    try {
      const created = await activityService.create(tripId, { ...form, estimatedCost: Number(form.estimatedCost) });
      setActivities(prev => [...prev, created]);
      setForm({ name: '', date: '', time: '00:00:00', location: '', description: '', estimatedCost: 0, status: ActivityStatus.Planned });
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await activityService.delete(tripId, id);
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) { alert(err.message); }
  };

  const grouped = activities.reduce((acc, a) => {
    const day = a.date?.slice(0, 10) ?? 'Unknown';
    if (!acc[day]) acc[day] = [];
    acc[day].push(a);
    return acc;
  }, {});

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Activities</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setView('list')}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #6366f1', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              background: view === 'list' ? '#6366f1' : 'transparent',
              color: view === 'list' ? 'white' : '#6366f1' }}>
            List
          </button>
          <button
            type="button"
            onClick={() => setView('calendar')}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #6366f1', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              background: view === 'calendar' ? '#6366f1' : 'transparent',
              color: view === 'calendar' ? 'white' : '#6366f1' }}>
            Calendar
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAdd}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="date" required min={tripStart} max={tripEnd} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input type="time" value={form.time?.slice(0, 5)} onChange={e => setForm({ ...form, time: e.target.value + ':00' })} />
        <input required placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="number" min="0" placeholder="Est. cost (€)" value={form.estimatedCost} onChange={e => setForm({ ...form, estimatedCost: e.target.value })} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {Object.values(ActivityStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit">Add</button>
      </form>

      {view === 'list' ? (
        Object.entries(grouped).sort().map(([day, acts]) => (
          <div key={day}>
            <h4>📅 {day}</h4>
            <ul>
              {acts.map(a => (
                <li key={a.id}>
                  {a.time?.slice(0, 5)} — <strong>{a.name}</strong> @ {a.location} [{a.status}] {a.estimatedCost}€
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
