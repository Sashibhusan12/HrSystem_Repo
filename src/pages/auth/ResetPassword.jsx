import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://localhost:7271/api/LoginResistarion";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [focused, setFocused]                 = useState(null);
  const [loading, setLoading]                 = useState(false);
  const [success, setSuccess]                 = useState(false);
  const [error, setError]                     = useState("");
  const [shake, setShake]                     = useState(false);

  // ── Password strength ────────────────────────────────────────────────────
  const getStrength = (pwd) => {
    if (!pwd) return null;
    const hasUpper   = /[A-Z]/.test(pwd);
    const hasLower   = /[a-z]/.test(pwd);
    const hasNumber  = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    if (pwd.length < 6)              return { label: "Too short", level: 0, color: "#ef4444" };
    if (score <= 2)                  return { label: "Weak",      level: 1, color: "#f97316" };
    if (score === 3)                 return { label: "Good",      level: 2, color: "#eab308" };
    if (score === 4 && pwd.length >= 10) return { label: "Strong", level: 3, color: "#22c55e" };
    return { label: "Medium",        level: 2, color: "#eab308" };
  };

  const strength = getStrength(newPassword);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token || !email) {
      setError("Invalid or missing reset link. Please request a new one.");
      triggerShake();
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      triggerShake();
      return;
    }
    if (strength?.level < 1) {
      setError("Please choose a stronger password.");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/reset-password`, { email, token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword && newPassword !== confirmPassword;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500&family=IBM+Plex+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rp-root {
          min-height: 100vh;
          display: flex;
          background: #f5f3ef;
          font-family: 'IBM Plex Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* ── Left panel ──────────────────────────────────── */
        .rp-left {
          width: 420px;
          flex-shrink: 0;
          background: #1a1a2e;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 48px;
          position: relative;
          overflow: hidden;
        }
        .rp-left::before {
          content: '';
          position: absolute; top: -120px; right: -120px;
          width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%);
        }
        .rp-left::after {
          content: '';
          position: absolute; bottom: -80px; left: -80px;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
        }

        .rp-logo {
          display: flex; align-items: center; gap: 12px;
          position: relative; z-index: 1;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.1s;
        }
        .rp-logo-box {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #d4af37, #f0d060);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .rp-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 600; color: #fff; letter-spacing: 0.04em;
        }
        .rp-logo-text sub {
          font-family: 'IBM Plex Sans', sans-serif; font-size: 10px; font-weight: 400;
          color: rgba(255,255,255,0.4); margin-left: 4px; vertical-align: middle;
          text-transform: uppercase; letter-spacing: 0.15em;
        }

        .rp-hero {
          position: relative; z-index: 1;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.25s;
        }
        .rp-hero-tag {
          display: inline-block;
          background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37; font-size: 10px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 20px; margin-bottom: 20px;
        }
        .rp-hero h1 {
          font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 500;
          color: #fff; line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 16px;
        }
        .rp-hero p { font-size: 13px; color: rgba(255,255,255,0.38); line-height: 1.75; font-weight: 300; }

        /* Security steps */
        .rp-steps {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 14px;
          opacity: 0; animation: fadeUp 0.5s ease forwards 0.4s;
        }
        .rp-step {
          display: flex; align-items: flex-start; gap: 12px;
        }
        .rp-step-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.25);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .rp-step-text { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.65; font-weight: 300; padding-top: 6px; }
        .rp-step-text strong { color: rgba(255,255,255,0.75); font-weight: 500; }

        /* ── Right panel ─────────────────────────────────── */
        .rp-right {
          flex: 1; display: flex; align-items: center;
          justify-content: center; padding: 60px 40px; position: relative;
        }
        .rp-right::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px; pointer-events: none;
        }

        /* ── Form wrap ───────────────────────────────────── */
        .rp-form-wrap {
          width: 100%; max-width: 400px;
          position: relative; z-index: 1;
          opacity: 0;
          animation: slideIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards 0.3s;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-7px); }
          40%,80% { transform: translateX(7px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successPop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1);   opacity: 1; }
        }

        .shake { animation: shakeX 0.5s ease; }

        .form-top-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #9ca3af; margin-bottom: 8px;
        }
        .form-heading {
          font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 500;
          color: #111827; letter-spacing: -0.02em; margin-bottom: 6px; line-height: 1.15;
        }
        .form-sub {
          font-size: 13px; color: #9ca3af; margin-bottom: 32px;
          font-weight: 300; line-height: 1.65;
        }

        /* ── Error banner ── */
        .error-banner {
          display: flex; align-items: center; gap: 8px;
          background: #fff5f5; border: 1px solid #fecaca;
          border-radius: 10px; padding: 10px 14px; margin-bottom: 20px;
          font-size: 12.5px; color: #b91c1c;
          animation: fadeUp 0.3s ease;
        }

        /* ── Fields ── */
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
          border-radius: 10px; padding: 13px 44px 13px 16px; font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif; color: #111827;
          outline: none; transition: all 0.25s;
        }
        .field-input::placeholder { color: #c4bfb8; }
        .field-input:focus { border-color: #1a1a2e; box-shadow: 0 0 0 3px rgba(26,26,46,0.07); }
        .field-input.match   { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.08); }
        .field-input.mismatch { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }

        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; display: flex; transition: color 0.2s; padding: 0;
        }
        .eye-btn:hover { color: #1a1a2e; }

        /* ── Strength bar ── */
        .strength-wrap { margin-top: 8px; }
        .strength-bar-track {
          height: 4px; background: #e5e0d8; border-radius: 4px;
          overflow: hidden; margin-bottom: 5px;
        }
        .strength-bar-fill {
          height: 100%; border-radius: 4px;
          transition: width 0.4s ease, background 0.4s ease;
        }
        .strength-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Requirements ── */
        .requirements {
          background: #fafaf8; border: 1px solid #e5e0d8;
          border-radius: 10px; padding: 12px 14px; margin-bottom: 22px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px;
        }
        .req-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; color: #9ca3af; transition: color 0.25s;
        }
        .req-item.met { color: #22c55e; }
        .req-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #d1d5db; flex-shrink: 0; transition: background 0.25s;
        }
        .req-item.met .req-dot { background: #22c55e; }

        /* ── Match indicator ── */
        .match-indicator {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; margin-top: 6px; font-weight: 400;
        }
        .match-indicator.ok   { color: #22c55e; }
        .match-indicator.fail { color: #ef4444; }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%; padding: 14px; border: none; border-radius: 10px;
          background: #1a1a2e; color: #fff; font-size: 14px; font-weight: 500;
          font-family: 'IBM Plex Sans', sans-serif; letter-spacing: 0.03em;
          cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
          margin-top: 4px;
        }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transform: translateX(-100%); transition: transform 0.5s;
        }
        .submit-btn:hover::after { transform: translateX(100%); }
        .submit-btn:hover:not(:disabled) {
          background: #111; box-shadow: 0 4px 20px rgba(26,26,46,0.28);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.65s linear infinite;
        }

        /* ── Success state ── */
        .success-view { text-align: center; }
        .success-icon-wrap {
          width: 80px; height: 80px; margin: 0 auto 24px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 2px solid #bbf7d0; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          animation: successPop 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .success-view h3 {
          font-family: 'Playfair Display', serif; font-size: 26px;
          font-weight: 500; color: #111827; margin-bottom: 10px;
        }
        .success-view p { font-size: 13px; color: #6b7280; line-height: 1.75; font-weight: 300; }
        .success-view p strong { color: #1a1a2e; font-weight: 500; }

        .redirect-bar-track {
          height: 3px; background: #e5e0d8; border-radius: 4px;
          margin-top: 28px; overflow: hidden;
        }
        .redirect-bar-fill {
          height: 100%; width: 100%;
          background: linear-gradient(90deg, #d4af37, #f0d060);
          border-radius: 4px;
          animation: drain 3s linear forwards;
        }
        @keyframes drain {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .redirect-note {
          font-size: 11px; color: #c4bfb8; margin-top: 8px;
          text-align: center; letter-spacing: 0.04em;
        }

        /* ── Invalid link state ── */
        .invalid-view { text-align: center; }
        .invalid-icon-wrap {
          width: 70px; height: 70px; margin: 0 auto 22px;
          background: #fff5f5; border: 1.5px solid #fecaca; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .invalid-view h3 {
          font-family: 'Playfair Display', serif; font-size: 24px;
          color: #111827; font-weight: 500; margin-bottom: 10px;
        }
        .invalid-view p { font-size: 13px; color: #6b7280; line-height: 1.7; margin-bottom: 24px; }
        .outline-btn {
          width: 100%; padding: 13px; border: 1.5px solid #1a1a2e; border-radius: 10px;
          background: transparent; color: #1a1a2e; font-size: 13px; font-weight: 500;
          font-family: 'IBM Plex Sans', sans-serif; cursor: pointer; transition: all 0.25s;
        }
        .outline-btn:hover {
          background: #1a1a2e; color: #fff;
          box-shadow: 0 4px 20px rgba(26,26,46,0.2);
        }

        @media (max-width: 860px) {
          .rp-left { display: none; }
          .rp-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="rp-root">

        {/* ── Left branding panel ── */}
        <div className="rp-left">
          <div className="rp-logo">
            <div className="rp-logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="#1a1a2e" strokeWidth="2" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="rp-logo-text">PeopleCore <sub>HR Suite</sub></span>
          </div>

          <div className="rp-hero">
            <div className="rp-hero-tag">Account Security</div>
            <h1>Create a strong<br />new password.</h1>
            <p>Your new password protects your team's data. Make it unique and hard to guess.</p>
          </div>

          <div className="rp-steps">
            {[
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                ),
                title: "Use 10+ characters",
                desc: "Mix uppercase, numbers & symbols for maximum security.",
              },
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Don't reuse passwords",
                desc: "Never reuse passwords across different services.",
              },
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
                title: "Link expires in 15 min",
                desc: "This reset link is single-use and time-limited.",
              },
            ].map((s) => (
              <div className="rp-step" key={s.title}>
                <div className="rp-step-icon">{s.icon}</div>
                <div className="rp-step-text"><strong>{s.title}</strong><br />{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="rp-right">

          {/* ── INVALID LINK ── */}
          {(!token || !email) && (
            <div className="rp-form-wrap">
              <div className="invalid-view">
                <div className="invalid-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h3>Invalid reset link</h3>
                <p>This link is missing required parameters. Please request a new password reset from the login page.</p>
                <button className="outline-btn" onClick={() => navigate("/login")}>
                  ← Back to Login
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {success && (
            <div className="rp-form-wrap">
              <div className="success-view">
                <div className="success-icon-wrap">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>Password updated!</h3>
                <p>
                  Your password has been reset successfully.<br />
                  Redirecting you to <strong>sign in</strong>…
                </p>
                <div className="redirect-bar-track">
                  <div className="redirect-bar-fill" />
                </div>
                <p className="redirect-note">Redirecting in 3 seconds</p>
              </div>
            </div>
          )}

          {/* ── FORM ── */}
          {token && email && !success && (
            <div className={`rp-form-wrap ${shake ? "shake" : ""}`}>
              <div className="form-top-label">Account Recovery</div>
              <h2 className="form-heading">Set new<br />password</h2>
              <p className="form-sub">
                Resetting password for <strong style={{ color: "#1a1a2e", fontWeight: 500 }}>{email}</strong>
              </p>

              {error && (
                <div className="error-banner">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* New password */}
                <div className={`field-block ${focused === "new" ? "is-focused" : ""}`}>
                  <label className="field-label">New Password</label>
                  <div className="field-input-wrap">
                    <input
                      type={showNew ? "text" : "password"}
                      className="field-input"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setFocused("new")}
                      onBlur={() => setFocused(null)}
                      required
                      autoFocus
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowNew(v => !v)} tabIndex={-1}>
                      {showNew
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>

                  {/* Strength bar */}
                  {newPassword && strength && (
                    <div className="strength-wrap">
                      <div className="strength-bar-track">
                        <div className="strength-bar-fill" style={{
                          width: `${[0, 33, 66, 100][strength.level]}%`,
                          background: strength.color
                        }} />
                      </div>
                      <span className="strength-label" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Requirements checklist */}
                {newPassword && (() => {
                  const reqs = [
                    { label: "8+ characters",   met: newPassword.length >= 8 },
                    { label: "Uppercase letter", met: /[A-Z]/.test(newPassword) },
                    { label: "Lowercase letter", met: /[a-z]/.test(newPassword) },
                    { label: "Number",           met: /[0-9]/.test(newPassword) },
                    { label: "Special character",met: /[^A-Za-z0-9]/.test(newPassword) },
                    { label: "Not too short",    met: newPassword.length >= 6 },
                  ];
                  return (
                    <div className="requirements">
                      {reqs.map((r) => (
                        <div key={r.label} className={`req-item ${r.met ? "met" : ""}`}>
                          <div className="req-dot" />
                          {r.label}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Confirm password */}
                <div className={`field-block ${focused === "confirm" ? "is-focused" : ""}`}>
                  <label className="field-label">Confirm Password</label>
                  <div className="field-input-wrap">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={`field-input ${passwordsMatch ? "match" : ""} ${passwordsMismatch ? "mismatch" : ""}`}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocused("confirm")}
                      onBlur={() => setFocused(null)}
                      required
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                      {showConfirm
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className={`match-indicator ${passwordsMatch ? "ok" : "fail"}`}>
                      {passwordsMatch
                        ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Passwords match</>
                        : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Passwords do not match</>
                      }
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !passwordsMatch || strength?.level < 1}
                >
                  <div className="btn-inner">
                    {loading
                      ? <><div className="spinner" /> Updating password…</>
                      : <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                          </svg>
                          Set New Password
                        </>
                    }
                  </div>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
}