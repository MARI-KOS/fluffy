import styles from "./HeroSection.module.css";
import shared from "./Shared.module.css";

export default function HeroSection() {
  return (
    <section className={`${shared.section} ${styles.heroSection}`}>
      <div className={styles.heroContent}>
        <span className={styles.heroLogo}>My Profile</span>
        <h1 className={styles.heroTitle}>
          Prince Fuwamocchi III
          <br />
          Official
        </h1>
        <p className={styles.heroDesc}>I'm a Fluffy Genius!</p>
      </div>
      <div className={styles.scrollHint}>SCROLL DOWN</div>
    </section>
  );
}
