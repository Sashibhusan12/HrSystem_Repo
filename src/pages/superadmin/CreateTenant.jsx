import { useState, useCallback } from "react";

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  .ct-root {
    font-family: 'DM Sans', sans-serif;
    color: #e8e8e2;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
   
}
  .ct-page { width: 100%; }

  .ct-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,210,157,0.1);
    border: 1px solid rgba(99,210,157,0.25);
    color: #63d29d;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 4px 10px;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .ct-badge-dot {
    width: 6px; height: 6px;
    background: #63d29d;
    border-radius: 50%;
    box-shadow: 0 0 6px #63d29d;
  }

  .ct-h1 {
    font-family: 'Space Mono', monospace;
    font-size: 26px;
    font-weight: 700;
    color: #f0f0ea;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 8px;
  }

  .ct-h1 span { color: #63d29d; }

  .ct-subtitle {
    font-size: 14px;
    color: #6b7280;
    font-weight: 300;
    margin: 0 0 36px;
  }

  .ct-card {
    background: #161820;
    border: 1px solid #252830;
    border-radius: 16px;
    padding: 36px;
    position: relative;
    overflow: hidden;
    width: 1000px;
  }

  .ct-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,210,157,0.4), transparent);
  }

  .ct-section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: #63d29d;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ct-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #252830;
  }

  .ct-grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 500px) {
    .ct-grid2 { grid-template-columns: 1fr; }
  }

  .ct-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .ct-field-full { grid-column: 1 / -1; }

  .ct-label {
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    letter-spacing: 0.03em;
  }

  .ct-req { color: #63d29d; margin-left: 2px; }

  .ct-input, .ct-select, .ct-textarea {
    background: #0d0f14;
    border: 1px solid #252830;
    border-radius: 8px;
    color: #e8e8e2;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }

  .ct-input::placeholder, .ct-textarea::placeholder { color: #3d424e; }

  .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
    border-color: rgba(99,210,157,0.5);
    box-shadow: 0 0 0 3px rgba(99,210,157,0.08);
  }

  .ct-input.ct-error-field { border-color: rgba(248,113,113,0.5); }
  .ct-input.ct-error-field:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.08); }

  .ct-select.ct-error-field { border-color: rgba(248,113,113,0.5); }

  .ct-error-msg {
    font-size: 11px;
    color: #f87171;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ct-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    cursor: pointer;
  }

  .ct-textarea { resize: none; height: 80px; }

  .ct-slug-wrap {
    display: flex;
    align-items: center;
    background: #0d0f14;
    border: 1px solid #252830;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .ct-slug-wrap.focused {
    border-color: rgba(99,210,157,0.5);
    box-shadow: 0 0 0 3px rgba(99,210,157,0.08);
  }

  .ct-slug-wrap.ct-error-field { border-color: rgba(248,113,113,0.5); }

  .ct-slug-prefix {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #6b7280;
    background: #13151a;
    border-right: 1px solid #252830;
    padding: 10px 12px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ct-slug-input {
    background: transparent;
    border: none !important;
    outline: none;
    color: #e8e8e2;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    width: 100%;
    box-shadow: none !important;
  }

  .ct-slug-input::placeholder { color: #3d424e; }

  .ct-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: #0d0f14;
    border: 1px solid #252830;
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .ct-toggle-info { display: flex; flex-direction: column; gap: 2px; }
  .ct-toggle-info strong { font-size: 13px; font-weight: 500; color: #e8e8e2; }
  .ct-toggle-info small { font-size: 11px; color: #6b7280; }

  .ct-toggle-track {
    position: relative;
    width: 38px; height: 22px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .ct-toggle-track input { position: absolute; opacity: 0; width: 0; height: 0; }

  .ct-toggle-slider {
    position: absolute;
    inset: 0;
    background: #252830;
    border-radius: 11px;
    transition: background 0.2s;
  }

  .ct-toggle-slider::before {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    left: 3px; top: 3px;
    background: #6b7280;
    border-radius: 50%;
    transition: transform 0.2s, background 0.2s;
  }

  .ct-toggle-track input:checked + .ct-toggle-slider {
    background: rgba(99,210,157,0.2);
    border: 1px solid rgba(99,210,157,0.4);
  }

  .ct-toggle-track input:checked + .ct-toggle-slider::before {
    transform: translateX(16px);
    background: #63d29d;
  }

  .ct-divider {
    border: none;
    border-top: 1px solid #252830;
    margin: 24px 0;
  }

  .ct-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .ct-btn-cancel {
    background: transparent;
    border: 1px solid #252830;
    border-radius: 8px;
    color: #6b7280;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 20px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .ct-btn-cancel:hover { border-color: #3d424e; color: #9ca3af; }

  .ct-btn-create {
    background: #63d29d;
    border: none;
    border-radius: 8px;
    color: #0d0f14;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    padding: 10px 24px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ct-btn-create:hover {
    background: #7ae0ad;
    box-shadow: 0 0 20px rgba(99,210,157,0.3);
  }

  .ct-btn-create:active { transform: scale(0.98); }
  .ct-btn-create:disabled { opacity: 0.5; cursor: not-allowed; }

  .ct-success {
    background: rgba(99,210,157,0.08);
    border: 1px solid rgba(99,210,157,0.25);
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #63d29d;
    animation: ct-fadeIn 0.3s ease;
  }

  @keyframes ct-fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Initial State ──────────────────────────────────────────────────────────
const INITIAL = {
  tenantName: "",
  displayName: "",
  slug: "",
  email: "",
  plan: "",
  maxUsers: "",
  storage: "",
  region: "us-east",
  notes: "",
  isActive: true,
  isTrial: false,
  customDomain: false,
};

// ─── Sub-components ─────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="ct-field">
      <label className="ct-label">
        {label}
        {required && <span className="ct-req">*</span>}
      </label>
      {children}
      {error && <span className="ct-error-msg">⚠ {error}</span>}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="ct-toggle-row">
      <div className="ct-toggle-info">
        <strong>{label}</strong>
        <small>{description}</small>
      </div>
      <label className="ct-toggle-track">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="ct-toggle-slider" />
      </label>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function CreateTenant({ onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [slugFocused, setSlugFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-generate slug from tenant name
  const handleNameChange = useCallback((value) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((f) => ({ ...f, tenantName: value, slug }));
    setErrors((e) => ({ ...e, tenantName: "", slug: "" }));
  }, []);

  const handleSlugChange = useCallback((value) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, slug: clean }));
    setErrors((e) => ({ ...e, slug: "" }));
  }, []);

  const set = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  // Validate
  const validate = () => {
    const errs = {};
    if (!form.tenantName.trim()) errs.tenantName = "Tenant name is required";
    if (!form.slug || !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(form.slug))
      errs.slug = "Slug must be lowercase alphanumeric (e.g. acme-corp)";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.plan) errs.plan = "Please select a plan";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // Replace with your real API call, e.g.:
      // await fetch("/api/tenants", { method: "POST", body: JSON.stringify(form) });
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      if (onSubmit) onSubmit(form);
      setSuccess(true);
      setForm(INITIAL);
      setErrors({});
      setTimeout(() => setSuccess(false), 3500);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(INITIAL);
    setErrors({});
    setSuccess(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ct-root">
        <div className="ct-page">
          {/* Header */}
          <div>
            <div className="ct-badge">
              <span className="ct-badge-dot" />
              SaaS ADMIN PANEL
            </div>
            <h1 className="ct-h1">
              Create <span>Tenant</span>
            </h1>
            <p className="ct-subtitle">Provision a new tenant workspace on the platform</p>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="ct-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#63d29d" />
                <path d="M5 8l2 2 4-4" stroke="#63d29d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tenant created successfully!
            </div>
          )}

          {/* Card */}
          <div className="ct-card">

            {/* ── Section: Basic Info ── */}
            <div className="ct-section-label">Basic info</div>
            <div className="ct-grid2">
              <Field label="Tenant name" required error={errors.tenantName}>
                <input
                  className={`ct-input${errors.tenantName ? " ct-error-field" : ""}`}
                  placeholder="Acme Corp"
                  value={form.tenantName}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </Field>

              <Field label="Display name">
                <input
                  className="ct-input"
                  placeholder="Acme Corporation"
                  value={form.displayName}
                  onChange={set("displayName")}
                />
              </Field>
            </div>

            <Field label="Slug / subdomain" required error={errors.slug}>
              <div className={`ct-slug-wrap${slugFocused ? " focused" : ""}${errors.slug ? " ct-error-field" : ""}`}>
                <span className="ct-slug-prefix">app.saas.com /</span>
                <input
                  className="ct-slug-input"
                  placeholder="acme-corp"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onFocus={() => setSlugFocused(true)}
                  onBlur={() => setSlugFocused(false)}
                />
              </div>
            </Field>

            <Field label="Contact email" required error={errors.email}>
              <input
                className={`ct-input${errors.email ? " ct-error-field" : ""}`}
                type="email"
                placeholder="admin@acmecorp.com"
                value={form.email}
                onChange={set("email")}
              />
            </Field>

            <hr className="ct-divider" />

            {/* ── Section: Plan & Settings ── */}
            <div className="ct-section-label">Plan &amp; settings</div>
            <div className="ct-grid2">
              <Field label="Subscription plan" required error={errors.plan}>
                <select
                  className={`ct-select${errors.plan ? " ct-error-field" : ""}`}
                  value={form.plan}
                  onChange={set("plan")}
                >
                  <option value="">Select plan</option>
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </Field>

              <Field label="Max users">
                <input
                  className="ct-input"
                  type="number"
                  placeholder="50"
                  min="1"
                  value={form.maxUsers}
                  onChange={set("maxUsers")}
                />
              </Field>

              <Field label="Storage limit (GB)">
                <input
                  className="ct-input"
                  type="number"
                  placeholder="10"
                  min="1"
                  value={form.storage}
                  onChange={set("storage")}
                />
              </Field>

              <Field label="Region">
                <select className="ct-select" value={form.region} onChange={set("region")}>
                  <option value="us-east">US East</option>
                  <option value="us-west">US West</option>
                  <option value="eu-west">EU West</option>
                  <option value="ap-south">AP South</option>
                </select>
              </Field>
            </div>

            <Field label="Notes">
              <textarea
                className="ct-textarea"
                placeholder="Internal notes about this tenant..."
                value={form.notes}
                onChange={set("notes")}
              />
            </Field>

            <hr className="ct-divider" />

            {/* ── Section: Features ── */}
            <div className="ct-section-label">Features</div>

            <ToggleRow
              label="Active"
              description="Tenant can log in and use the platform"
              checked={form.isActive}
              onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
            <ToggleRow
              label="Trial mode"
              description="Enable 14-day trial restrictions"
              checked={form.isTrial}
              onChange={(v) => setForm((f) => ({ ...f, isTrial: v }))}
            />
            <ToggleRow
              label="Custom domain"
              description="Allow tenant to configure a custom domain"
              checked={form.customDomain}
              onChange={(v) => setForm((f) => ({ ...f, customDomain: v }))}
            />

            {/* ── Actions ── */}
            <div className="ct-actions">
              <button className="ct-btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="ct-btn-create" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="#0d0f14" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Create Tenant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}