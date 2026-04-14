import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, Zap, Shield, Sparkles, PlayCircle, Mic, Brain, Eye,
  ChevronDown, Star, Quote, Terminal, Cpu, Clock, Lock
} from 'lucide-react';
import './Home.css';

const PLANS = [
  {
    name: '1 Round Pack', price: 999, rounds: 1, perRound: 999,
    validityDays: 5, planId: '1-round-pack',
    desc: 'Perfect for a single focused interview. No commitment, full power.',
    features: ['1 Full Interview Round', 'Valid for 5 days', 'Gemini & Sarvam AI', 'Live transcription'],
    featured: false,
  },
  {
    name: '5 Round Pack', price: 3995, rounds: 5, perRound: 799,
    validityDays: 10, planId: '5-round-pack',
    desc: 'Ideal for the standard hiring loop — screening, tech, and managerial.',
    features: ['5 Full Interview Rounds', 'Valid for 10 days', 'AI Analytics Dashboard', 'Priority transcription', 'Email summaries'],
    featured: true,
  },
  {
    name: '10 Round Pack', price: 4990, rounds: 10, perRound: 499,
    validityDays: 15, planId: '10-round-pack',
    desc: 'Cover multiple companies in one sprint. Best value per round.',
    features: ['10 Full Interview Rounds', 'Valid for 15 days', 'All AI Models', 'Export history & Analytics', 'Email summaries'],
    featured: false,
  },
  {
    name: '20 Round Pack', price: 9980, rounds: 20, perRound: 499,
    validityDays: 30, planId: '20-round-pack',
    desc: 'The ultimate weapon for an active job seeker going all-in.',
    features: ['20 Full Interview Rounds', 'Valid for 30 days', 'All AI Models', 'VIP support', 'Export & Analytics'],
    featured: false,
  },
];

const FEATURES = [
  { icon: <Mic size={28} />, title: 'Live Audio Capture', desc: 'Automatically listens to your interview call and captures every question without any manual input.' },
  { icon: <Brain size={28} />, title: 'AI-Powered Answers', desc: 'Powered by Gemini and Sarvam AI, the engine generates precise, context-aware answers in under 2 seconds.' },
  { icon: <Eye size={28} />, title: '100% Invisible Overlay', desc: 'The floating panel is completely transparent to screen-share and recording tools — only you can see it.' },
  { icon: <Clock size={28} />, title: 'Silence Detection', desc: 'Intelligently detects question-end silences and auto-triggers answer generation hands-free.' },
  { icon: <Terminal size={28} />, title: 'Multi-Model Support', desc: 'Switch between Gemini and Sarvam AI mid-interview with a keyboard shortcut to get the best answer.' },
  { icon: <Lock size={28} />, title: 'Fully Encrypted', desc: 'Your resume data and session context are stored locally and never sent to third-party servers.' },
];

const FAQS = [
  {
    q: 'Is MyInterviewGenie detectable by the interviewer or screen recording?',
    a: 'No. The overlay is built as a transparent Electron window that is excluded from screen-capture APIs. The interviewer only sees your video/audio feed — not the overlay.'
  },
  {
    q: 'What is a "round" and when does it get deducted?',
    a: 'A round is a full interview session. It is only deducted when your session exceeds 9 minutes. Short sessions (e.g., testing the app) consume zero rounds.'
  },
  {
    q: 'How do I pay? Is there a Razorpay / card option?',
    a: 'Currently we accept UPI payments (Google Pay, PhonePe, Paytm, etc.) via QR code. After payment, share your screenshot on WhatsApp with the admin. Your plan will be activated within minutes.'
  },
  {
    q: 'Can I try before buying?',
    a: 'Yes! Every user gets unlimited 9-minute trial sessions at no cost and without deducting any rounds. Just open the app and click "Start Trial" at any time.'
  },
  {
    q: 'What happens if my plan expires before I use all rounds?',
    a: 'Unused rounds are forfeited after the validity period. We recommend choosing a plan that matches your active interview timeline.'
  },
  {
    q: 'Which AI model should I use — Gemini or Sarvam?',
    a: 'Gemini is stronger for coding, system design, and detailed technical questions. Sarvam is faster and excellent for conceptual and HR questions. You can toggle mid-session with Ctrl+M.'
  },
  {
    q: 'Does it work for voice-based interviews (no typing)?',
    a: 'Yes. The microphone listener picks up audio directly from your sound card using silence detection — no typing or copying required.'
  },
  {
    q: 'How do I activate my plan after paying via UPI?',
    a: 'Share your payment screenshot to the admin WhatsApp number. The admin will verify and activate your plan on your registered email and mobile within 30 minutes. You can then login easily with OTP.'
  },
];

