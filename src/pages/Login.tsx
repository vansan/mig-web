import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Smartphone, Lock, ArrowLeft } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const stateMessage = location.state?.message;

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length !== 10) {
       setError('Please enter a valid 10-digit mobile number');
       return;
    }
    if (!email) {
       setError('Please enter a valid email address');
       return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
       await axios.post(`${API_BASE_URL}/auth/request-otp`, { mobile, email });
       setStep('verify');
       setSuccessMsg('OTP sent to your mobile number and email. (Check server logs for dev mode)');
    } catch (err: any) {
       setError(err.response?.data?.message || 'Failed to request OTP. Please ensure your mobile number is registered.');
    } finally {
       setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
       setError('Please enter a valid 6-digit OTP');
       return;
    }

    setLoading(true);
    setError('');
    
    try {
       const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { mobile, otp });
       // Save token and navigate
       localStorage.setItem('token', res.data.token);
       localStorage.setItem('user', JSON.stringify(res.data.user));
       navigate('/dashboard');
    } catch (err: any) {
       setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
         <div className="login-header" style={{ position: 'relative' }}>
           <button 
             onClick={() => navigate('/')} 
             style={{ position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
             title="Back to Home"
           >
             <ArrowLeft size={24} />
           </button>
           {step === 'request' ? <Smartphone size={32} className="login-icon" /> : <Lock size={32} className="login-icon" />}
           <h2>{step === 'request' ? 'Login to Dashboard' : 'Verify OTP'}</h2>
           <p className="subtitle">
             {step === 'request' 
                ? 'Enter your registered mobile number'
                : `Enter the 6-digit code sent to ${mobile}`
             }
           </p>
         </div>

         {(stateMessage || successMsg) && (
             <div className="success-alert">{stateMessage || successMsg}</div>
         )}
         {error && <div className="error-alert">{error}</div>}

         {step === 'request' ? (
             <form onSubmit={handleRequestOtp} className="login-form">
                <div className="form-group">
                 <label htmlFor="email">Email Address</label>
                 <input
                   id="email"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="e.g. you@example.com"
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="mobile">Mobile Number</label>
                 <input
                   id="mobile"
                   type="text"
                   value={mobile}
                   onChange={(e) => setMobile(e.target.value)}
                   placeholder="e.g. 9876543210"
                   required
                   pattern="[0-9]{10}"
                 />
               </div>
               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                 <button type="button" className="btn btn-outline full-width" onClick={() => navigate('/')} disabled={loading}>
                   Cancel
                 </button>
                 <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                   {loading ? 'Sending...' : 'Request OTP'}
                 </button>
               </div>
             </form>
         ) : (
             <form onSubmit={handleVerifyOtp} className="login-form">
               <div className="form-group">
                 <label htmlFor="otp">Enter 6-digit OTP</label>
                 <input
                   id="otp"
                   type="text"
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   placeholder="123456"
                   required
                   maxLength={6}
                   pattern="[0-9]{6}"
                 />
               </div>
               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                 <button type="button" className="btn btn-outline full-width" onClick={() => setStep('request')} disabled={loading}>
                   Cancel
                 </button>
                 <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                   {loading ? 'Verifying...' : 'Verify & Login'}
                 </button>
               </div>
             </form>
         )}
      </div>
    </div>
  );
};

export default Login;
