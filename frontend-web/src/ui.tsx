import type { ReactNode } from 'react';
import { AlertCircle, Check, LoaderCircle, X } from 'lucide-react';

export function FormInput({
  label,
  error,
  required,
  ...props
}: {
  label: string;
  error?: string;
  required?: boolean;
  [key: string]: any;
}) {
  const id = props.name ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className="form-field" htmlFor={id}>
      <span>
        {label}
        {required && <b className="required"> *</b>}
      </span>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <small id={`${id}-error`} className="field-error" role="alert">
          <AlertCircle size={14} />
          {error}
        </small>
      ) : null}
    </label>
  );
}
export function Skeleton({ width = '100%', height = 16 }: { width?: string; height?: number }) {
  return <span className="skeleton" aria-busy="true" style={{ width, height }} />;
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Check size={24} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <button className="modal-close" aria-label="Close" onClick={onCancel}>
          <X size={18} />
        </button>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="modal-actions">
          <button className="secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="danger" disabled={loading} onClick={onConfirm}>
            {loading && <LoaderCircle className="spin" size={15} />} {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
