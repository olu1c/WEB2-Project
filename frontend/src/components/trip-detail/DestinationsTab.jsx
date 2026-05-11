import { useState } from 'react';
import { destinationService } from '../../services/destinationService';

export default function DestinationsTab({ tripId, destinations, setDestinations, trip }) {
  const tripStart = trip?.startDate?.slice(0, 10);
  const tripEnd = trip?.endDate?.slice(0, 10);

  const [form, setForm] = useState({ name: '', location: '', arrivalDate: '', departureDate: '', description: '' });
  const [error, setError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);

    if (tripStart && form.arrivalDate < tripStart) {
      setError(`Arrival date cannot be before trip start (${tripStart}).`);
      return;
    }
    if (tripEnd && form.departureDate > tripEnd) {
      setError(`Departure date cannot be after trip end (${tripEnd}).`);
      return;
    }

    try {
      const created = await destinationService.create(tripId, form);
      setDestinations(prev => [...prev, created]);
      setForm({ name: '', location: '', arrivalDate: '', departureDate: '', description: '' });
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await destinationService.delete(tripId, id);
      setDestinations(prev => prev.filter(d => d.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="card">
      <h2>Destinations</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAdd}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input type="date" required min={tripStart} max={tripEnd} value={form.arrivalDate} onChange={e => setForm({ ...form, arrivalDate: e.target.value })} />
        <input type="date" required min={tripStart} max={tripEnd} value={form.departureDate} onChange={e => setForm({ ...form, departureDate: e.target.value })} />
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {destinations.map(d => (
          <li key={d.id}>
            <strong>{d.name}</strong> — {d.location} ({d.arrivalDate?.slice(0, 10)} → {d.departureDate?.slice(0, 10)})
            <button onClick={() => handleDelete(d.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
