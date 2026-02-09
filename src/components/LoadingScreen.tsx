export default function LoadingScreen() {
  return (
    <div id="loading-screen" aria-live="polite">
      <div className="loading-logo">Prince Fuwamocchi III</div>
      <div className="loading-bar-container" role="progressbar" aria-valuemin={0} aria-valuemax={100}>
        <div className="loading-bar" id="loading-bar" />
      </div>
      <p className="loading-text">LOADING...</p>
    </div>
  );
}
