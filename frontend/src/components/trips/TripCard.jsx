import { useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import '../TripCard.css';

export default function TripCard({ trip, onDeleted }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm(`Delete "${trip.name}"?`)) return;
    try {
      await tripService.delete(trip.id);
      onDeleted(trip.id);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="trip-card">
      <h3 className="trip-title">{trip.name}</h3>
      <p className="trip-dates">{trip.startDate?.slice(0, 10)} - {trip.endDate?.slice(0, 10)}</p>
      <p className="trip-dates">{trip.description}</p>
      <p className="trip-budget">Budget: {trip.budget}€</p>
      <div className="trip-buttons">
        <button className="trip-button open-btn" onClick={() => navigate(`/trips/detail/${trip.id}`)}>Open</button>
        <button className="trip-button edit-btn" onClick={() => navigate(`/trips/edit/${trip.id}`)}>Edit</button>
        <button className="trip-button delete-btn" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
