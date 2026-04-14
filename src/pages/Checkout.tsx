import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Shield, CheckCircle, Copy, MessageCircle, Clock, Smartphone } from 'lucide-react';
import './Checkout.css';

const UPI_ID = 'sanjaymgurav@okicici';
const ADMIN_WHATSAPP = '919876543210'; // replace with real number

const Checkout = () => {
  const [step, setStep] = useState<'form' | 'payment' | 'submitted'>('form');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [txnId, setTxnId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const planInfo = location.state || { name: 'Selected Plan', price: 999, planId: 'plan-id', rounds: 1 };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !mobile || !name) { setError('All fields are required.'); return; }
    if (!/^[0-9]{10}$/.test(mobile)) { setError('Enter a valid 10-digit mobile number.'); return; }
    
    setError('');
    setIsSubmitting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_BASE_URL}/auth/register-checkout`, { name, mobile, email });
      setStep('payment');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initialize checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I have paid ₹${planInfo.price} for *${planInfo.name}* (${planInfo.rounds} round${planInfo.rounds > 1 ? 's' : ''}).\n\nMy details:\n• Name: ${name}\n• Email: ${email}\n• Mobile: ${mobile}\n• UPI Txn ID: ${txnId || 'see screenshot'}\n\nPlease activate my plan. 🙏`
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, '_blank');
    setStep('submitted');
  };

  const handleGpayLink = () => {
    window.open(`upi://pay?pa=${UPI_ID}&pn=SanjayGurav&am=${planInfo.price}&cu=INR&tn=${encodeURIComponent(planInfo.name)}`, '_blank');
  };

  /* ─── STEP 1: FORM ─────────────────── */
  if (step === 'form') return (
    <div className="checkout-container">
      <div className="checkout-card">
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate(-1)} title="Go Back"><ArrowLeft size={20} /></button>
          <Shield size={32} className="checkout-icon" />
          <h2>Complete Your Purchase</h2>
          <p className="subtitle">You selected: <strong>{planInfo.name}</strong></p>
        </div>

        <div className="checkout-summary">
          <div className="summary-row"><span>Package</span><span>{planInfo.name}</span></div>
          <div className="summary-row"><span>Rounds</span><span>{planInfo.rounds} interview round{planInfo.rounds > 1 ? 's' : ''}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{planInfo.price.toLocaleString('en-IN')}</span></div>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleFormSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input id="mobile" type="text" value={mobile} onChange={e => setMobile(e.target.value)}
              placeholder="10-digit mobile" required pattern="[0-9]{10}" title="10 digit number" />
            <small className="help-text">This is used for your desktop app OTP login.</small>
          </div>

          <div className="upi-payment-note">
            <Smartphone size={16} className="note-icon" />
            <span>Payment is via <strong>UPI</strong>. After submitting, you'll see the QR code to pay.</span>
          </div>

          <div className="checkout-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
               {isSubmitting ? 'Registering...' : 'Continue to Payment →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  /* ─── STEP 2: PAYMENT ──────────────── */
  if (step === 'payment') return (
    <div className="checkout-container">
      <div className="checkout-card checkout-card-wide">
        <div className="checkout-header">
          <button className="back-btn" onClick={() => setStep('form')} title="Go Back"><ArrowLeft size={20} /></button>
          <h2>Pay via UPI</h2>
          <p className="subtitle">Scan QR or tap the button — then share screenshot with admin</p>
        </div>

        <div className="payment-layout">
          {/* QR Side */}
          <div className="qr-section">
            <div className="qr-card">
              <div className="qr-name-row">
                <div className="qr-avatar">SG</div>
                <div><div className="qr-person-name">Sanjay Gurav</div><div className="qr-person-sub">MyInterviewGenie</div></div>
              </div>
              <img src="/upi-qr.png" alt="UPI QR Code" className="qr-image" />
              <div className="upi-id-row">
                <span className="upi-id-label">UPI ID</span>
                <code className="upi-id-value">{UPI_ID}</code>
                <button className="copy-btn" onClick={handleCopyUpi} title="Copy UPI ID">
                  {copiedUpi ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="qr-sub">Scan with Google Pay, PhonePe, Paytm, or any UPI app</div>
            </div>

            <button className="btn btn-primary gpay-btn" onClick={handleGpayLink}>
              <Smartphone size={18} /> Open UPI App (₹{planInfo.price.toLocaleString('en-IN')})
            </button>
          </div>

          {/* Instructions Side */}
          <div className="instructions-section">
            <h3>How it works</h3>
            <div className="steps-list">
              <div className="instr-step">
                <div className="step-num">1</div>
                <div><strong>Scan or tap</strong> to pay ₹{planInfo.price.toLocaleString('en-IN')} via any UPI app</div>
              </div>
              <div className="instr-step">
                <div className="step-num">2</div>
                <div><strong>Note your Transaction ID</strong> from the payment success screen (optional but helpful)</div>
              </div>
              <div className="instr-step">
                <div className="step-num">3</div>
                <div><strong>Tap "Send Screenshot"</strong> below — it opens WhatsApp with your details pre-filled</div>
              </div>
              <div className="instr-step">
                <div className="step-num">4</div>
                <div><strong>Attach your payment screenshot</strong> and send. Admin will activate within 30 minutes.</div>
              </div>
            </div>

            <div className="txn-field">
              <label htmlFor="txnId">Transaction ID (optional)</label>
              <input id="txnId" type="text" value={txnId} onChange={e => setTxnId(e.target.value)}
                placeholder="e.g. 416789234567" />
              <small className="help-text">Find this in your UPI app after payment</small>
            </div>

            <div className="order-summary-mini">
              <div><span>Plan</span><span>{planInfo.name}</span></div>
              <div><span>Amount</span><span className="amount-highlight">₹{planInfo.price.toLocaleString('en-IN')}</span></div>
              <div><span>Name</span><span>{name}</span></div>
              <div><span>Mobile</span><span>{mobile}</span></div>
            </div>

            <button className="btn btn-whatsapp full-width" onClick={handleWhatsApp}>
              <MessageCircle size={18} />
              Send Screenshot on WhatsApp
            </button>
            <p className="wa-note"><Clock size={13} /> Admin activates plan within 30 minutes of receiving screenshot.</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── STEP 3: SUBMITTED ────────────── */
  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <div className="success-screen">
          <div className="success-icon-wrapper">
            <CheckCircle size={56} className="success-check" />
          </div>
          <h2>Payment Sent!</h2>
          <p className="subtitle">Thank you, <strong>{name}</strong>. Your payment details have been shared with our admin.</p>

          <div className="success-info-box">
            <div><span>Plan</span><span>{planInfo.name}</span></div>
            <div><span>Mobile</span><span>{mobile}</span></div>
            <div><span>Email</span><span>{email}</span></div>
            {txnId && <div><span>Txn ID</span><span>{txnId}</span></div>}
          </div>

          <div className="success-steps">
            <div className="instr-step"><div className="step-num done">✓</div><div>Payment screenshot sent to admin via WhatsApp</div></div>
            <div className="instr-step"><div className="step-num active">2</div><div>Admin verifies and approves your package <span className="eta">(~30 min)</span></div></div>
            <div className="instr-step"><div className="step-num">3</div><div>Login directly using your email and mobile (ensure they are unique and correct)</div></div>
          </div>

          <button className="btn btn-primary full-width" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
