/**
 * LoadingSpinner component with animated spinner and optional text.
 *
 * Props:
 *   - text: string (default: "Loading...")
 */
function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="spinner-overlay" id="loading-spinner">
      <div className="spinner"></div>
      <span className="spinner-text">{text}</span>
    </div>
  );
}

export default LoadingSpinner;
