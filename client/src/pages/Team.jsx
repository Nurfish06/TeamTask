import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data } = await axios.get('/api/auth/members');
      setMembers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Team Directory</h1>
        <button className="btn btn-primary">
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-3">
        {loading ? (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '2rem' }}>Loading team members...</div>
        ) : members.length === 0 ? (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No team members found. Add one to get started.
          </div>
        ) : (
          members.map(member => (
            <div key={member._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', height: '64px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--surface-color-light), var(--primary-color))',
                marginBottom: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white'
              }}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ margin: '0 0 0.25rem 0' }}>{member.name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{member.email}</div>
              <span className="badge badge-primary">Team Member</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Team;
