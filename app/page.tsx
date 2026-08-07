"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const invitation = {
  groom: "V. Nandakumar",
  bride: "CMA K. Anumitha",
  date: "23.08.2026",
  time: "10:30 AM",
  venue: "Prem Mahal",
  address: "1st Main Road, MMDA, TNHB Layout, Mathur, Tamil Nadu",
  contacts: [
    { name: "Aravind", phone: "78455 04099" },
    { name: "Nanda", phone: "8072734913" },
  ],
};

const videos = [
  {
    title: "Invitation video",
    src: "/engagement-video.mp4",
    useTamilSong: true,
  },
  {
    title: "A Special Glimpse",
    src: "/final-version.mp4",
    useTamilSong: false,
  },
];

const eventStart = new Date("2026-08-23T10:30:00+05:30");
const eventEnd = new Date("2026-08-23T13:30:00+05:30");

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [audioReady, setAudioReady] = useState(true);
  const [inviteUrl, setInviteUrl] = useState("");
  const [now, setNow] = useState(() => new Date());
  const activeVideo = videos[activeVideoIndex];
  const couple = `${invitation.groom} & ${invitation.bride}`;
  const primaryContact = invitation.contacts[0];
  const mapQuery = encodeURIComponent(
    `${invitation.venue}, ${invitation.address}`
  );
  const inviteShareMessage = `You are warmly invited to ${couple}'s engagement on ${invitation.date} at ${invitation.time}, ${invitation.venue}. ${inviteUrl}`;
  const shareText = encodeURIComponent(
    inviteShareMessage
  );
  const mapShareText = encodeURIComponent(
    `Venue location: ${invitation.venue}, ${invitation.address}. Map: https://www.google.com/maps/search/?api=1&query=${mapQuery}`
  );
  const whatsappMessage = encodeURIComponent(
    "Congratulations to Nandakumar & Anumitha on their engagement. Wishing them a lifetime of happiness and togetherness."
  );
  const countdown = useMemo(() => {
    const remaining = Math.max(0, eventStart.getTime() - now.getTime());
    const totalMinutes = Math.floor(remaining / 60000);

    return {
      days: Math.floor(totalMinutes / 1440),
      hours: Math.floor((totalMinutes % 1440) / 60),
      minutes: totalMinutes % 60,
    };
  }, [now]);
  const calendarUrl = useMemo(() => {
    const formatDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const details = encodeURIComponent(
      `Engagement ceremony of ${couple}. Venue: ${invitation.venue}, ${invitation.address}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${couple} Engagement Ceremony`
    )}&dates=${formatDate(eventStart)}/${formatDate(eventEnd)}&details=${details}&location=${encodeURIComponent(
      `${invitation.venue}, ${invitation.address}`
    )}`;
  }, [couple]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    setInviteUrl(window.location.href);

    return () => window.clearInterval(timer);
  }, []);

  const selectVideo = (index: number) => {
    videoRef.current?.pause();
    audioRef.current?.pause();
    setAudioReady(true);
    setActiveVideoIndex(index);
  };

  const showNextVideo = () => {
    selectVideo((activeVideoIndex + 1) % videos.length);
  };

  const showPreviousVideo = () => {
    selectVideo((activeVideoIndex - 1 + videos.length) % videos.length);
  };

  const syncSongToVideo = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) {
      return;
    }

    video.muted = activeVideo.useTamilSong;

    if (!activeVideo.useTamilSong) {
      audio.pause();
      return;
    }

    audio.currentTime = video.currentTime;
    try {
      await audio.play();
      setAudioReady(true);
    } catch {
      setAudioReady(false);
    }
  };

  return (
    <main>
      <div className="petalRain" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <section className="hero" aria-label="Engagement invitation">
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">Engagement Ceremony</p>
          <h1 className="coupleTitle">
            <span>
              <strong>{invitation.groom}</strong>
            </span>
            <em>&</em>
            <span>
              <strong>{invitation.bride}</strong>
            </span>
          </h1>
          <p className="intro">
            With the blessings of our families, we invite you to bless the
            beginning of their forever on {invitation.date} at{" "}
            <span className="nowrap">{invitation.time}.</span>
          </p>
          <p className="tamilLine">உங்கள் ஆசீர்வாதம் எங்கள் வாழ்வின் இனிய தொடக்கமாகும்</p>
          <div className="heroActions" aria-label="Invitation actions">
            <a className="primaryButton" href="#details">
              View Details
            </a>
            <a
              className="secondaryButton"
              href={`https://wa.me/?text=${whatsappMessage}`}
            >
              Send Wishes
            </a>
          </div>
        </div>
      </section>

      <section className="saveDateBand" aria-label="Save the date">
        <div className="saveDateCard">
          <span>Save the Date</span>
          <strong>{invitation.date}</strong>
          <p>
            {invitation.time} | {invitation.venue}
          </p>
        </div>
      </section>

      <section className="videoBand" aria-label="Engagement invitation video">
        <div className="videoContent">
          <p className="script">Invitation Films</p>
          <h2 className="videoHeading">{activeVideo.title}</h2>
          <div
            className={`videoFrame ${
              activeVideoIndex === 0 ? "firstVideoFrame" : "secondVideoFrame"
            }`}
          >
            <video
              key={activeVideo.src}
              ref={videoRef}
              controls
              muted={activeVideo.useTamilSong}
              playsInline
              preload="metadata"
              poster={
                activeVideoIndex === 0
                  ? "/engagement-video-poster-rings.png"
                  : "/second-video-poster.svg"
              }
              onPlay={() => {
                void syncSongToVideo();
              }}
              onPause={() => {
                audioRef.current?.pause();
              }}
              onEnded={() => {
                audioRef.current?.pause();
                if (activeVideoIndex < videos.length - 1) {
                  setActiveVideoIndex(activeVideoIndex + 1);
                }
              }}
              onSeeked={() => {
                if (activeVideo.useTamilSong && audioRef.current && videoRef.current) {
                  audioRef.current.currentTime = videoRef.current.currentTime;
                }
              }}
            >
              <source src={activeVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <audio ref={audioRef} src="/tamil-engagement-song.mp3" preload="auto" />
          </div>
          <div className="videoControls" aria-label="Video playlist controls">
            <button type="button" onClick={showPreviousVideo}>
              Previous
            </button>
            <div className="videoDots" aria-label="Choose video">
              {videos.map((videoItem, index) => (
                <button
                  key={videoItem.src}
                  type="button"
                  className={index === activeVideoIndex ? "activeDot" : ""}
                  aria-label={`Show ${videoItem.title}`}
                  onClick={() => selectVideo(index)}
                />
              ))}
            </div>
            <button type="button" onClick={showNextVideo}>
              Next
            </button>
          </div>
          {!audioReady && (
            <p className="audioNotice">
              Tap play again if your browser pauses the song.
            </p>
          )}
        </div>
      </section>

      <section className="countdownBand" aria-label="Countdown to engagement">
        <div className="countdownContent">
          <p className="script">The Auspicious Day Awaits</p>
          <div className="countdownGrid">
            <span>
              <strong>{countdown.days}</strong>
              Days
            </span>
            <span>
              <strong>{countdown.hours}</strong>
              Hours
            </span>
            <span>
              <strong>{countdown.minutes}</strong>
              Minutes
            </span>
          </div>
          <a className="calendarButton" href={calendarUrl}>
            Add to Calendar
          </a>
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
        <div className="venuePreview">
          <div>
            <span>Venue Location</span>
            <strong>{invitation.venue}, Mathur</strong>
            <p>{invitation.address}</p>
          </div>
          <a
            className="venueMapButton"
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          >
            Open Map
          </a>
        </div>
      </section>

      <section className="messageBand" aria-label="Invitation message">
        <div className="messageContent">
          <p className="script">Together with their families</p>
          <h2>Please join us for an evening of love, laughter, and blessings.</h2>
          <p>
            Your presence will make this celebration warmer and more memorable.
          </p>
          <p className="tamilBlessing">
            உங்கள் அன்பும் ஆசீர்வாதமும் எங்கள் விழாவை சிறப்பாக்கும்.
          </p>
          <div className="footerActions">
            <a
              className="primaryButton"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            >
              Open Map
            </a>
            <a className="secondaryButton" href={`https://wa.me/?text=${mapShareText}`}>
              Share Map Location
            </a>
          </div>
          <div className="rsvp contactCards">
            <span>Awaiting your presence</span>
            {invitation.contacts.map((contact) => (
              <div className="contactCard" key={contact.phone}>
                <strong>{contact.name}</strong>
                <p>{contact.phone}</p>
                <div>
                  <a href={`tel:+91${contact.phone.replace(/\D/g, "")}`}>
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      "Hello, I am contacting you regarding the engagement ceremony."
                    )}`}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <nav className="mobileQuickBar" aria-label="Quick actions">
        <a href={`https://wa.me/?text=${whatsappMessage}`}>
          Send Wishes
        </a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}>
          Map
        </a>
      </nav>
    </main>
  );
}
