import { useState } from 'react';
import './CalendarView.css';

export default function CalendarView({ activities, onDeleteActivity }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Group activities by date
  const grouped = activities.reduce((acc, a) => {
    const day = a.date?.slice(0, 10);
    if (!day) return acc;
    if (!acc[day]) acc[day] = [];
    acc[day].push(a);
    return acc;
  }, {});

  // Get days in month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday-based offset
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDay = (d) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const selectedActivities = selectedDay ? (grouped[selectedDay] || []) : [];

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button className="cal-nav" onClick={prevMonth}>‹</button>
        <span className="cal-title">{monthNames[month]} {year}</span>
        <button className="cal-nav" onClick={nextMonth}>›</button>
      </div>

      <div className="calendar-grid">
        {dayNames.map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="cal-cell empty" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDay(day);
          const hasActivities = grouped[dateStr]?.length > 0;
          const isSelected = selectedDay === dateStr;

          return (
            <div
              key={day}
              className={`cal-cell ${hasActivities ? 'has-activities' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDay(isSelected ? null : dateStr)}
            >
              <span className="cal-day-num">{day}</span>
              {hasActivities && (
                <span className="cal-dot">{grouped[dateStr].length}</span>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="cal-activities">
          <h4>📅 {selectedDay}</h4>
          {selectedActivities.length === 0 ? (
            <p className="no-activities">No activities for this day.</p>
          ) : (
            <ul className="cal-activity-list">
              {selectedActivities.sort((a, b) => a.time?.localeCompare(b.time)).map(a => (
                <li key={a.id} className="cal-activity-item">
                  <div className="cal-activity-time">{a.time?.slice(0, 5)}</div>
                  <div className="cal-activity-info">
                    <strong>{a.name}</strong>
                    <span>📍 {a.location}</span>
                    <span className={`status-badge status-${a.status?.toLowerCase()}`}>{a.status}</span>
                    {a.estimatedCost > 0 && <span>💶 {a.estimatedCost}€</span>}
                  </div>
                  <button className="cal-delete-btn" onClick={() => onDeleteActivity(a.id)}>🗑</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