const TESTIMONIALS = [
  {
    name: 'Rahul M.', role: 'Senior SDE — Hired at Razorpay', stars: 5,
    text: 'I cracked back-to-back system design rounds using MyInterviewGenie. The Gemini answers were spot-on for distributed systems questions. Absolute game-changer.'
  },
  {
    name: 'Priya K.', role: 'Frontend Engineer — Hired at Swiggy', stars: 5,
    text: 'Asked about React internals and got a perfect answer in 1.5 seconds. The overlay is genuinely invisible to screen recording. Cleared 3 rounds in one day!'
  },
  {
    name: 'Aman S.', role: 'Full Stack Dev — Hired at Micro1', stars: 5,
    text: 'The silence detection is incredibly smart — it knew exactly when the interviewer finished asking. No fumbling with keyboard shortcuts. Just smooth, confident answers.'
  },
  {
    name: 'Sneha R.', role: 'DevOps Engineer — Hired at Zepto', stars: 5,
    text: 'Cleared 4 technical interviews in 2 weeks with the 5-round pack. The AI answers were better than what I\'d have memorised anyway!'
  },
  {
    name: 'Vikas T.', role: 'Backend Dev — Hired at PhonePe', stars: 5,
    text: 'Used the trial first, was blown away, bought the 10-round pack. Every rupee worth it. I wish I had this 2 years ago.'
  },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState(0);

  const demoQAs = [
    { q: 'What is the event loop in Node.js?', a: 'The event loop allows Node.js to perform non-blocking I/O by offloading operations to the OS kernel and processing callbacks in a queue after each iteration.' },
    { q: 'Explain the difference between SQL and NoSQL databases.', a: 'SQL databases use structured schemas and ACID transactions (e.g., PostgreSQL). NoSQL databases like MongoDB offer flexible schemas and horizontal scaling, ideal for unstructured or high-velocity data.' },
    { q: 'What is a closure in JavaScript?', a: 'A closure is a function that retains access to variables from its lexical scope even after the outer function has returned.' },
  ];

  return (
    <div className="home-container">
      {/* ── NAV ──────────────────────────────────── */}
      <nav className="home-nav">
        <div className="logo">
          <img src="/logo1.png" alt="MyInterviewGenie Logo" style={{ height: '140px', width: 'auto' }} />
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#demo">Demo</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Reviews</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <a href="#pricing" className="btn btn-primary">Get Started</a>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────── */}
      <header className="hero">
        <div className="hero-content">
          <div className="badge-promo"><Shield size={14} /> 100% Invisible to Screen Recording</div>
          <h1 className="display-title">
            Pass every interview <span className="gradient-text">stress-free.</span>
          </h1>
          <p className="subtitle">
            Real-time stealth AI listens to your live interview, transcribes every question, and shows precise answers on an invisible overlay — only you can see it.
          </p>
          <div className="trial-banner">
            <PlayCircle size={20} className="trial-icon" />
            <div>
              <strong>Unlimited 9-minute trial — always free.</strong>
              <p>No plan needed. No rounds deducted. Try it before you buy.</p>
            </div>
          </div>
          <div className="hero-cta">
            <a href="#pricing" className="btn btn-primary">See Pricing</a>
            <a href="#demo" className="btn btn-outline">Watch Demo ↓</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mockup-window">
            <div className="mockup-header"><span /><span /><span /></div>
            <div className="mockup-body">
              <div className="mock-badge">⚡ MyInterviewGenie — Active</div>
              <div className="mock-q">Q: Explain the event loop in Node.js?</div>
              <div className="mock-a">
                The event loop processes async callbacks after each I/O cycle, enabling non-blocking execution without threads. Phases: timers → I/O → idle → poll → check → close.
              </div>
              <div className="mock-footer">
                <span className="mock-pill green">● Listening</span>
                <span className="mock-pill blue">Gemini</span>
                <span className="mock-pill">3 rounds left</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── FEATURES ──────────────────────────────── */}
      <section id="features" className="features-section">
        <div className="section-label">Why MyInterviewGenie</div>
        <h2>Everything you need to <span className="gradient-text">ace any round.</span></h2>
        <p className="section-sub">Built by engineers who've been on both sides of the table — as interviewers and candidates.</p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO ──────────────────────────────────── */}
      <section id="demo" className="demo-section">
        <div className="section-label">Live Demo</div>
        <h2>See it <span className="gradient-text">in action.</span></h2>
        <p className="section-sub">Click a question below to simulate how MyInterviewGenie responds in real-time during an interview.</p>
        <div className="demo-wrapper">
          <div className="demo-sidebar">
            <div className="demo-sidebar-label"><Cpu size={14} /> Question Bank</div>
            {demoQAs.map((item, i) => (
              <button
                key={i}
                className={`demo-q-btn ${demoStep === i ? 'active' : ''}`}
                onClick={() => setDemoStep(i)}
              >
                {item.q.length > 45 ? item.q.slice(0, 45) + '…' : item.q}
              </button>
            ))}
          </div>
          <div className="demo-screen">
            <div className="demo-topbar">
              <span className="demo-dot red" /><span className="demo-dot yellow" /><span className="demo-dot green" />
              <span className="demo-title">MyInterviewGenie Overlay</span>
              <span className="demo-badge">● Live</span>
            </div>
            <div className="demo-content">
              <div className="demo-label-q">Detected Question</div>
              <div className="demo-question">{demoQAs[demoStep].q}</div>
              <div className="demo-divider" />
              <div className="demo-label-a">AI Answer <span className="demo-powered">powered by Gemini</span></div>
              <div className="demo-answer">{demoQAs[demoStep].a}</div>
            </div>
            <div className="demo-footer">
              <span className="mock-pill green">● Listening</span>
              <span className="mock-pill blue">Gemini</span>
              <span className="mock-pill">Ctrl+M: Switch Model</span>
            </div>
          </div>
        </div>
        <p className="demo-note">💡 This is an interactive simulation. The real app uses your live microphone to auto-detect questions.</p>
      </section>

      {/* ── PRICING ───────────────────────────────── */}
      <section id="pricing" className="pricing-section">
        <div className="section-label">Pricing</div>
        <h2>Simple, Transparent <span className="gradient-text">Pricing</span></h2>
        <p className="section-sub">Pay per round — as low as <strong>₹499 / round</strong>. No subscriptions, no hidden fees.</p>
        <div className="pricing-grid pricing-grid-4">
          {PLANS.map((plan) => (
            <div className={`pricing-card ${plan.featured ? 'featured' : ''}`} key={plan.planId}>
              {plan.featured && <div className="popular-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">₹{plan.price.toLocaleString('en-IN')}<span> / {plan.rounds} round{plan.rounds > 1 ? 's' : ''}</span></div>
              <div className="per-round-label">₹{plan.perRound} per round</div>
              <p className="desc">{plan.desc}</p>
              <ul className="features">
                {plan.features.map(f => (
                  <li key={f}><Check size={16} className="success-icon" /> {f}</li>
                ))}
              </ul>
              <Link
                to="/checkout"
                state={{ name: plan.name, price: plan.price, planId: plan.planId, rounds: plan.rounds }}
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'} full-width mt-auto`}
              >
                Buy {plan.rounds} Round{plan.rounds > 1 ? 's' : ''}
              </Link>
            </div>
          ))}
        </div>
        <div className="trial-callout">
          <PlayCircle size={22} className="trial-icon" />
          <span>Already have a license? <strong>Trial Mode is always available</strong> — open the desktop app and click "Start Trial" anytime, free.</span>
        </div>

        {/* UPI Payment Info */}
        <div className="upi-info-banner">
          <div className="upi-info-text">
            <Zap size={20} className="primary-icon" />
            <div>
              <strong>Pay via UPI — Quick Activation</strong>
              <p>Click "Buy" above, scan the QR code, pay via any UPI app, then share a screenshot with our admin. Your plan will be activated on your registered email and mobile within 30 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-label">Reviews</div>
        <h2>Loved by <span className="gradient-text">thousands of candidates.</span></h2>
        <p className="section-sub">Real results from real job seekers who closed the loop.</p>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-header">
                <div className="testimonial-avatar">{t.name[0]}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
                <Quote size={18} className="quote-icon" />
              </div>
              <div className="stars">
                {Array(t.stars).fill(0).map((_, si) => <Star key={si} size={14} className="star-icon" />)}
              </div>
              <p className="testimonial-text">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section id="faq" className="faq-section">
        <div className="section-label">FAQ</div>
        <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
        <p className="section-sub">Everything you need to know before your first interview.</p>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </div>
              {openFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer>
        <div className="footer-content">
          <div className="logo"><Sparkles size={20} className="primary-icon" /> MyInterviewGenie</div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link to="/login">Login</Link>
          </div>
          <p>© 2026 MyInterviewGenie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
