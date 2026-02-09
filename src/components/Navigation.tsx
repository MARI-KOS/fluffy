import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <a href="#about" className={styles.navItem}>
        About
      </a>
      <a href="#movie" className={styles.navItem}>
        Movie
      </a>
      <a href="#works" className={styles.navItem}>
        Favorites
      </a>
      <a href="#contact" className={styles.navItem}>
        Contact
      </a>
    </nav>
  );
}
