import { useEffect, useRef, useState } from "react";
import "@/css/home/home.css";

const slides = [
  {
    title: "Proactive Uptime Monitoring",
    description:
      "Continuously monitors websites and APIs, detects outages in real time, measures response times, and ensures teams act before users experience downtime.",
    author: "Uptime Engine",
    image: "uptime-monitor.png",
  },
  {
    title: "Real-Time Incident Alerts",
    description:
      "Instant notifications via Email, Telegram, or SMS when services fail or recover, with retry logic and cooldowns to prevent alert fatigue.",
    author: "Alerting System",
    image: "incident-alerts.png",
  },
  {
    title: "SSL Certificate Monitoring",
    description:
      "Tracks SSL certificates, calculates expiry timelines, and sends proactive warnings to prevent security lapses and unexpected outages.",
    author: "SSL Monitor",
    image: "ssl-monitor.png",
  },
  {
    title: "Reporting & Historical Insights",
    description:
      "Detailed uptime analytics, incident timelines, and exportable reports give teams clarity and confidence in service reliability.",
    author: "Reporting Engine",
    image: "reports.png",
  },
];


const AUTO_DELAY = 7000;

function FeatureSlider() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  /* Auto-slide */
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTO_DELAY
    );
    return () => clearInterval(timer);
  }, []);

  /* Keyboard support */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setIndex((i) => (i + 1) % slides.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* Swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!startX.current) return;
    const delta = startX.current - e.changedTouches[0].clientX;
    if (delta > 60) setIndex((i) => (i + 1) % slides.length);
    if (delta < -60)
      setIndex((i) => (i - 1 + slides.length) % slides.length);
    startX.current = null;
  };

  return (
    <section className="feature-slider  container">
      <div
        className="slider-card"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="slider-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="slide image-slide"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="overlay">
                <div className="slide-content">
                  <h3>“{slide.title}”</h3>
                  <p>{slide.description}</p>
                  <span className="slide-author">{slide.author}</span>
                </div>

                {/* Internal navigation lines */}
                <div className="slide-controls">
                  {slides.map((_, idx) => (
                    <span
                      key={idx}
                      className={`line ${idx === index ? "active" : ""}`}
                      onClick={() => setIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSlider;
