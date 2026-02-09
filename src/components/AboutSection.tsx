export default function AboutSection() {
  return (
    <section id="about">
      <h2 className="section-title">About Me</h2>
      <div className="glass-card scroll-anim">
        <div className="profile-img-wrapper">
          <img className="profile-img" src="/images/1.png" alt="Prince Fuwamocchi III" />
        </div>
        <div className="profile-text">
          <h3 className="profile-name">Prince Fuwamocchi III</h3>
          <span className="profile-role">I'm a Fluffy Genius!</span>
          <p className="profile-desc">
            私の好きなものや、日々の「推し」を紹介するサイトです。
            <br />
            ゆっくりしていってくださいね！
          </p>
        </div>
      </div>
    </section>
  );
}
