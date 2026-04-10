import React, { useState, useEffect } from "react";
import {
    Sparkles, ChevronRight, Check,
    AlertCircle, Loader2, RefreshCw, X,
    Pencil, Trash2, Users, DollarSign, LayoutGrid, Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/createplan.css";
import "../../styles/plan.css";

// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
    "Unlimited API access",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
];

const INITIAL_FORM = { planName: "", price: "", employees: "" };

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirm Modal
// ─────────────────────────────────────────────────────────────────────────────
function DeleteModal({ plan, onConfirm, onCancel, loading }) {
    if (!plan) return null;
    return (
        <div className="cp-overlay">
            <div className="cp-modal">
                <div className="cp-modal-icon"><Trash2 size={20} /></div>
                <h3 className="cp-modal-title">Delete Plan</h3>
                <p className="cp-modal-desc">
                    Are you sure you want to delete <strong>"{plan.planName}"</strong>?
                    This cannot be undone.
                </p>
                <div className="cp-modal-actions">
                    <button className="cp-modal-cancel" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="cp-modal-confirm" onClick={onConfirm} disabled={loading}>
                        {loading ? <><Loader2 size={13} className="cp-spinner" /> Deleting…</> : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function CreatePlan() {
    const { createPlan, getPlans, updatePlan, deletePlan } = useAuth();

    // ── Form state ──────────────────────────────────────────────────────────────
    const [form, setForm] = useState(INITIAL_FORM);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState("");
    const [toast, setToast] = useState(null);

    // ── Edit mode ───────────────────────────────────────────────────────────────
    const [editingId, setEditingId] = useState(null); // null = create mode

    // ── Plans list ──────────────────────────────────────────────────────────────
    const [plans, setPlans] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [listError, setListError] = useState("");

    // ── Delete modal ────────────────────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ── Load plans ──────────────────────────────────────────────────────────────
    const loadPlans = async () => {
        setListLoading(true);
        setListError("");
        const result = await getPlans();
        if (result.success) {
            setPlans(result.data);
        } else {
            setListError(result.message);
        }
        setListLoading(false);
    };

    useEffect(() => { loadPlans(); }, []);
    useEffect(() => {
        if (deleteTarget) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [deleteTarget]);
    // ── Toast helper ────────────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // ── Field change ────────────────────────────────────────────────────────────
    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (status === "error") setStatus("idle");
    };

    // ── Reset form to CREATE mode ───────────────────────────────────────────────
    const resetForm = () => {
        setForm(INITIAL_FORM);
        setEditingId(null);
        setStatus("idle");
        setErrorMsg("");
    };

    // ── Click Edit on a row ─────────────────────────────────────────────────────
    const handleEditClick = (plan) => {
        setEditingId(plan.planId ?? plan.id);
        setForm({
            planName: plan.planName,
            price: String(plan.price),
            employees: plan.employeeLimit != null ? String(plan.employeeLimit) : "",
        });
        setStatus("idle");
        setErrorMsg("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Submit (create or update) ───────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e?.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        let result;

        if (editingId) {
            // UPDATE
            result = await updatePlan(editingId, form.planName.trim(), form.price, form.employees);
        } else {
            // CREATE
            result = await createPlan(form.planName.trim(), form.price, form.employees);
        }

        if (result.success) {
            setStatus("success");
            showToast(
                "success",
                editingId
                    ? `"${form.planName.trim()}" updated successfully!`
                    : `"${form.planName.trim()}" plan created successfully!`
            );
            setTimeout(() => {
                resetForm();
                loadPlans(); // refresh list
            }, 1500);
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

    // ── Delete confirm ──────────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        const id = deleteTarget.planId ?? deleteTarget.id;
        const result = await deletePlan(id);
        if (result.success) {
            showToast("success", `"${deleteTarget.planName}" deleted.`);
            // If we were editing this plan, reset the form
            if (editingId === id) resetForm();
            setDeleteTarget(null);
            loadPlans();
        } else {
            showToast("error", result.message);
            setDeleteTarget(null);
        }
        setDeleteLoading(false);
    };

    // ── Derived ─────────────────────────────────────────────────────────────────
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";
    const isEditing = !!editingId;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="cp-root">
            <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />

            <DeleteModal
                plan={deleteTarget}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteLoading}
            />

            {/* ── Header ────────────────────────────────────────────────────────── */}
            <div className="cp-header">
                <div className="cp-title-block">
                    <div className="cp-eyebrow"><Sparkles size={12} /> Plan Management</div>
                    <h1 className="cp-title">
                        {isEditing ? <>Edit <span>Plan</span></> : <>Create <span>Plan</span></>}
                    </h1>
                    <p className="cp-subtitle">Configure subscription plans for your tenants</p>
                </div>
                <div className="cp-badge">
                    <span className="cp-badge-dot" />
                    System Active
                </div>
            </div>

            {/* ── Main 2-column layout ──────────────────────────────────────────── */}
            <div className="cp-main">

                {/* ── Left: Form ────────────────────────────────────────────────── */}
                <div className="cp-form-card">

                    {/* Form header — shows Cancel Edit when in edit mode */}
                    <div className="cp-form-top">
                        <div>
                            <h2 className="cp-form-title">
                                {isEditing ? "Edit Plan" : "Plan Configuration"}
                            </h2>
                            <p className="cp-form-desc">
                                Fields marked <span style={{ color: "var(--gold)" }}>*</span> are required.
                            </p>
                        </div>
                        {isEditing && (
                            <button className="cp-cancel-edit" onClick={resetForm} disabled={isLoading}>
                                <X size={13} /> Cancel Edit
                            </button>
                        )}
                    </div>

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
                                <span className="cp-input-hint">Choose a clear, descriptive name</span>
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
                                className={`cp-btn${isSuccess ? " success" : ""}${isLoading ? " loading" : ""}${isEditing ? " editing" : ""}`}
                                disabled={isLoading || isSuccess}
                            >
                                {isLoading ? (
                                    <><Loader2 size={15} className="cp-spinner" /> {isEditing ? "Saving…" : "Creating…"}</>
                                ) : isSuccess ? (
                                    <><div className="cp-check-icon"><Check size={13} /></div> {isEditing ? "Plan Updated!" : "Plan Created!"}</>
                                ) : isEditing ? (
                                    <><Check size={15} /> Save Changes <ChevronRight size={15} /></>
                                ) : (
                                    <><Sparkles size={15} /> Create Plan <ChevronRight size={15} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Right: Preview + Tips ──────────────────────────────────────── */}
                <div className="cp-side">
                    <div className="cp-preview-card">
                        <div className="cp-preview-head">
                            <span className="cp-preview-label">Live Preview</span>
                            <span className="cp-preview-chip">{isEditing ? "Editing" : "Preview"}</span>
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

            {/* ── Plans List Table ───────────────────────────────────────────────── */}
            <div className="cp-list-section">

                {/* List header */}
                <div className="cp-list-header">
                    <div>
                        <div className="cp-eyebrow"><LayoutGrid size={12} /> All Plans</div>
                        <h2 className="cp-list-title">Existing Plans</h2>
                    </div>
                    <div className="cp-list-meta">
                        <span className="cp-list-count">{plans.length} plan{plans.length !== 1 ? "s" : ""}</span>
                        <button className="cp-refresh-btn" onClick={loadPlans} disabled={listLoading}>
                            <RefreshCw size={13} className={listLoading ? "cp-spinner" : ""} />
                        </button>
                    </div>
                </div>

                {/* Stats strip */}
                {plans.length > 0 && (
                    <div className="cp-stats-strip">
                        <div className="cp-stat">
                            <div className="cp-stat-icon"><LayoutGrid size={14} /></div>
                            <span className="cp-stat-val">{plans.length}</span>
                            <span className="cp-stat-label">Total</span>
                        </div>
                        <div className="cp-stat">
                            <div className="cp-stat-icon"><DollarSign size={14} /></div>
                            <span className="cp-stat-val">${Math.min(...plans.map(p => p.price)).toFixed(0)}</span>
                            <span className="cp-stat-label">Lowest</span>
                        </div>
                        <div className="cp-stat">
                            <div className="cp-stat-icon"><DollarSign size={14} /></div>
                            <span className="cp-stat-val">${Math.max(...plans.map(p => p.price)).toFixed(0)}</span>
                            <span className="cp-stat-label">Highest</span>
                        </div>
                        <div className="cp-stat">
                            <div className="cp-stat-icon"><Users size={14} /></div>
                            <span className="cp-stat-val">{plans.filter(p => p.employeeLimit == null).length}</span>
                            <span className="cp-stat-label">Unlimited</span>
                        </div>
                    </div>
                )}

                {/* Table card */}
                <div className="cp-table-card">

                    {/* Loading */}
                    {listLoading && (
                        <div className="cp-table-center">
                            <Loader2 size={26} className="cp-spinner cp-spinner-gold" />
                            <p>Loading plans…</p>
                        </div>
                    )}

                    {/* Error */}
                    {!listLoading && listError && (
                        <div className="cp-table-center">
                            <AlertCircle size={26} color="#ef4444" />
                            <p style={{ color: "#ef4444" }}>{listError}</p>
                            <button className="cp-retry-btn cp-mt" onClick={loadPlans}>
                                <RefreshCw size={12} /> Retry
                            </button>
                        </div>
                    )}

                    {/* Empty */}
                    {!listLoading && !listError && plans.length === 0 && (
                        <div className="cp-table-center">
                            <LayoutGrid size={30} style={{ color: "#d4c9b0" }} />
                            <p style={{ color: "#9a9080" }}>No plans yet. Create your first plan above.</p>
                        </div>
                    )}

                    {/* Table */}
                    {!listLoading && !listError && plans.length > 0 && (
                        <table className="cp-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Plan Name</th>
                                    <th>Price / mo</th>
                                    <th>Employee Limit</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan, idx) => {
                                    const id = plan.planId ?? plan.id;
                                    const isRowEditing = editingId === id;
                                    return (
                                        <tr key={id ?? idx} className={`cp-tr${isRowEditing ? " cp-tr--active" : ""}`}>
                                            <td className="cp-td-num">{idx + 1}</td>
                                            <td>
                                                <div className="cp-td-name">
                                                    {plan.planName}
                                                    {isRowEditing && <span className="cp-editing-badge">Editing</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="cp-td-price">${Number(plan.price).toFixed(2)}</span>
                                            </td>
                                            <td>
                                                {plan.employeeLimit != null
                                                    ? <span className="cp-chip cp-chip--limit"><Users size={11} /> {plan.employeeLimit}</span>
                                                    : <span className="cp-chip cp-chip--unlimited">∞ Unlimited</span>
                                                }
                                            </td>
                                            <td>
                                                <div className="cp-td-actions">
                                                    <button
                                                        className="cp-action-btn cp-action-btn--edit"
                                                        onClick={() => handleEditClick(plan)}
                                                        title="Edit"
                                                        disabled={isLoading}
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        className="cp-action-btn cp-action-btn--delete"
                                                        onClick={() => setDeleteTarget(plan)}
                                                        title="Delete"
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}