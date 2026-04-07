import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-warning';
      default: return 'badge-danger';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks Directory</h1>
        {user?.role === 'manager' && (
          <button className="btn btn-primary">
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading tasks...</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No tasks found</td></tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td style={{ fontWeight: '500' }}>{task.name}</td>
                  <td>{task.category}</td>
                  <td>{task.assignedTo?.name || 'Unassigned'}</td>
                  <td>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--surface-color-light)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${task.progress}%`, backgroundColor: 'var(--primary-color)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.875rem' }}>{task.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" style={{ padding: '0.25rem', background: 'transparent', color: 'var(--primary-color)' }}>
                        <Edit2 size={16} />
                      </button>
                      {user?.role === 'manager' && (
                        <button className="btn" style={{ padding: '0.25rem', background: 'transparent', color: 'var(--danger-color)' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
