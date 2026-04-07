import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, Clock, Users, LogOut } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <LayoutDashboard size={24} />
          <span>TeamTask</span>
        </div>
        
        <ul className="nav-menu">
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} end>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <CheckSquare size={20} /> Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/overtime" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <Clock size={20} /> Overtime
            </NavLink>
          </li>
          {user?.role === 'manager' && (
            <li>
              <NavLink to="/team" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                <Users size={20} /> Team Members
              </NavLink>
            </li>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.name}</div>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                {user?.role === 'manager' ? 'Manager' : 'Team Member'}
              </span>
            </div>
            
            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content area */}
        <div className="page-content animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
