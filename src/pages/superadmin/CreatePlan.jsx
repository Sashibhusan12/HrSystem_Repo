import React, { useState } from "react";
import {
  Sparkles, ChevronRight, Check,
  AlertCircle, Loader2, RefreshCw, X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // ← same import as all other pages
import "../../styles/createplan.css";

const FEATURES = [
  "Unlimited API access",
  "Priority support",
  "Advanced analytics",
  "Custom integrations",
];

const INITIAL_FORM = { planName: "", price: "", employees: "" };

function Toast({ type, message, onClose }) {
  if (!message) return null;
  return (
    <div className={`cp-toast cp-toast--${type}`}>
      {type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
      <span>{message}</span>
      <button className="cp-toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={12} />
      </button>
    </div>
  );
}

export default function CreatePlan() {
  const { createPlan } = useAuth(); // ← pulled from context, no separate service file needed

  const [form, setForm]         = useState(INITIAL_FORM);
  const [status, setStatus]     = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast]       = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const result = await createPlan(
      form.planName.trim(),
      form.price,
      form.employees
    );

    if (result.success) {
      setStatus("success");
      showToast("success", `"${form.planName.trim()}" plan created successfully!`);
      setTimeout(() => {
        setStatus("idle");
        setForm(INITIAL_FORM);
      }, 2000);
    } else {
      setErrorMsg(result.message);
      setStatus("error");
      showToast("error", result.message);
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setErrorMsg("");
    handleSubmit();
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError   = status === "error";

  return (
    <div className="cp-root">
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

      <div className="cp-header">
        <div className="cp-title-block">
          <div className="cp-eyebrow"><Sparkles size={12} /> Plan Management</div>
          <h1 className="cp-title">Create <span>Plan</span></h1>
          <p className="cp-subtitle">Configure a new subscription plan for your tenants</p>
        </div>
        <div className="cp-badge">
          <span className="cp-badge-dot" />
          System Active
        </div>
      </div>

      <div className="cp-main">
        <div className="cp-form-card">
          <h2 className="cp-form-title">Plan Configuration</h2>
          <p className="cp-form-desc">
            Define the plan details. Fields marked <span style={{ color: "var(--gold)" }}>*</span> are required.
          </p>

          {isError && (
            <div className="cp-error-banner">
              <AlertCircle size={15} />
              <span className="cp-error-text">{errorMsg}</span>
              <button className="cp-retry-btn" onClick={handleRetry}>
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="cp-fields">
              <div className="cp-field">
                <label className="cp-label" htmlFor="cp-planName">
                  Plan Name <span className="cp-label-req">*</span>
                </label>
                <input
                  id="cp-planName"
                  className={`cp-input${isError ? " cp-input--error" : ""}`}
                  type="text"
                  placeholder="e.g. Enterprise Gold"
                  value={form.planName}
                  onChange={handleChange("planName")}
                  disabled={isLoading}
                  required
                  autoComplete="off"
                />
                <span className="cp-input-hint">Choose a clear, descriptive name for your plan</span>
              </div>

              <div className="cp-row">
                <div className="cp-field">
                  <label className="cp-label" htmlFor="cp-price">
                    Price <span className="cp-label-req">*</span>
                  </label>
                  <div className="cp-input-wrap">
                    <span className="cp-input-prefix">$</span>
                    <input
                      id="cp-price"
                      className={`cp-input has-prefix${isError ? " cp-input--error" : ""}`}
                      type="number"
                      placeholder="0.00"
                      value={form.price}
                      min="0"
                      step="0.01"
                      onChange={handleChange("price")}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <span className="cp-input-hint">Monthly billing amount</span>
                </div>

                <div className="cp-field">
                  <label className="cp-label" htmlFor="cp-employees">Employee Limit</label>
                  <input
                    id="cp-employees"
                    className="cp-input"
                    type="number"
                    placeholder="e.g. 50"
                    value={form.employees}
                    min="1"
                    onChange={handleChange("employees")}
                    disabled={isLoading}
                  />
                  <span className="cp-input-hint">Leave blank for unlimited</span>
                </div>
              </div>
            </div>

            <div className="cp-divider" />

            <div className="cp-submit-wrap">
              <button
                type="submit"
                className={`cp-btn${isSuccess ? " success" : ""}${isLoading ? " loading" : ""}`}
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                  <><Loader2 size={15} className="cp-spinner" /> Saving Plan…</>
                ) : isSuccess ? (
                  <><div className="cp-check-icon"><Check size={13} /></div> Plan Created Successfully</>
                ) : (
                  <><Sparkles size={15} /> Create Plan <ChevronRight size={15} /></>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="cp-side">
          <div className="cp-preview-card">
            <div className="cp-preview-head">
              <span className="cp-preview-label">Live Preview</span>
              <span className="cp-preview-chip">Preview</span>
            </div>
            <div className={`cp-preview-name${!form.planName ? " empty" : ""}`}>
              {form.planName || "Plan Name"}
            </div>
            <div className="cp-preview-price-row">
              <span className="cp-preview-currency">$</span>
              <span className="cp-preview-amount">{form.price || "0"}</span>
              <span className="cp-preview-period">/ month</span>
            </div>
            <div className="cp-divider-gold" />
            <div className="cp-preview-meta">
              Supports up to <strong>{form.employees || "∞"}</strong> employees
            </div>
            <div className="cp-features">
              {FEATURES.map((f) => (
                <div className="cp-feature" key={f}>
                  <div className="cp-feature-check"><Check size={10} /></div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="cp-tips-card">
            <div className="cp-tips-title">✦ Best Practices</div>
            <div className="cp-tips-list">
              {[
                "Use tier names like Starter, Pro, and Enterprise for clarity",
                "Set employee limits based on your infrastructure capacity",
                "Price competitively — review comparable plans monthly",
              ].map((tip, i) => (
                <div className="cp-tip" key={i}>
                  <span className="cp-tip-arrow">›</span>{tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}