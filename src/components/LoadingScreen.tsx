import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div id="loading-screen" aria-live="polite" className={styles.loadingScreen}>
      <div className={styles.loadingLogo}>Prince Fuwamocchi III</div>
      <div className={styles.loadingBarContainer} role="progressbar" aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.loadingBar} id="loading-bar" />
      </div>
      <p className={styles.loadingText}>LOADING...</p>
    </div>
  );
}
