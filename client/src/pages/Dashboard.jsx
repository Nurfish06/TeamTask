import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, CheckCircle, Clock } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const StatCard = ({ title, value, icon, gradient }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px', background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/tasks');
        setTasks(data);
        const completed = data.filter(t => t.status === 'Completed').length;
        const inProgress = data.filter(t => t.status === 'In Progress').length;
        setTaskStats({ total: data.length, completed, inProgress });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchDashboardData();
  }, [user]);

  const progressData = [
    { name: 'Completed', value: taskStats.completed },
    { name: 'In Progress', value: taskStats.inProgress },
    { name: 'Not Started', value: taskStats.total - taskStats.completed - taskStats.inProgress }
  ];

  return (
    <div>
      <h1>Dashboard Overview</h1>
      
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <StatCard 
          title="Total Tasks" 
          value={taskStats.total} 
          icon={<Target />} 
          gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
        />
        <StatCard 
          title="Completed Tasks" 
          value={taskStats.completed} 
          icon={<CheckCircle />} 
          gradient="linear-gradient(135deg, #10b981, #059669)"
        />
        <StatCard 
          title="Pending Tasks" 
          value={taskStats.inProgress + (taskStats.total - taskStats.completed - taskStats.inProgress)} 
          icon={<Clock />} 
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
        />
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Task Progress Breakdown</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            {progressData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}: {entry.value}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Tasks</h3>
            <span className="badge badge-primary">{tasks.length} Total</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} style={{ 
                padding: '1rem', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{task.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.category}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                    {task.progress}%
                  </div>
                  <span className={`badge ${
                    task.status === 'Completed' ? 'badge-success' : 
                    task.status === 'In Progress' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                No tasks available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
