import { useState } from 'react';
import { checklistService } from '../../services/checklistService';

export default function ChecklistTab({ tripId, checklist, setChecklist }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    try {
      const created = await checklistService.create(tripId, text.trim());
      setChecklist(prev => [...prev, created]);
      setText('');
    } catch (err) { setError(err.message); }
  };

  const handleToggle = async (item) => {
    try {
      await checklistService.update(tripId, item.id, { text: item.text, isCompleted: !item.isCompleted });
      setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, isCompleted: !c.isCompleted } : c));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await checklistService.delete(tripId, id);
      setChecklist(prev => prev.filter(c => c.id !== id));
    } catch (err) { alert(err.message); }
  };

  const done = checklist.filter(c => c.isCompleted).length;

  return (
    <div className="card">
      <h2>Checklist ({done}/{checklist.length})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAdd}>
        <input placeholder="New item (passport, ticket...)" value={text} onChange={e => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {checklist.map(item => (
          <li key={item.id}>
            <span
              onClick={() => handleToggle(item)}
              style={{ textDecoration: item.isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}
            >
              {item.isCompleted ? '✅' : '⬜'} {item.text}
            </span>
            <button onClick={() => handleDelete(item.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
