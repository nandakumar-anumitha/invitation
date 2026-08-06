"use client";

const invitation = {
  couple: "V. Nandakumar B.E & CMA K. Anumitha B.COM",
  date: "23.08.2026",
  time: "10:30 AM",
  venue: "Prem Mahal",
  address: "1st Main Road, MMDA, TNHB Layout, Mathur, Tamil Nadu",
  rsvpName: "Kumar Family",
  rsvpPhone: "+91 98765 43210",
};

export default function Home() {
  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to RSVP for ${invitation.couple}'s engagement.`
  );
  const mapQuery = encodeURIComponent(
    `${invitation.venue}, ${invitation.address}`
  );

  return (
    <main>
      <section className="hero" aria-label="Engagement invitation">
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">Engagement Ceremony</p>
          <h1>{invitation.couple}</h1>
          <p className="intro">
            With joy in our hearts, we invite you to bless the beginning of
            their forever on {invitation.date} at {invitation.time}.
          </p>
          <div className="heroActions" aria-label="Invitation actions">
            <a className="primaryButton" href="#details">
              View Details
            </a>
            <a
              className="secondaryButton"
              href={`https://wa.me/${invitation.rsvpPhone.replace(/\D/g, "")}?text=${whatsappMessage}`}
            >
              RSVP
            </a>
          </div>
        </div>
      </section>

      <section className="videoBand" aria-label="Engagement invitation video">
        <div className="videoContent">
          <p className="script">Watch the invitation</p>
          <div className="videoFrame">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/engagement-hero.png"
            >
              <source src="/engagement-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section id="details" className="detailsBand" aria-label="Event details">
        <div className="detailsGrid">
          <article className="detailCard">
            <span>Date</span>
            <strong>{invitation.date}</strong>
          </article>
          <article className="detailCard">
            <span>Time</span>
            <strong>{invitation.time}</strong>
          </article>
          <article className="detailCard">
            <span>Venue</span>
            <strong>{invitation.venue}</strong>
            <p>{invitation.address}</p>
          </article>
        </div>
      </section>

      <section className="messageBand" aria-label="Invitation message">
        <div className="messageContent">
          <p className="script">Together with their families</p>
          <h2>Please join us for an evening of love, laughter, and blessings.</h2>
          <p>
            Your presence will make this celebration warmer and more memorable.
          </p>
          <div className="footerActions">
            <a
              className="primaryButton"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            >
              Open Map
            </a>
            <button
              className="secondaryButton"
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && navigator.clipboard) {
                  void navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              Copy Link
            </button>
          </div>
          <p className="rsvp">
            RSVP: {invitation.rsvpName} | {invitation.rsvpPhone}
          </p>
        </div>
      </section>
    </main>
  );
}
