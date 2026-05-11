import { useState } from "react";
import "./TripDetail.css";

export default function TripDetail() {
  const [activeTab, setActiveTab] = useState("overview");

  const [destinations, setDestinations] = useState([
    { id: 1, name: "Atina" },
    { id: 2, name: "Santorini" }
  ]);

  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [checklist, setChecklist] = useState([]);

  const [newDestination, setNewDestination] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newChecklist, setNewChecklist] = useState("");

  const trip = {
    name: "Leto u Grčkoj",
    startDate: "2026-07-01",
    endDate: "2026-07-10",
    budget: 1200,
    notes: "Rezervisati smještaj ranije"
  };

  // ================= DESTINATIONS =================
  const addDestination = () => {
    if (!newDestination) return;

    setDestinations([
      ...destinations,
      { id: Date.now(), name: newDestination }
    ]);

    setNewDestination("");
  };

  const deleteDestination = (id) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const updateDestination = (id, newName) => {
    setDestinations(
      destinations.map(d =>
        d.id === id ? { ...d, name: newName } : d
      )
    );
  };

  // ================= ACTIVITIES =================
  const addActivity = () => {
    if (!newActivity) return;

    setActivities([
      ...activities,
      { id: Date.now(), text: newActivity }
    ]);

    setNewActivity("");
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  // ================= EXPENSES =================
  const addExpense = () => {
    if (!newExpenseName || !newExpenseAmount) return;

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        name: newExpenseName,
        amount: Number(newExpenseAmount)
      }
    ]);

    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ================= CHECKLIST =================
  const addChecklistItem = () => {
    if (!newChecklist) return;

    setChecklist([
      ...checklist,
      { id: Date.now(), text: newChecklist, done: false }
    ]);

    setNewChecklist("");
  };

  const toggleChecklist = (id) => {
    setChecklist(
      checklist.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const deleteChecklist = (id) => {
    setChecklist(checklist.filter(i => i.id !== id));
  };

  // ================= UI =================
  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="headerCard">
        <div>
          <h1>{trip.name}</h1>
          <p>{trip.startDate} - {trip.endDate}</p>
        </div>

        <div className="budgetBox">
          <p>💰 Budget</p>
          <h2>{trip.budget}€</h2>
          <span>Spent: {totalSpent}€</span>
        </div>
      </div>

      {/* BODY */}
      <div className="body">

        {/* SIDEBAR */}
        <div className="sidebar">
          <button onClick={() => setActiveTab("overview")}>Overview</button>
          <button onClick={() => setActiveTab("destinations")}>Destinations</button>
          <button onClick={() => setActiveTab("activities")}>Activities</button>
          <button onClick={() => setActiveTab("expenses")}>Expenses</button>
          <button onClick={() => setActiveTab("checklist")}>Checklist</button>
        </div>

        {/* CONTENT */}
        <div className="content">
            <div className="contentInner">

            

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="card">
              <h2>Overview</h2>
              <p>{trip.notes}</p>

              <div className="stats">
                <div>⏳ Days: 10</div>
                <div>📍 Destinations: {destinations.length}</div>
                <div>📌 Activities: {activities.length}</div>
              </div>
            </div>
          )}

          {/* DESTINATIONS */}
          {activeTab === "destinations" && (
            <div className="card">
              <h2>Destinations</h2>

              <input
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="New destination"
              />
              <button onClick={addDestination}>Add</button>

              <ul>
                {destinations.map(d => (
                  <li key={d.id}>
                    {d.name}

                    <button onClick={() => deleteDestination(d.id)}>🗑 Delete</button>

                    <button
                      onClick={() => {
                        const newName = prompt("New name:", d.name);
                        if (newName) updateDestination(d.id, newName);
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ACTIVITIES */}
          {activeTab === "activities" && (
            <div className="card">
              <h2>Activities</h2>

              <input
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="New activity"
              />
              <button onClick={addActivity}>Add</button>

              <ul>
                {activities.map(a => (
                  <li key={a.id}>
                    {a.text}
                    <button onClick={() => deleteActivity(a.id)}>🗑 Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* EXPENSES */}
          {activeTab === "expenses" && (
            <div className="card">
              <h2>Expenses</h2>

              <input
                value={newExpenseName}
                onChange={(e) => setNewExpenseName(e.target.value)}
                placeholder="Name"
              />
              <input
                type="number"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                placeholder="Amount"
              />
              <button onClick={addExpense}>Add</button>

              <p>Total spent: {totalSpent}€</p>
              <p>Remaining: {trip.budget - totalSpent}€</p>

              <ul>
                {expenses.map(e => (
                  <li key={e.id}>
                    {e.name} - {e.amount}€
                    <button onClick={() => deleteExpense(e.id)}>🗑</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="card">
              <h2>Checklist</h2>

              <input
                value={newChecklist}
                onChange={(e) => setNewChecklist(e.target.value)}
                placeholder="New item"
              />
              <button onClick={addChecklistItem}>Add</button>

              <ul>
                {checklist.map(item => (
                  <li key={item.id}>
                    <span
                      onClick={() => toggleChecklist(item.id)}
                      style={{
                        textDecoration: item.done ? "line-through" : "none",
                        cursor: "pointer"
                      }}
                    >
                      {item.text}
                    </span>

                    <button onClick={() => deleteChecklist(item.id)}>🗑</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
            </div>
        </div>
      </div>
    </div>
  );
}