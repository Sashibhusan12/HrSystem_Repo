import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, sendOtp, verifyOtp, sendResetLink } = useAuth();

  // "login" | "forgot" | "forgot-sent"
  const [view, setView] = useState("login");
  const [mode, setMode] = useState("password"); // "password" | "otp"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const otpRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const goToView = (v) => {
    setView(v);
    setErrorMsg("");
    setShake(false);
    if (v === "forgot" && email) setResetEmail(email);
  };

  // ── PASSWORD LOGIN ────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/app");
    } else {
      setErrorMsg(result.message);
      triggerShake();
    }
  };

  // ── SEND OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg("");
    setOtpLoading(true);
    const result = await sendOtp(email);
    setOtpLoading(false);
    if (result.success) {
      setOtpSent(true);
      setCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } else {
      setErrorMsg(result.message);
      triggerShake();
    }
  };

  // ── VERIFY OTP & LOGIN ────────────────────────────────────────────────────
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;
    setErrorMsg("");
    setLoading(true);
    const result = await verifyOtp(email, code);
    setLoading(false);
    if (result.success) {
      navigate("/app");
    } else {
      setErrorMsg(result.message);
      triggerShake();
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    }
  };

  // ── RESEND OTP ────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    setErrorMsg("");
    setOtp(["", "", "", "", "", ""]);
    setCountdown(30);
    const result = await sendOtp(email);
    if (!result.success) {
      setErrorMsg(result.message);
      triggerShake();
    } else {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  };

  // ── SEND RESET LINK ───────────────────────────────────────────────────────
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setErrorMsg("");
    setResetLoading(true);
    const result = await sendResetLink(resetEmail);
    setResetLoading(false);
    if (result.success) {
      setView("forgot-sent");
    } else {
      setErrorMsg(result.message);
      triggerShake();
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setShake(false);
    setErrorMsg("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500&family=IBM+Plex+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hr-root {
          min-height: 100vh; display: flex;
          background: #f5f3ef; font-family: 'IBM Plex Sans', sans-serif;
          position: relative; overflow: hidden;
        }

        .hr-left {
          width: 420px; flex-shrink: 0; background: #1a1a2e;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 56px 48px; position: relative; overflow: hidden;
        }
        .hr-left::before {
          content: ''; position: absolute; top: -120px; right: -120px;
          width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%);
        }
        .hr-left::after {
          content: ''; position: absolute; bottom: -80px; left: -80px;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
        }
        .hr-logo {
          display: flex; align-items: center; gap: 12px;
          position: relative; z-index: 1;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.1s;
        }
        .hr-logo-box {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #d4af37, #f0d060);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .hr-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 600; color: #fff; letter-spacing: 0.04em;
        }
        .hr-logo-text sub {
          font-family: 'IBM Plex Sans', sans-serif; font-size: 10px; font-weight: 400;
          color: rgba(255,255,255,0.4); margin-left: 4px; vertical-align: middle;
          text-transform: uppercase; letter-spacing: 0.15em;
        }
        .hr-hero {
          position: relative; z-index: 1;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.25s;
        }
        .hr-hero-tag {
          display: inline-block; background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.3); color: #d4af37;
          font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; padding: 5px 12px; border-radius: 20px; margin-bottom: 20px;
        }
        .hr-hero h1 {
          font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 500;
          color: #fff; line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 16px;
        }
        .hr-hero p { font-size: 13px; color: rgba(255,255,255,0.38); line-height: 1.7; font-weight: 300; }

        .hr-right {
          flex: 1; display: flex; align-items: center;
          justify-content: center; padding: 60px 40px; position: relative;
        }
        .hr-right::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }

        .form-wrap {
          width: 100%; max-width: 400px; position: relative; z-index: 1;
          opacity: 0; animation: slideIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards 0.3s;
        }
        .view-panel { animation: fadeUp 0.38s cubic-bezier(0.22,1,0.36,1); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .form-top-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #9ca3af; margin-bottom: 8px;
        }
        .form-heading {
          font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 500;
          color: #111827; letter-spacing: -0.02em; margin-bottom: 6px; line-height: 1.15;
        }
        .form-sub { font-size: 13px; color: #9ca3af; margin-bottom: 32px; font-weight: 300; line-height: 1.65; }

        /* Back button */
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer; padding: 0;
          font-size: 11px; font-weight: 500; color: #9ca3af;
          font-family: 'IBM Plex Sans', sans-serif;
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 28px; transition: color 0.2s;
        }
        .back-btn:hover { color: #1a1a2e; }
        .back-btn svg { transition: transform 0.2s; }
        .back-btn:hover svg { transform: translateX(-3px); }

        .mode-toggle {
          display: flex; background: #ede9e3; border-radius: 12px;
          padding: 4px; margin-bottom: 28px;
        }
        .mode-btn {
          flex: 1; padding: 9px 0; font-size: 12px; font-weight: 500;
          font-family: 'IBM Plex Sans', sans-serif; letter-spacing: 0.03em;
          border: none; background: transparent; border-radius: 9px;
          cursor: pointer; color: #9ca3af; transition: all 0.25s;
        }
        .mode-btn.active { background: #fff; color: #1a1a2e; box-shadow: 0 1px 6px rgba(0,0,0,0.1); }

        .error-banner {
          display: flex; align-items: center; gap: 8px;
          background: #fff5f5; border: 1px solid #fecaca;
          border-radius: 10px; padding: 10px 14px; margin-bottom: 16px;
          font-size: 12.5px; color: #b91c1c; animation: fadeUp 0.3s ease;
        }

        .field-block { margin-bottom: 18px; }
        .field-label {
          display: block; font-size: 11px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: #6b7280; margin-bottom: 7px; transition: color 0.25s;
        }
        .field-block.is-focused .field-label { color: #1a1a2e; }
        .field-input-wrap { position: relative; }
        .field-input {
          width: 100%; background: #fff; border: 1.5px solid #e5e0d8;
          border-radius: 10px; padding: 13px 16px; font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif; color: #111827;
          outline: none; transition: all 0.25s;
        }
        .field-input::placeholder { color: #c4bfb8; }
        .field-input:focus { border-color: #1a1a2e; box-shadow: 0 0 0 3px rgba(26,26,46,0.07); }
        .field-input.pr { padding-right: 44px; }
        .field-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; display: flex; transition: color 0.2s; padding: 0;
        }
        .eye-btn:hover { color: #1a1a2e; }
        .field-row { display: flex; gap: 10px; align-items: flex-end; }

        .send-otp-btn {
          flex-shrink: 0; height: 48px; padding: 0 18px;
          border: 1.5px solid #1a1a2e; border-radius: 10px; background: transparent;
          color: #1a1a2e; font-size: 12px; font-weight: 500;
          font-family: 'IBM Plex Sans', sans-serif; letter-spacing: 0.04em;
          cursor: pointer; white-space: nowrap; transition: all 0.25s;
        }
        .send-otp-btn:hover:not(:disabled) { background: #1a1a2e; color: #fff; }
        .send-otp-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .otp-section { animation: fadeUp 0.4s ease forwards; }
        .otp-hint { font-size: 12px; color: #6b7280; margin-bottom: 14px; font-weight: 300; line-height: 1.6; }
        .otp-hint strong { color: #1a1a2e; font-weight: 500; }
        .otp-validity { color: #d4af37; font-size: 11px; }

        .otp-boxes { display: flex; gap: 8px; }
        .otp-box {
          width: 48px; height: 54px; text-align: center;
          font-size: 22px; font-family: 'IBM Plex Mono', monospace;
          color: #111827; background: #fff; border: 1.5px solid #e5e0d8;
          border-radius: 10px; outline: none; transition: all 0.2s; caret-color: #1a1a2e;
        }
        .otp-box:focus { border-color: #1a1a2e; box-shadow: 0 0 0 3px rgba(26,26,46,0.07); }
        .otp-box.filled { border-color: #d4af37; background: #fffbf0; }

        .otp-resend { margin-top: 10px; font-size: 12px; color: #9ca3af; }
        .otp-resend button {
          background: none; border: none; color: #1a1a2e; font-weight: 500;
          cursor: pointer; font-size: 12px; font-family: 'IBM Plex Sans', sans-serif;
          text-decoration: underline; padding: 0;
        }

        .forgot-row { text-align: right; margin-top: -8px; margin-bottom: 22px; }
        .forgot-link {
          font-size: 12px; color: #9ca3af; background: none; border: none;
          cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;
          transition: color 0.2s; padding: 0;
        }
        .forgot-link:hover { color: #1a1a2e; }

        .submit-btn {
          width: 100%; padding: 14px; border: none; border-radius: 10px;
          background: #1a1a2e; color: #fff; font-size: 14px; font-weight: 500;
          font-family: 'IBM Plex Sans', sans-serif; letter-spacing: 0.03em;
          cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
        }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transform: translateX(-100%); transition: transform 0.5s;
        }
        .submit-btn:hover::after { transform: translateX(100%); }
        .submit-btn:hover:not(:disabled) {
          background: #111; box-shadow: 0 4px 20px rgba(26,26,46,0.28); transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Magic hint box */
        .magic-hint {
          display: flex; align-items: flex-start; gap: 10px;
          background: #fffbf0; border: 1px solid rgba(212,175,55,0.35);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 22px;
        }
        .magic-hint-icon { flex-shrink: 0; margin-top: 1px; }
        .magic-hint p { font-size: 12px; color: #6b7280; line-height: 1.65; font-weight: 300; }
        .magic-hint p strong { color: #1a1a2e; font-weight: 500; }

        /* Sent confirmation */
        .sent-card {
          background: #fff; border: 1.5px solid #e5e0d8; border-radius: 16px;
          padding: 32px 28px; text-align: center; margin-bottom: 24px;
        }
        .sent-icon-wrap {
          width: 68px; height: 68px; border-radius: 50%;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 1.5px solid #bbf7d0;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }
        .sent-card h3 {
          font-family: 'Playfair Display', serif; font-size: 22px;
          font-weight: 500; color: #111827; margin-bottom: 10px;
        }
        .sent-card p { font-size: 13px; color: #6b7280; line-height: 1.75; font-weight: 300; }
        .sent-card p strong { color: #1a1a2e; font-weight: 500; }

        .sent-note {
          font-size: 12px; color: #9ca3af; text-align: center;
          line-height: 1.7; margin-bottom: 24px;
        }
        .sent-note button {
          background: none; border: none; color: #1a1a2e; font-weight: 500;
          cursor: pointer; font-size: 12px; font-family: 'IBM Plex Sans', sans-serif;
          text-decoration: underline; padding: 0;
        }

        .divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
        }
        .divider-line { flex: 1; height: 1px; background: #e5e0d8; }
        .divider-text { font-size: 11px; color: #c4bfb8; white-space: nowrap; }

        .back-to-login-btn {
          width: 100%; padding: 13px; border: 1.5px solid #e5e0d8;
          border-radius: 10px; background: transparent; color: #6b7280;
          font-size: 13px; font-weight: 500; font-family: 'IBM Plex Sans', sans-serif;
          letter-spacing: 0.02em; cursor: pointer; transition: all 0.25s;
        }
        .back-to-login-btn:hover { border-color: #1a1a2e; color: #1a1a2e; box-shadow: 0 2px 10px rgba(26,26,46,0.08); }

        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-7px); }
          40%, 80% { transform: translateX(7px); }
        }
        .shake { animation: shakeX 0.5s ease; }

        @media (max-width: 860px) {
          .hr-left { display: none; }
          .hr-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="hr-root">

        {/* ── Left branding panel ── */}
        <div className="hr-left">
          <div className="hr-logo">
            <div className="hr-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="#1a1a2e" strokeWidth="2" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="hr-logo-text">PeopleCore <sub>HR Suite</sub></span>
          </div>
          <div className="hr-hero">
            <div className="hr-hero-tag">Enterprise HR Platform</div>
            <h1>Manage your<br />people, smarter.</h1>
            <p>Streamline hiring, onboarding, payroll, and performance — all from one unified dashboard built for modern HR teams.</p>
          </div>
          <div />
        </div>

        {/* ── Right form panel ── */}
        <div className="hr-right">
          <div className={`form-wrap ${shake ? "shake" : ""}`}>

            {/* ════════ VIEW: LOGIN ════════ */}
            {view === "login" && (
              <div className="view-panel">
                <div className="form-top-label">HR Portal</div>
                <h2 className="form-heading">Welcome back</h2>
                <p className="form-sub">Sign in to access your dashboard</p>

                <div className="mode-toggle">
                  <button className={`mode-btn ${mode === "password" ? "active" : ""}`} onClick={() => switchMode("password")} type="button">
                    🔐 Password
                  </button>
                  <button className={`mode-btn ${mode === "otp" ? "active" : ""}`} onClick={() => switchMode("otp")} type="button">
                    📱 OTP Login
                  </button>
                </div>

                {errorMsg && (
                  <div className="error-banner">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errorMsg}
                  </div>
                )}

                {/* ── Password ── */}
                {mode === "password" && (
                  <form onSubmit={handlePasswordLogin}>
                    <div className={`field-block ${focused === "email" ? "is-focused" : ""}`}>
                      <label className="field-label">Work Email</label>
                      <input type="email" className="field-input" placeholder="yourname@company.com"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} required />
                    </div>
                    <div className={`field-block ${focused === "password" ? "is-focused" : ""}`}>
                      <label className="field-label">Password</label>
                      <div className="field-input-wrap">
                        <input type={showPass ? "text" : "password"} className="field-input pr"
                          placeholder="••••••••••" value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} required />
                        <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                          {showPass
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>
                    <div className="forgot-row">
                      <button type="button" className="forgot-link" onClick={() => goToView("forgot")}>
                        Forgot password?
                      </button>
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                      <div className="btn-inner">
                        {loading ? <><div className="spinner" /> Signing in…</> : "Sign In to HR Portal"}
                      </div>
                    </button>
                  </form>
                )}

                {/* ── OTP ── */}
                {mode === "otp" && (
                  <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp}>
                    <div className={`field-block ${focused === "otp-email" ? "is-focused" : ""}`}>
                      <label className="field-label">Work Email</label>
                      <div className="field-row">
                        <input type="email" className="field-input" placeholder="yourname@company.com"
                          value={email} onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocused("otp-email")} onBlur={() => setFocused(null)}
                          required disabled={otpSent} />
                        {!otpSent
                          ? <button type="submit" className="send-otp-btn" disabled={otpLoading || !email}>{otpLoading ? "Sending…" : "Send OTP"}</button>
                          : <button type="button" className="send-otp-btn" onClick={() => { setOtpSent(false); setOtp(["","","","","",""]); setErrorMsg(""); }}>Change</button>
                        }
                      </div>
                    </div>
                    {otpSent && (
                      <div className="otp-section">
                        <p className="otp-hint">
                          Enter the 6-digit code sent to <strong>{email}</strong>.{" "}
                          <span className="otp-validity">⏱ Valid for 5 minutes.</span>
                        </p>
                        <div className="otp-boxes" onPaste={handleOtpPaste}>
                          {otp.map((d, i) => (
                            <input key={i} ref={el => (otpRefs.current[i] = el)}
                              type="text" inputMode="numeric" maxLength={1}
                              className={`otp-box ${d ? "filled" : ""}`} value={d}
                              onChange={(e) => handleOtpChange(e.target.value, i)}
                              onKeyDown={(e) => handleOtpKeyDown(e, i)} />
                          ))}
                        </div>
                        <div className="otp-resend">
                          {countdown > 0
                            ? <>Resend code in <strong>{countdown}s</strong></>
                            : <>Didn't receive it? <button type="button" onClick={handleResendOtp}>Resend OTP</button></>
                          }
                        </div>
                        <button type="submit" className="submit-btn" style={{ marginTop: 20 }}
                          disabled={loading || otp.join("").length < 6}>
                          <div className="btn-inner">
                            {loading ? <><div className="spinner" /> Verifying…</> : "Verify & Sign In"}
                          </div>
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* ════════ VIEW: FORGOT PASSWORD ════════ */}
            {view === "forgot" && (
              <div className="view-panel">
                <button className="back-btn" onClick={() => goToView("login")} type="button">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back to login
                </button>

                <div className="form-top-label">Account Recovery</div>
                <h2 className="form-heading">Reset your<br />password</h2>
                <p className="form-sub">Enter your work email and we'll send you a secure magic link to reset it instantly.</p>

                <div className="magic-hint">
                  <span className="magic-hint-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b08d30" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <p>We'll email you a <strong>one-time reset link</strong>. It expires in <strong>15 minutes</strong> and works only once.</p>
                </div>

                {errorMsg && (
                  <div className="error-banner">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSendResetLink}>
                  <div className={`field-block ${focused === "reset-email" ? "is-focused" : ""}`}>
                    <label className="field-label">Work Email</label>
                    <input type="email" className="field-input" placeholder="yourname@company.com"
                      value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                      onFocus={() => setFocused("reset-email")} onBlur={() => setFocused(null)}
                      required autoFocus />
                  </div>
                  <button type="submit" className="submit-btn" disabled={resetLoading || !resetEmail}>
                    <div className="btn-inner">
                      {resetLoading
                        ? <><div className="spinner" /> Sending link…</>
                        : <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            Send Reset Link
                          </>
                      }
                    </div>
                  </button>
                </form>
              </div>
            )}

            {/* ════════ VIEW: LINK SENT ════════ */}
            {view === "forgot-sent" && (
              <div className="view-panel">
                <div className="sent-card">
                  <div className="sent-icon-wrap">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <h3>Check your inbox</h3>
                  <p>
                    We sent a password reset link to<br />
                    <strong>{resetEmail}</strong>
                    <br /><br />
                    Click the link in the email to set a new password. It expires in <strong>15 minutes</strong>.
                  </p>
                </div>

                <p className="sent-note">
                  Didn't get the email? Check your spam, or{" "}
                  <button type="button" onClick={() => { setView("forgot"); setErrorMsg(""); }}>
                    try a different address
                  </button>.
                </p>

                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">or</span>
                  <div className="divider-line" />
                </div>

                <button type="button" className="back-to-login-btn" onClick={() => goToView("login")}>
                  ← Back to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;