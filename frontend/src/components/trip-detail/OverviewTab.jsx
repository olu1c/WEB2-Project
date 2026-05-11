export default function OverviewTab({ trip, destinationsCount, activitiesCount }) {
  const days = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="card">
      <h2>Overview</h2>
      <p>{trip.notes}</p>
      <div className="stats">
        <div>⏳ Days: {days}</div>
        <div>📍 Destinations: {destinationsCount}</div>
        <div>📌 Activities: {activitiesCount}</div>
      </div>
    </div>
  );
}
