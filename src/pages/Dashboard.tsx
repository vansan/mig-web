import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Package, Settings, LogOut,
  Clock, Shield, Star, Briefcase, ChevronRight, X, Cpu, Sparkles 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Guest User',
    email: '',
    phone: '',
    licenseKey: '',
    planName: '',
    roundsRemaining: 0,
    expiryDate: ''
  });

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const user = JSON.parse(raw);
      setProfile({
        name: user.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone: user.mobile || '',
        licenseKey: user.licenseKey || '',
        planName: user.planName || 'Active Plan',
        roundsRemaining: user.roundsRemaining ?? 0,
        expiryDate: user.expiryDate ? new Date(user.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
      });
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dash-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          <Sparkles size={24} className="primary-icon"/> MyInterviewGenie
        </Link>
        <div className="nav-menu">
          <a href="#" className="nav-item active"><LayoutDashboard size={18}/> Dashboard</a>
          <a href="#" className="nav-item"><History size={18}/> Interview History</a>
          <a href="#pricing" className="nav-item"><Package size={18}/> Manage Plan</a>
          <a href="#" className="nav-item"><Settings size={18}/> Settings</a>
        </div>
        <div className="mt-auto">
          <button onClick={handleLogout} className="nav-item text-danger" style={{background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left'}}><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dash-header">
          <div className="welcome-area">
            <h1>Welcome back, <span className="gradient-text">{profile.name}</span></h1>
            <p>{profile.email} • {profile.phone}</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={() => setEditModalOpen(true)}>Edit Profile</button>
            <div className="user-avatar">{profile.name.substring(0,2).toUpperCase()}</div>
          </div>
        </header>

        {/* Metrics */}
        <section className="dash-metrics">
          <div className="metric-box box-glow-blue">
            <div className="box-icon"><Clock size={22} className="text-blue"/></div>
            <div className="box-content">
              <h3>{profile.expiryDate || 'N/A'}</h3>
              <span>Plan Expiration</span>
            </div>
          </div>
          <div className="metric-box box-glow-green">
            <div className="box-icon"><Shield size={22} className="text-green"/></div>
            <div className="box-content">
              <h3>{profile.planName || 'No Plan'}</h3>
              <span>Active Plan</span>
            </div>
          </div>
          <div className="metric-box box-glow-purple">
            <div className="box-icon"><Briefcase size={22} className="text-purple"/></div>
            <div className="box-content">
              <h3>{profile.roundsRemaining}</h3>
              <span>Rounds Remaining</span>
            </div>
          </div>
          <div className="metric-box box-glow-orange">
            <div className="box-icon"><Star size={22} className="text-orange"/></div>
            <div className="box-content">
              <h3 style={{fontSize:'1rem', color:'#34d399'}}>✓ Available</h3>
              <span>Trial Mode (9 min)</span>
            </div>
          </div>
        </section>

        {/* Analytics & History */}
        <div className="dash-split">
          <div className="dash-card">
            <div className="dash-card-header">
              <h2><Briefcase size={20} className="primary-icon"/> Recent Interviews</h2>
              <a href="#" className="view-all">View All <ChevronRight size={14}/></a>
            </div>
            <div className="history-list">
              {[
                { r: "Full Stack Developer", c: "Finsora", date: "Mar 26, 2026", dur: "47m", tkns: 144 },
                { r: "Frontend Engineer", c: "Micro1", date: "Mar 24, 2026", dur: "39m", tkns: 29 },
                { r: "Senior Developer", c: "Xudu Technologies", date: "Mar 13, 2026", dur: "21m", tkns: 24 }
              ].map((h, i) => (
                <div className="history-item" key={i}>
                  <div className="h-icon"><Briefcase size={20} /></div>
                  <div className="h-info">
                    <h4>{h.r} <span className="badge">COMPLETED</span></h4>
                    <p>{h.c} • {h.date} ({h.dur})</p>
                  </div>
                  <div className="h-stats">
                    <Cpu size={14} className="text-muted"/> {h.tkns} requests
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card bg-gradient-brand">
            <h2>Need more rounds?</h2>
            <p>Your job hunt is looking solid! Top up your sessions or unlock the unlimited Pro plan to maximize your chances.</p>
            <Link to="/" className="btn btn-outline" style={{background: 'var(--bg-app)', border: 'none', color: 'var(--text-main)', marginTop: '1rem', width: '100%'}}>View Packages</Link>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button onClick={() => setEditModalOpen(false)} className="close-btn"><X size={20}/></button>
            </div>
            <div className="modal-body">
              <label>Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
              
              <label>Email Address</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
              
              <label>Phone Number</label>
              <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
              
              <button 
                className="btn btn-primary" 
                style={{width: '100%', marginTop: '1rem'}} 
                onClick={() => setEditModalOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
