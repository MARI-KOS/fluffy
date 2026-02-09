import { withBasePath } from "@/lib/paths";
import styles from "./FavoritesSection.module.css";
import shared from "./Shared.module.css";

export default function FavoritesSection() {
  return (
    <section id="works" className={`${shared.section} ${styles.sliderSection}`}>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderHeaderWrapper}>
          <h2 className={`${shared.sectionTitle} ${shared.sectionTitleTight}`}>My Favorites</h2>
        </div>

        <div className={styles.sliderWrapper} id="sliderWrapper" aria-live="polite">
          <div className={styles.slide} data-active="true">
            <div className={styles.workCard}>
              <div className={styles.workImgArea}>
                <img className={styles.workImg} src={withBasePath("/images/2.png")} alt="Favorite 01: Sparkling Things" />
              </div>
              <div className={styles.workInfo}>
                <span className={styles.workCat}>Favorite 01</span>
                <h3 className={styles.workTitle}>Sparkling Things</h3>
                <p className={styles.workDesc}>
                  自分の瞳に映る自分自身が一番キラキラしていてお気に入りだけど、たまに窓に映った自分に「あら、素敵な子ね」って挨拶しちゃうの。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.slide}>
            <div className={styles.workCard}>
              <div className={styles.workImgArea}>
                <img className={styles.workImg} src={withBasePath("/images/3.png")} alt="Favorite 02: Crown Maintenance" />
              </div>
              <div className={styles.workInfo}>
                <span className={styles.workCat}>Favorite 02</span>
                <h3 className={styles.workTitle}>Crown Maintenance</h3>
                <p className={styles.workDesc}>
                  すぐ頭から滑り落ちちゃうから、毎日角度を研究しているわ。でも最近、乗せるより「乗ってる気分」でいる方が大事だって気づいたのよ。
                </p>
              </div>
            </div>
          </div>

          <div className={styles.slide}>
            <div className={styles.workCard}>
              <div className={styles.workImgArea}>
                <img className={styles.workImg} src={withBasePath("/images/4.png")} alt="Favorite 03: Marshmallow Nap" />
              </div>
              <div className={styles.workInfo}>
                <span className={styles.workCat}>Favorite 03</span>
                <h3 className={styles.workTitle}>Marshmallow Nap</h3>
                <p className={styles.workDesc}>マシュマロを食べながら寝るのが大好きなの。フワフワだからセーフだわ！</p>
              </div>
            </div>
          </div>

          <div className={styles.slide}>
            <div className={styles.workCard}>
              <div className={styles.workImgArea}>
                <img className={styles.workImg} src={withBasePath("/images/nagi.jpg")} alt="Favorite 04: Best Friend" />
              </div>
              <div className={styles.workInfo}>
                <span className={styles.workCat}>Favorite 04</span>
                <h3 className={styles.workTitle}>Best Friend</h3>
                <p className={styles.workDesc}>いつもそばにいてくれる大切な存在。フワフワな時間を一緒に過ごすのが好き。</p>
              </div>
            </div>
          </div>
          <div className={styles.sliderControls} aria-label="Slider controls">
            <button className={`${styles.sliderBtn} ${styles.sliderPrev}`} id="sliderPrev" type="button" aria-label="Previous">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path className={styles.sliderIcon} d="M14.5 6.5L9 12l5.5 5.5" />
                <path className={styles.sliderSparkle} d="M6.5 9.2l.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1z" />
              </svg>
            </button>
            <button className={`${styles.sliderBtn} ${styles.sliderNext}`} id="sliderNext" type="button" aria-label="Next">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path className={styles.sliderIcon} d="M9.5 6.5L15 12l-5.5 5.5" />
                <path className={styles.sliderSparkle} d="M17.5 12.8l.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1z" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
