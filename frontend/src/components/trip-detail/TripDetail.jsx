import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import { destinationService } from '../../services/destinationService';
import { activityService } from '../../services/activityService';
import { expenseService } from '../../services/expenseService';
import { checklistService } from '../../services/checklistService';
import OverviewTab from './OverviewTab';
import DestinationsTab from './DestinationsTab';
import ActivitiesTab from './ActivitiesTab';
import ExpensesTab from './ExpensesTab';
import ChecklistTab from './ChecklistTab';
import '../TripDetail.css';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [trip, setTrip] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [t, d, a, e, c] = await Promise.all([
          tripService.getById(id),
          destinationService.getAll(id),
          activityService.getAll(id),
          expenseService.getAll(id),
          checklistService.getAll(id),
        ]);
        setTrip(t);
        setDestinations(d);
        setActivities(a);
        setExpenses(e);
        setChecklist(c);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [id]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!trip) return <p>Trip not found.</p>;

  return (
    <div className="dashboard">
      <div className="headerCard">
        <div>
          <h1>{trip.name}</h1>
          <p>{trip.startDate?.slice(0, 10)} - {trip.endDate?.slice(0, 10)}</p>
        </div>
        <div className="budgetBox">
          <p>💰 Budget</p>
          <h2>{trip.budget}€</h2>
          <span>Spent: {totalSpent}€</span>
        </div>
      </div>

      <div className="body">
        <div className="sidebar">
          {['overview', 'destinations', 'activities', 'expenses', 'checklist'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'active-tab' : ''}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button className="edit-trip-btn" onClick={() => navigate(`/trips/edit/${id}`)}>✏️ Edit Trip</button>
        </div>

        <div className="content">
          <div className="contentInner">
            {activeTab === 'overview' && <OverviewTab trip={trip} destinationsCount={destinations.length} activitiesCount={activities.length} />}
            {activeTab === 'destinations' && <DestinationsTab tripId={id} destinations={destinations} setDestinations={setDestinations} trip={trip} />}
            {activeTab === 'activities' && <ActivitiesTab tripId={id} activities={activities} setActivities={setActivities} trip={trip} />}
            {activeTab === 'expenses' && <ExpensesTab tripId={id} expenses={expenses} setExpenses={setExpenses} budget={trip.budget} trip={trip} />}
            {activeTab === 'checklist' && <ChecklistTab tripId={id} checklist={checklist} setChecklist={setChecklist} />}
          </div>
        </div>
      </div>
    </div>
  );
}
