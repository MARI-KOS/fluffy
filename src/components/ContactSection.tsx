export default function ContactSection() {
  return (
    <section id="contact">
      <h2 className="section-title">Contact</h2>
      <div className="contact-form-wrapper scroll-anim">
        <p className="contact-intro">感想やメッセージをお待ちしています！</p>
        <form id="myContactForm">
          <div className="form-row">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" placeholder="お名前" required />
          </div>
          <div className="form-row">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" placeholder="メールアドレス" required />
          </div>
          <div className="form-row">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              className="form-control form-textarea"
              rows={4}
              placeholder="メッセージ"
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
      <footer>&copy; 2026 Prince Fuwamocchi III. All Rights Reserved.</footer>
    </section>
  );
}
