import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tripService } from '../services/tripService';
import TripForm from '../components/trips/TripForm';

export default function EditTripPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    tripService.getById(id)
      .then(setTrip)
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!trip) return <p>Loading...</p>;

  return <TripForm label="Edit" initialData={trip} tripId={id} />;
}
