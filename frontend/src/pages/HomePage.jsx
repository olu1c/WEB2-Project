import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import TripCard from '../components/trips/TripCard';
import '../components/TripCard.css';

export default function HomePage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    tripService.getAll()
      .then(setTrips)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleted = (id) => setTrips(prev => prev.filter(t => t.id !== id));

  if (loading) return <p style={{ padding: '32px' }}>Loading trips...</p>;
  if (error) return <p style={{ padding: '32px', color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="trips-header">
        <h1>My Trips</h1>
        <button onClick={() => navigate('/trips/new')}>+ New Trip</button>
      </div>
      {trips.length === 0 ? (
        <p style={{ padding: '32px', color: 'var(--text-muted)' }}>No trips yet. Create your first one!</p>
      ) : (
        <div className="trips-grid">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
