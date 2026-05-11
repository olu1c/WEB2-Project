import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import '../CreateTrip.css';


export default function TripForm({ label, initialData, tripId }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    startDate: initialData?.startDate?.slice(0, 10) ?? '',
    endDate: initialData?.endDate?.slice(0, 10) ?? '',
    budget: initialData?.budget ?? '',
    notes: initialData?.notes ?? '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date cannot be before start date.');
      return;
    }
    if (Number(form.budget) < 0) {
      setError('Budget cannot be negative.');
      return;
    }

    try {
      const payload = { ...form, budget: Number(form.budget) };
      if (tripId) {
        await tripService.update(tripId, payload);
        navigate(`/trips/detail/${tripId}`);
      } else {
        const created = await tripService.create(payload);
        navigate(`/trips/detail/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{label} Trip</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Trip Name</label>
        <input required name="name" onChange={handleChange} value={form.name} />
      </div>
      <div>
        <label>Description</label>
        <textarea required name="description" onChange={handleChange} value={form.description} />
      </div>
      <div>
        <label>Start Date</label>
        <input type="date" required name="startDate" onChange={handleChange} value={form.startDate} />
      </div>
      <div>
        <label>End Date</label>
        <input type="date" required name="endDate" onChange={handleChange} value={form.endDate} />
      </div>
      <div>
        <label>Budget (€)</label>
        <input type="number" required min="0" name="budget" onChange={handleChange} value={form.budget} />
      </div>
      <div>
        <label>Notes</label>
        <textarea name="notes" onChange={handleChange} value={form.notes} />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button type="submit" style={{ width: '100%' }}>{label}</button>
        {tripId && (
          <button type="button" style={{ width: '100%' }} onClick={() => navigate(`/trips/detail/${tripId}`)}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
