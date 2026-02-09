export default function MovieSection() {
  return (
    <section id="movie">
      <h2 className="section-title">Movie</h2>
      <div className="glass-card scroll-anim movie-card">
        <video className="movie-video" controls autoPlay muted loop playsInline preload="metadata">
          <source src="/videos/weryai_1770532067183.mp4" type="video/mp4" />
          お使いのブラウザは動画タグに対応していません。
        </video>
      </div>
    </section>
  );
}
