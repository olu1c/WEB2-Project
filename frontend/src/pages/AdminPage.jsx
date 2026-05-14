import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import './AdminPage.css';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getUsers().then(setUsers).catch(e => setError(e.message));
    adminService.getAllTrips().then(setTrips).catch(e => setError(e.message));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await adminService.changeRole(id, 'Admin');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'Admin' } : u));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Panel</h1>
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-section">
        <h2>Users</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role === 'Admin' ? 'role-admin' : 'role-user'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="action-buttons">
                  {u.role !== 'Admin' && (
                    <button className="btn-make-admin" onClick={() => handleMakeAdmin(u.id)}>Make Admin</button>
                  )}
                  <button className="btn-delete" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h2>All Trips</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>User Id</th>
              <th>Name</th>
              <th>Start</th>
              <th>End</th>
              <th>Budget</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.userId}</td>
                <td>{t.name}</td>
                <td>{t.startDate?.slice(0, 10)}</td>
                <td>{t.endDate?.slice(0, 10)}</td>
                <td>{t.budget}€</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
