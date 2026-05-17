import { useState } from 'react';
import { checklistService } from '../../services/checklistService';
import Toast from '../common/Toast';

export default function ChecklistTab({ tripId, checklist, setChecklist }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) { setError('Item text cannot be empty.'); return; }
    setError('');
    try {
      const created = await checklistService.create(tripId, text.trim());
      setChecklist(prev => [...prev, created]);
      setText('');
      setToast({ message: 'Item added!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  const handleToggle = async (item) => {
    try {
      await checklistService.update(tripId, item.id, { text: item.text, isCompleted: !item.isCompleted });
      setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, isCompleted: !c.isCompleted } : c));
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await checklistService.delete(tripId, id);
      setChecklist(prev => prev.filter(c => c.id !== id));
      setToast({ message: 'Item deleted.', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data || err.message, type: 'error' });
    }
  };

  const done = checklist.filter(c => c.isCompleted).length;

  return (
    <div className="card">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2>Checklist ({done}/{checklist.length})</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="New item (passport, ticket...)" value={text} onChange={e => { setText(e.target.value); setError(''); }} />
        {error && <p className="field-error">{error}</p>}
        <button type="submit">Add</button>
      </form>
      <ul>
        {checklist.map(item => (
          <li key={item.id}>
            <span onClick={() => handleToggle(item)} style={{ textDecoration: item.isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}>
              {item.isCompleted ? '✅' : '⬜'} {item.text}
            </span>
            <button onClick={() => handleDelete(item.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
