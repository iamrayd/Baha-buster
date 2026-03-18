"use client";

import { useState } from "react";
import { X, Send, AlertTriangle, Loader2 } from "lucide-react";
import { createAlert, AlertSeverity, AlertStatus } from "@/src/services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const BARANGAYS = [
  "ADLAON", "AGSUNGOT", "APAS", "BABAG", "BACAYAN", "BANILAD", "BARRIO LUZ",
  "BASAK PARDO", "BASAK SAN NICOLAS", "BINALIW", "BONBON", "BUDLAAN",
  "BUHISAN", "BULACAO PARDO", "BUSAY", "BUOT-TAUP", "CALAMBA", "CAMBINOCOT",
  "CAMPUTHAW", "CAPITOL SITE", "CARRETA", "COGON PARDO", "COGON RAMOS",
  "DAY-AS", "DULJO", "ERMITA", "GUBA", "GUADALUPE", "HIPODROMO", "INAYAWAN",
  "KALUBIHAN", "KALUNASAN", "KAMAGAYAN", "KASAMBAGAN", "KINASANG-AN PARDO",
  "LABANGON", "LAHUG", "LOREGA SAN MIGUEL", "LUSARAN", "MABINI", "MABOLO",
  "MALUBOG", "MAMBALING", "PAHINA CENTRAL", "PAHINA SAN NICOLAS", "PAMUTAN",
  "PARIAN", "PARIL", "PASIL", "PIT-OS", "PULANGBATO", "PUNG-OL SIBUGAY",
  "PUNTA PRINCESA", "PARDO POB.", "QUIOT PARDO", "SAMBAG I", "SAMBAG II",
  "SAN ANTONIO", "SAN JOSE", "SAN NICOLAS CENTRAL", "SAN ROQUE",
  "SANTA CRUZ", "SAPANGDAKU", "SAWANG CALERO", "SINSIN", "SIRAO",
  "STO. NINO", "SUBA", "SUDLON I", "SUDLON II", "T. PADILLA", "TABUNAN",
  "TAGBA-O", "TALAMBAN", "TAPTAP", "TEJERO", "TINAGO", "TISA", "TOONG",
  "ZAPATERA",
].sort();

const SEVERITY_OPTIONS: { value: AlertSeverity; label: string; color: string; bg: string }[] = [
  { value: "low",      label: "Low",      color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"   },
  { value: "moderate", label: "Moderate", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  { value: "high",     label: "High",     color: "text-red-700",    bg: "bg-red-50 border-red-200"     },
];

const STATUS_OPTIONS: { value: AlertStatus; label: string }[] = [
  { value: "active",   label: "Active"   },
  { value: "inactive", label: "Inactive" },
  { value: "resolved", label: "Resolved" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddAlertModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  title: string;
  location: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
}

const INITIAL_FORM: FormState = {
  title: "",
  location: "",
  description: "",
  severity: "moderate",
  status: "active",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddAlertModal({ onClose, onSuccess }: AddAlertModalProps) {
  const [form, setForm]       = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSeveritySelect(value: AlertSeverity) {
    setForm((prev) => ({ ...prev, severity: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.location || !form.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await createAlert({
        title:        form.title.trim(),
        location:     form.location,
        description:  form.description.trim(),
        severity:     form.severity,
        status:       form.status,
        acknowledged: false,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send alert. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSeverity = SEVERITY_OPTIONS.find((s) => s.value === form.severity)!;

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Send Alert</h2>
              <p className="text-xs text-gray-500 mt-0.5">Broadcast a flood alert to a barangay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Alert Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Flood Warning"
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Barangay / Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Barangay <span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              <option value="">Select a barangay</option>
              {BARANGAYS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the situation in detail..."
              rows={3}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {/* Severity — pill selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SEVERITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSeveritySelect(opt.value)}
                  disabled={submitting}
                  className={`
                    py-2 text-xs font-semibold rounded-lg border transition-all
                    ${form.severity === opt.value
                      ? `${opt.bg} ${opt.color} ring-2 ring-offset-1 ring-current`
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }
                    disabled:opacity-50
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: opt.value }))}
                  disabled={submitting}
                  className={`
                    flex-1 py-2 text-xs font-medium rounded-lg border transition-all
                    ${form.status === opt.value
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }
                    disabled:opacity-50
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview pill */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs text-gray-500">Preview:</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${selectedSeverity.bg} ${selectedSeverity.color}`}>
              {selectedSeverity.label.toUpperCase()}
            </span>
            {form.location && (
              <span className="text-xs text-gray-600 font-medium">→ {form.location}</span>
            )}
            {form.title && (
              <span className="text-xs text-gray-400 truncate">&quot;{form.title}&quot;</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Send Alert
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}