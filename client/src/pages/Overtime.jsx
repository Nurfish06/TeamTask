import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

const Overtime = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOvertimeData();
  }, [user]);

  const fetchOvertimeData = async () => {
    try {
      const [summaryRes, logsRes] = await Promise.all([
        axios.get('/api/overtime/summary'),
        axios.get('/api/overtime')
      ]);
      setSummary(summaryRes.data);
      setLogs(logsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching overtime data:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Overtime & Shift Management</h1>
        {user?.role === 'manager' && (
          <button className="btn" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-color)' }}>
            <Download size={18} /> Export Excel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Net Overtime Balance</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Total Earned (Hours)</th>
                <th>Total Deducted (Hours)</th>
                <th>Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>Loading summary...</td></tr>
              ) : summary.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No data available</td></tr>
              ) : (
                summary.map((item) => (
                  <tr key={item.userId}>
                    <td style={{ fontWeight: '500' }}>
                      {item.name} <br/>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.email}</span>
                    </td>
                    <td style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>+{item.totalEarned}h</td>
                    <td style={{ color: 'var(--danger-color)', fontWeight: '600' }}>-{item.totalDeducted}h</td>
                    <td>
                      <span className={`badge ${item.netBalance >= 0 ? 'badge-success' : 'badge-danger'}`}>
                        {item.netBalance}h
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0 }}>Recent Activity Log</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Member</th>
                <th>Shift Type</th>
                <th>Earned</th>
                <th>Deducted</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No logs recorded</td></tr>
              ) : (
                logs.slice(0, 10).map((log) => (
                  <tr key={log._id}>
                    <td>{format(new Date(log.date), 'MMM dd, yyyy')}</td>
                    <td>{log.user?.name}</td>
                    <td><span className="badge badge-primary">{log.shiftType}</span></td>
                    <td>+{log.hoursEarned}</td>
                    <td>-{log.hoursDeducted}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{log.deductionReason || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overtime;
