import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const success = login(email, password);
    setLoading(false);
    if (success) {
      navigate("/app");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Ambient orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,60,180,0.35) 0%, transparent 70%);
          top: -200px; left: -200px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(30,140,200,0.2) 0%, transparent 70%);
          bottom: -150px; right: -150px;
          animation-delay: -6s;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(200,80,150,0.15) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -3s;
        }

        @keyframes drift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 40px) scale(1.1); }
        }

        /* Grid texture overlay */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Left panel */
        .left-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px;
          position: relative;
          z-index: 1;
        }

        .brand-mark {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.6s ease forwards;
          animation-delay: 0.1s;
        }

        .brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #7c4dff, #00bcd4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-icon svg { width: 20px; height: 20px; fill: white; }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .left-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 5vw, 72px);
          font-weight: 300;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.6s ease forwards;
          animation-delay: 0.2s;
        }

        .left-headline em {
          font-style: italic;
          background: linear-gradient(90deg, #a78bfa, #67e8f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .left-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          max-width: 360px;
          font-weight: 300;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.6s ease forwards;
          animation-delay: 0.3s;
        }

        .feature-list {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.6s ease forwards;
          animation-delay: 0.4s;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 400;
        }

        .feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa, #67e8f9);
          flex-shrink: 0;
        }

        /* Right panel - form */
        .right-panel {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 60px 60px 40px;
          position: relative;
          z-index: 1;
        }

        .form-card {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          opacity: 0;
          transform: translateX(30px);
          animation: fadeLeft 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.2s;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          to { opacity: 1; transform: translateX(0); }
        }

        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .form-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 36px;
          font-weight: 300;
        }

        .field-group {
          position: relative;
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
          transition: color 0.3s;
        }

        .field-group.focused .field-label {
          color: #a78bfa;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: all 0.3s;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: rgba(255,255,255,0.2); }

        .field-input:focus {
          border-color: rgba(167,139,250,0.5);
          background: rgba(167,139,250,0.06);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.1);
        }

        .field-input:-webkit-autofill,
        .field-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px #16102a inset;
          -webkit-text-fill-color: #fff;
        }

        .forgot-link {
          text-align: right;
          margin-top: -12px;
          margin-bottom: 28px;
        }

        .forgot-link a {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link a:hover { color: #a78bfa; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c4dff 0%, #00bcd4 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.03em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 4px 24px rgba(124,77,255,0.35);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 32px rgba(124,77,255,0.5); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: rgba(255,255,255,0.15);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .demo-badge {
          text-align: center;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 10px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Mono', monospace;
          font-weight: 300;
        }

        .demo-badge span { color: rgba(167,139,250,0.7); }

        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }

        .shake { animation: shakeX 0.5s ease; }

        @media (max-width: 900px) {
          .left-panel { display: none; }
          .right-panel { width: 100%; padding: 40px 24px; }
        }
      `}</style>

      <div className="login-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Left panel */}
        <div className="left-panel">
          <div className="brand-mark">
            <div className="brand-icon">
              <svg viewBox="0 0 20 20"><path d="M10 2L2 7l8 5 8-5-8-5zM2 12l8 5 8-5M2 17l8 5 8-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="brand-name">Aether</span>
          </div>

          <h1 className="left-headline">
            Where ideas<br />
            <em>become reality.</em>
          </h1>

          <p className="left-sub">
            A workspace built for the way you think. Clear, focused, and always in motion.
          </p>

          <div className="feature-list">
            {["Real-time collaboration across teams", "End-to-end encrypted data storage", "Advanced analytics & reporting"].map((f, i) => (
              <div className="feature-item" key={i}>
                <div className="feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="right-panel">
          <div className={`form-card ${shake ? "shake" : ""}`}>
            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit}>
              <div className={`field-group ${focused === "email" ? "focused" : ""}`}>
                <label className="field-label">Email address</label>
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>

              <div className={`field-group ${focused === "password" ? "focused" : ""}`}>
                <label className="field-label">Password</label>
                <input
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>

              <div className="forgot-link">
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                <div className="btn-inner">
                  {loading ? (
                    <><div className="spinner" /> Signing in…</>
                  ) : (
                    "Sign in to Aether"
                  )}
                </div>
              </button>
            </form>

            <div className="divider">demo credentials</div>
            <div className="demo-badge">
              <span>admin@gmail.com</span> &nbsp;/&nbsp; <span>123456</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;