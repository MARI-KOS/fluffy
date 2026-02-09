export default function FavoritesSection() {
  return (
    <section id="works" className="slider-section">
      <div className="slider-container">
        <div className="slider-header-wrapper">
          <h2 className="section-title section-title--tight">My Favorites</h2>
        </div>

        <div className="slider-wrapper" id="sliderWrapper" aria-live="polite">
          <div className="slide active">
            <div className="work-card">
              <div className="work-img-area">
                <img className="work-img" src="/images/2.png" alt="Favorite 01: Sparkling Things" />
              </div>
              <div className="work-info">
                <span className="work-cat">Favorite 01</span>
                <h3 className="work-title">Sparkling Things</h3>
                <p className="work-desc">
                  自分の瞳に映る自分自身が一番キラキラしていてお気に入りだけど、たまに窓に映った自分に「あら、素敵な子ね」って挨拶しちゃうの。
                </p>
              </div>
            </div>
          </div>

          <div className="slide">
            <div className="work-card">
              <div className="work-img-area">
                <img className="work-img" src="/images/3.png" alt="Favorite 02: Crown Maintenance" />
              </div>
              <div className="work-info">
                <span className="work-cat">Favorite 02</span>
                <h3 className="work-title">Crown Maintenance</h3>
                <p className="work-desc">
                  すぐ頭から滑り落ちちゃうから、毎日角度を研究しているわ。でも最近、乗せるより「乗ってる気分」でいる方が大事だって気づいたのよ。
                </p>
              </div>
            </div>
          </div>

          <div className="slide">
            <div className="work-card">
              <div className="work-img-area">
                <img className="work-img" src="/images/4.png" alt="Favorite 03: Marshmallow Nap" />
              </div>
              <div className="work-info">
                <span className="work-cat">Favorite 03</span>
                <h3 className="work-title">Marshmallow Nap</h3>
                <p className="work-desc">マシュマロを食べながら寝るのが大好きなの。フワフワだからセーフだわ！</p>
              </div>
            </div>
          </div>

          <div className="slide">
            <div className="work-card">
              <div className="work-img-area">
                <img className="work-img" src="/images/nagi.jpg" alt="Favorite 04: Best Friend" />
              </div>
              <div className="work-info">
                <span className="work-cat">Favorite 04</span>
                <h3 className="work-title">Best Friend</h3>
                <p className="work-desc">いつもそばにいてくれる大切な存在。フワフワな時間を一緒に過ごすのが好き。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="slider-controls" aria-label="Slider controls">
          <button className="slider-btn slider-prev" id="sliderPrev" type="button" aria-label="Previous">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path className="slider-icon" d="M14.5 6.5L9 12l5.5 5.5" />
              <path className="slider-sparkle" d="M6.5 9.2l.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1z" />
            </svg>
          </button>
          <button className="slider-btn slider-next" id="sliderNext" type="button" aria-label="Next">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path className="slider-icon" d="M9.5 6.5L15 12l-5.5 5.5" />
              <path className="slider-sparkle" d="M17.5 12.8l.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1z" />
            </svg>
          </button>
        </div>

        <div className="swipe-hint">Swipe</div>
      </div>
    </section>
  );
}
