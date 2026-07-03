import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({ label = "Loading" }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status">
      <span className="loading-spinner__ring" aria-hidden="true" />
      <span className="loading-spinner__label">{label}</span>
    </div>
  );
}
