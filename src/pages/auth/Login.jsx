import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";
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
      if (result.role === "1") {          // "1" = SuperAdmin
        navigate("/app/superadmin/dashboard");
      } else {
        navigate("/app/employees");       // other roles
      }
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
      if (result.role === "1") {          // "1" = SuperAdmin
        navigate("/app/superadmin/dashboard");
      } else {
        navigate("/app/employees");
      }
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
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
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
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
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
                          : <button type="button" className="send-otp-btn" onClick={() => { setOtpSent(false); setOtp(["", "", "", "", "", ""]); setErrorMsg(""); }}>Change</button>
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
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <p>We'll email you a <strong>one-time reset link</strong>. It expires in <strong>15 minutes</strong> and works only once.</p>
                </div>

                {errorMsg && (
                  <div className="error-banner">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
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
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
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