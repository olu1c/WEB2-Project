import { useState } from 'react';
import { destinationService } from '../../services/destinationService';
import Toast from '../common/Toast';

export default function DestinationsTab({ tripId, destinations, setDestinations, trip }) {
  const tripStart = trip?.startDate?.slice(0, 10);
  const tripEnd = trip?.endDate?.slice(0, 10);

  const [form, setForm] = useState({ name: '', location: '', arrivalDate: '', departureDate: '', description: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!form.arrivalDate) e.arrivalDate = 'Arrival date is required.';
    if (!form.departureDate) e.departureDate = 'Departure date is required.';
    if (form.arrivalDate && form.departureDate && form.departureDate < form.arrivalDate)
      e.departureDate = 'Departure date cannot be before arrival date.';
    if (tripStart && form.arrivalDate && form.arrivalDate < tripStart)
      e.arrivalDate = `Cannot be before trip start (${tripStart}).`;
    if (tripEnd && form.departureDate && form.departureDate > tripEnd)
      e.departureDate = `Cannot be after trip end (${tripEnd}).`;
    return e;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    try {
      if (editingId) {
        await destinationService.update(tripId, editingId, form);
        setDestinations(prev => prev.map(d => d.id === editingId ? { ...d, ...form } : d));
        setEditingId(null);
        setToast({ message: 'Destination updated successfully!', type: 'success' });
      } else {
        const created = await destinationService.create(tripId, form);
        setDestinations(prev => [...prev, created]);
        setToast({ message: 'Destination added successfully!', type: 'success' });
      }
      setForm({ name: '', location: '', arrivalDate: '', departureDate: '', description: '' });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setErrors({});
    setForm({
      name: d.name, location: d.location,
      arrivalDate: d.arrivalDate?.slice(0, 10),
      departureDate: d.departureDate?.slice(0, 10),
      description: d.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setForm({ name: '', location: '', arrivalDate: '', departureDate: '', description: '' });
  };

  const handleDelete = async (id) => {
    try {
      await destinationService.delete(tripId, id);
      setDestinations(prev => prev.filter(d => d.id !== id));
      setToast({ message: 'Destination deleted.', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  return (
    <div className="card">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2>Destinations</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        {errors.name && <p className="field-error">{errors.name}</p>}
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        {errors.location && <p className="field-error">{errors.location}</p>}
        <input type="date" min={tripStart} max={tripEnd} value={form.arrivalDate} onChange={e => setForm({ ...form, arrivalDate: e.target.value })} />
        {errors.arrivalDate && <p className="field-error">{errors.arrivalDate}</p>}
        <input type="date" min={tripStart} max={tripEnd} value={form.departureDate} onChange={e => setForm({ ...form, departureDate: e.target.value })} />
        {errors.departureDate && <p className="field-error">{errors.departureDate}</p>}
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">{editingId ? 'Save' : 'Add'}</button>
        {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>
      <ul>
        {destinations.map(d => (
          <li key={d.id}>
            <strong>{d.name}</strong> — {d.location} ({d.arrivalDate?.slice(0, 10)} → {d.departureDate?.slice(0, 10)})
            {d.description && <span style={{ color: 'gray', fontSize: '13px' }}> — {d.description}</span>}
            <button onClick={() => handleEdit(d)}>✏️</button>
            <button onClick={() => handleDelete(d.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
