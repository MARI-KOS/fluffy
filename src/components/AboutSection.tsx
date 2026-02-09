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
            あら、いらっしゃい！
            <br />
            世界で一番フワフワ、プリンス・フワモッチ・三世よ。まずはこの毛並みをじっくり堪能してちょうだい！画面をなでなでするのは禁止よ？
            指紋がついちゃうから……うふふ、冗談だわ！どんどん愛でてちょうだいね！
          </p>
        </div>
      </div>
    </section>
  );
}
