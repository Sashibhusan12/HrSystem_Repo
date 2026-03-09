import React, { useState } from "react";
import { TrendingUp, Users, DollarSign, Calendar, Sparkles, ChevronRight, Check } from "lucide-react";
import "../../styles/createplan.css";

const stats = [
    { title: "Total Plans", value: "5", icon: TrendingUp, suffix: "" },
    { title: "Total Users", value: "120", icon: Users, suffix: "" },
    { title: "Revenue", value: "5,000", icon: DollarSign, prefix: "$" },
    { title: "Active Subscriptions", value: "45", icon: Calendar, suffix: "" },
];

const features = [
    "Unlimited API access",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
];

export default function CreatePlan() {
    const [planName, setPlanName] = useState("");
    const [price, setPrice] = useState("");
    const [employees, setEmployees] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <>
          
            <div className="cp-root">
                {/* Header */}
                <div className="cp-header">
                    <div className="cp-title-block">
                        <div className="cp-eyebrow">
                            <Sparkles size={12} />
                            Plan Management
                        </div>
                        <h1 className="cp-title">Create <span>Plan</span></h1>
                        <p className="cp-subtitle">Configure a new subscription plan for your tenants</p>
                    </div>
                    <div className="cp-badge">
                        <span className="cp-badge-dot" />
                        System Active
                    </div>
                </div>

                {/* Stats */}
                <div className="cp-stats">
                    {stats.map(({ title, value, icon: Icon, prefix, suffix }) => (
                        <div className="cp-stat" key={title}>
                            <div className="cp-stat-top">
                                <span className="cp-stat-label">{title}</span>
                                <div className="cp-stat-icon"><Icon size={15} /></div>
                            </div>
                            <div className="cp-stat-value">
                                {prefix && <sup>{prefix}</sup>}
                                {value}{suffix}
                            </div>
                            <div className="cp-stat-bar" />
                        </div>
                    ))}
                </div>

                {/* Main */}
                <div className="cp-main">
                    {/* Form */}
                    <div className="cp-form-card">
                        <h2 className="cp-form-title">Plan Configuration</h2>
                        <p className="cp-form-desc">Define the plan details. Fields marked <span style={{ color: 'var(--gold)' }}>*</span> are required.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="cp-fields">
                                <div className="cp-field">
                                    <label className="cp-label">
                                        Plan Name <span className="cp-label-req">*</span>
                                    </label>
                                    <input
                                        className="cp-input"
                                        type="text"
                                        placeholder="e.g. Enterprise Gold"
                                        value={planName}
                                        onChange={(e) => setPlanName(e.target.value)}
                                        required
                                    />
                                    <span className="cp-input-hint">Choose a clear, descriptive name for your plan</span>
                                </div>

                                <div className="cp-row">
                                    <div className="cp-field">
                                        <label className="cp-label">
                                            Price <span className="cp-label-req">*</span>
                                        </label>
                                        <div className="cp-input-wrap">
                                            <span className="cp-input-prefix">$</span>
                                            <input
                                                className="cp-input has-prefix"
                                                type="number"
                                                placeholder="0.00"
                                                value={price}
                                                min="0"
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <span className="cp-input-hint">Monthly billing amount</span>
                                    </div>

                                    <div className="cp-field">
                                        <label className="cp-label">Employee Limit</label>
                                        <input
                                            className="cp-input"
                                            type="number"
                                            placeholder="e.g. 50"
                                            value={employees}
                                            min="1"
                                            onChange={(e) => setEmployees(e.target.value)}
                                        />
                                        <span className="cp-input-hint">Leave blank for unlimited</span>
                                    </div>
                                </div>
                            </div>

                            <div className="cp-divider" />

                            <div className="cp-submit-wrap">
                                <button type="submit" className={`cp-btn${submitted ? ' success' : ''}`}>
                                    {submitted ? (
                                        <>
                                            <div className="cp-check-icon"><Check size={13} /></div>
                                            Plan Created Successfully
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={15} />
                                            Create Plan
                                            <ChevronRight size={15} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Side Panel */}
                    <div className="cp-side">
                        {/* Live Preview */}
                        <div className="cp-preview-card">
                            <div className="cp-preview-head">
                                <span className="cp-preview-label">Live Preview</span>
                                <span className="cp-preview-chip">Preview</span>
                            </div>

                            <div className={`cp-preview-name${!planName ? ' empty' : ''}`}>
                                {planName || "Plan Name"}
                            </div>

                            <div className="cp-preview-price-row">
                                <span className="cp-preview-currency">$</span>
                                <span className="cp-preview-amount">{price || "0"}</span>
                                <span className="cp-preview-period">/ month</span>
                            </div>

                            <div className="cp-divider-gold" />

                            <div className="cp-preview-meta">
                                Supports up to <strong>{employees || "∞"}</strong> employees
                            </div>

                            <div className="cp-features">
                                {features.map((f) => (
                                    <div className="cp-feature" key={f}>
                                        <div className="cp-feature-check"><Check size={10} /></div>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="cp-tips-card">
                            <div className="cp-tips-title">✦ Best Practices</div>
                            <div className="cp-tips-list">
                                {[
                                    "Use tier names like Starter, Pro, and Enterprise for clarity",
                                    "Set employee limits based on your infrastructure capacity",
                                    "Price competitively — review comparable plans monthly",
                                ].map((tip, i) => (
                                    <div className="cp-tip" key={i}>
                                        <span className="cp-tip-arrow">›</span>
                                        {tip}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}