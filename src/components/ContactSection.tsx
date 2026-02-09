import styles from "./ContactSection.module.css";
import shared from "./Shared.module.css";

export default function ContactSection() {
  return (
    <section id="contact" className={shared.section}>
      <h2 className={shared.sectionTitle}>Contact</h2>
      <div className={styles.contactFormWrapper} data-scroll-anim>
        <p className={styles.contactIntro}>感想やメッセージをお待ちしています！</p>
        <form id="myContactForm">
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Name</label>
            <input type="text" name="name" className={styles.formControl} placeholder="お名前" required />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Email</label>
            <input type="email" name="email" className={styles.formControl} placeholder="メールアドレス" required />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Message</label>
            <textarea
              name="message"
              className={`${styles.formControl} ${styles.formTextarea}`}
              rows={4}
              placeholder="メッセージ"
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>
      </div>
      <footer className={styles.footer}>&copy; 2026 Prince Fuwamocchi III. All Rights Reserved.</footer>
    </section>
  );
}
