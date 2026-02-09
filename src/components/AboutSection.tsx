import { withBasePath } from "@/lib/paths";
import styles from "./AboutSection.module.css";
import shared from "./Shared.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={shared.section}>
      <h2 className={shared.sectionTitle}>About Me</h2>
      <div className={shared.glassCard} data-scroll-anim>
        <div className={styles.profileImgWrapper}>
          <img className={styles.profileImg} src={withBasePath("/images/1.png")} alt="Prince Fuwamocchi III" />
        </div>
        <div className={styles.profileText}>
          <h3 className={styles.profileName}>Prince Fuwamocchi III</h3>
          <span className={styles.profileRole}>I'm a Fluffy Genius!</span>
          <p className={styles.profileDesc}>
            私の好きなものや、日々の「推し」を紹介するサイトです。
            <br />
            ゆっくりしていってくださいね！
          </p>
        </div>
      </div>
    </section>
  );
}
