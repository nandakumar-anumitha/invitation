"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const invitation = {
  groom: "V. Nandakumar",
  groomDegree: "B.E",
  bride: "CMA K. Anumitha",
  brideDegree: "B.COM",
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
    title: "Final version",
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
  const [copyStatus, setCopyStatus] = useState("Copy Link");
  const [now, setNow] = useState(() => new Date());
  const activeVideo = videos[activeVideoIndex];
  const couple = `${invitation.groom} ${invitation.groomDegree} & ${invitation.bride} ${invitation.brideDegree}`;
  const primaryContact = invitation.contacts[0];
  const whatsappMessage = encodeURIComponent(
    `Hello ${primaryContact.name}, I would like to RSVP for ${couple}'s engagement.`
  );
  const mapQuery = encodeURIComponent(
    `${invitation.venue}, ${invitation.address}`
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

  const copyInviteLink = async () => {
    if (typeof window === "undefined" || !navigator.clipboard) {
      setCopyStatus("Copy unavailable");
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopyStatus("Link Copied");
    window.setTimeout(() => setCopyStatus("Copy Link"), 2200);
  };

  return (
    <main>
      <section className="hero" aria-label="Engagement invitation">
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">Engagement Ceremony</p>
          <h1 className="coupleTitle">
            <span>
              <strong>
                {invitation.groom} <small>{invitation.groomDegree}</small>
              </strong>
            </span>
            <em>&</em>
            <span>
              <strong>
                {invitation.bride} <small>{invitation.brideDegree}</small>
              </strong>
            </span>
          </h1>
          <p className="intro">
            With joy in our hearts, we invite you to bless the beginning of
            their forever on {invitation.date} at{" "}
            <span className="nowrap">{invitation.time}.</span>
          </p>
          <div className="heroActions" aria-label="Invitation actions">
            <a className="primaryButton" href="#details">
              View Details
            </a>
            <a
              className="secondaryButton"
              href={`https://wa.me/91${primaryContact.phone.replace(/\D/g, "")}?text=${whatsappMessage}`}
            >
              RSVP
            </a>
          </div>
        </div>
      </section>

      <section className="videoBand" aria-label="Engagement invitation video">
        <div className="videoContent">
          <p className="script">{activeVideo.title}</p>
          <div className="videoFrame">
            <video
              key={activeVideo.src}
              ref={videoRef}
              controls
              muted={activeVideo.useTamilSong}
              playsInline
              preload="metadata"
              poster="/engagement-hero.png"
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
            <span>
              {activeVideoIndex + 1} / {videos.length}
            </span>
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
          <p className="script">Counting down</p>
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
                void copyInviteLink();
              }}
            >
              {copyStatus}
            </button>
          </div>
          <div className="rsvp">
            <span>Contact</span>
            {invitation.contacts.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:+91${contact.phone.replace(/\D/g, "")}`}
              >
                {contact.name} - {contact.phone}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
