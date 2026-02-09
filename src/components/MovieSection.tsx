 "use client";

import { useRef, useState } from "react";
import { withBasePath } from "@/lib/paths";
import styles from "./MovieSection.module.css";
import shared from "./Shared.module.css";

export default function MovieSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section id="movie" className={shared.section}>
      <h2 className={shared.sectionTitle}>Movie</h2>
      <div className={`${shared.glassCard} ${styles.movieCard}`} data-scroll-anim>
        <div className={styles.moviePlayer}>
          <video
            ref={videoRef}
            className={styles.movieVideo}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
          >
          <source src={withBasePath("/videos/weryai_1770532067183.mp4")} type="video/mp4" />
          お使いのブラウザは動画タグに対応していません。
          </video>
          <button
            type="button"
            className={styles.movieSoundToggle}
            onClick={toggleMute}
            aria-pressed={!isMuted}
            aria-label={isMuted ? "ミュート解除" : "ミュート"}
            title={isMuted ? "ミュート解除" : "ミュート"}
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M4 9h3l4-3v12l-4-3H4z"
                  fill="currentColor"
                />
                <path
                  d="M15.5 8.5l5 5m0-5l-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M4 9h3l4-3v12l-4-3H4z"
                  fill="currentColor"
                />
                <path
                  d="M15 8c1.6 1.6 1.6 6.4 0 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M18 6c2.7 2.7 2.7 9.3 0 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
