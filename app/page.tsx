"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import styles from "./page.module.css";

const PROFILE = {
  name: "Janiellito Miguel Dumagpi",
  nickname: "Miguel",
  photo: "/miguel-profile.jfif",
  // Replace this placeholder with Miguel's real mobile number before publishing.
  phone: "+10000000000",
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle className={styles.iconFill} cx="17.5" cy="6.6" r="1" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className={styles.iconFill}
        d="M14.2 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8.4v3h2.7v8h3.1Z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className={styles.iconFill}
        d="M19.6 5.4A18.4 18.4 0 0 0 15 4l-.6 1.2a17 17 0 0 0-4.8 0L9 4a18.4 18.4 0 0 0-4.6 1.4C1.5 9.7.7 14 .9 18.2a18.6 18.6 0 0 0 5.7 2.9l1.2-2a12 12 0 0 1-1.9-.9l.5-.4a13.2 13.2 0 0 0 11.2 0l.5.4a12 12 0 0 1-1.9.9l1.2 2a18.6 18.6 0 0 0 5.7-2.9c.3-4.9-.9-9.2-3.5-12.8ZM8.8 14.9c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Zm6.4 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Z"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V4m-5 5 5-5 5 5" />
      <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.7-.9L4 20l1.4-4.1a7.5 7.5 0 1 1 14.6-4.4Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    detail: "@lito.wav",
    href: "https://www.instagram.com/lito.wav?srtk=MTNzbGlya2x4NDJkaQ==",
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    detail: "Janiellito Miguel Dumagpi",
    href: "https://www.facebook.com/share/1J5uuRT7H5/",
    Icon: FacebookIcon,
  },
];

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export default function NfcDumagpiPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState("");
  const [showMobileConnect, setShowMobileConnect] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        setProgress(100);
        setLoading(false);
      }, 120);
      return () => window.clearTimeout(timer);
    }

    const startedAt = performance.now();
    const duration = 1050;
    let hideTimer: number | null = null;
    const frame = window.setInterval(() => {
      const value = Math.min(
        100,
        Math.round(((performance.now() - startedAt) / duration) * 100),
      );
      setProgress(value);
      if (value === 100) {
        window.clearInterval(frame);
        hideTimer = window.setTimeout(() => setLoading(false), 180);
      }
    }, 20);
    return () => {
      window.clearInterval(frame);
      if (hideTimer !== null) window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(
        window.scrollY / Math.max(scrollableHeight, 1),
        1,
      );
      page.style.setProperty("--scroll-progress", progress.toString());
      page.querySelectorAll<HTMLElement>("[data-scroll-panel]").forEach((panel) => {
        const bounds = panel.getBoundingClientRect();
        const panelProgress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight - bounds.top) /
              (window.innerHeight + bounds.height),
          ),
        );
        panel.style.setProperty("--panel-progress", panelProgress.toString());
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    const reveals = page.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            styles.visible,
            entry.isIntersecting,
          );
        });
      },
      { rootMargin: "0px" },
    );

    reveals.forEach((element) => observer.observe(element));
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const mobileConnectTargets = [
      page.querySelector("#connect"),
      page.querySelector("aside"),
      page.querySelector('[aria-labelledby="invite-title"]'),
    ].filter((target): target is Element => target !== null);
    const visibleMobileConnectTargets = new Set<Element>();
    const mobileConnectObserver = mobileConnectTargets.length > 0
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                visibleMobileConnectTargets.add(entry.target);
              } else {
                visibleMobileConnectTargets.delete(entry.target);
              }
            });
            setShowMobileConnect(visibleMobileConnectTargets.size === 0);
          },
          { threshold: 0.18 },
        )
      : null;
    if (mobileConnectObserver) {
      mobileConnectTargets.forEach((target) =>
        mobileConnectObserver.observe(target),
      );
    }

    return () => {
      observer.disconnect();
      mobileConnectObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      page.style.removeProperty("--scroll-progress");
    };
  }, []);

  function tiltPortrait(event: MouseEvent<HTMLDivElement>) {
    const portrait = portraitRef.current;
    if (
      !portrait ||
      window.innerWidth < 701 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const bounds = portrait.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.setProperty("--pointer-x", `${(x + 0.5) * 100}%`);
    portrait.style.setProperty("--pointer-y", `${(y + 0.5) * 100}%`);
    portrait.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  }

  function resetPortraitTilt() {
    if (portraitRef.current) {
      portraitRef.current.style.removeProperty("--pointer-x");
      portraitRef.current.style.removeProperty("--pointer-y");
      portraitRef.current.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg)";
    }
  }

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText("yoeekkaa");
      setToast("Discord username copied");
    } catch {
      setToast("Copy unavailable — Discord: yoeekkaa");
    }
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }

  function saveContact() {
    const contact = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Dumagpi;Janiellito Miguel;;;",
      `FN:${escapeVCard(PROFILE.name)}`,
      "TITLE:Visual Storyteller",
      `TEL;TYPE=CELL:${PROFILE.phone}`,
      "END:VCARD",
    ].join("\r\n");
    const file = new Blob([contact], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "janiellito-miguel-dumagpi.vcf";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <div
        className={`${styles.loader} ${loading ? "" : styles.loaded}`}
        role="status"
        aria-label="Loading profile"
      >
        <span className={styles.loaderMark}>M</span>
        <div
          className={styles.loaderTrack}
          role="progressbar"
          aria-label="Loading profile"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span aria-hidden="true" style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.loaderProgress} aria-hidden="true">
          {progress}%
        </span>
      </div>

      <main
        className={`${styles.page} ${loading ? "" : styles.pageReady}`}
        id="top"
      >
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.ambient} aria-hidden="true" />
        <div className={`${styles.orb} ${styles.orbOne}`} aria-hidden="true" />
        <div className={`${styles.orb} ${styles.orbTwo}`} aria-hidden="true" />
        <div
          className={`${styles.shell} ${styles.motionReady}`}
          ref={pageRef}
        >
          <div className={styles.scrollProgress} aria-hidden="true">
            <span />
          </div>
          <header
            className={`${styles.header} ${styles.reveal}`}
            data-reveal
          >
            <a className={styles.wordmark} href="#top">
              Miguel
            </a>
            <span className={styles.liveStatus}>
              <i aria-hidden="true" />
              Live
            </span>
          </header>

          <section
            className={styles.hero}
            aria-labelledby="hero-title"
            data-scroll-panel
          >
            <div className={`${styles.artStage} ${styles.enter}`}>
              <div className={styles.character} aria-hidden="true">
                <Image
                  src="/tokyo-ghoul-character.png"
                  alt=""
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 520px) 112vw, 460px"
                  className={styles.characterImage}
                />
              </div>
              <div
                className={styles.portraitFrame}
                ref={portraitRef}
                onMouseMove={tiltPortrait}
                onMouseLeave={resetPortraitTilt}
              >
                <Image
                  src={PROFILE.photo}
                  alt={`Portrait of ${PROFILE.name}`}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 520px) 220px, 250px"
                  className={styles.portraitImage}
                />
                <span className={styles.portraitLight} aria-hidden="true" />
              </div>
            </div>

            <div className={styles.intro}>
              <p className={`${styles.eyebrow} ${styles.enterDelay1}`}>
                TAP. CONNECT. SHARE.
              </p>
              <h1 className={`${styles.headline} ${styles.enterDelay2}`} id="hero-title">
                Say hello to <em>Miguel.</em>
              </h1>
              <p className={`${styles.bio} ${styles.enterDelay3}`}>
                Visual storyteller. Creative mind. Let’s connect.
              </p>
              <div className={`${styles.actions} ${styles.enterDelay4}`}>
                <button className={styles.saveButton} onClick={saveContact} type="button">
                  <ContactIcon />
                  Save contact
                </button>
                <a className={styles.messageButton} href="#connect">
                  <MessageIcon />
                  Message
                </a>
              </div>
            </div>
          </section>

          <section
            className={styles.connections}
            id="connect"
            data-scroll-panel
            aria-labelledby="connect-title"
          >
            <div className={styles.sectionHeading}>
              <span className={styles.sectionRule} aria-hidden="true" />
              <h2 id="connect-title">
                Let’s keep <em>in touch.</em>
              </h2>
            </div>
            <div className={styles.tiles}>
              {SOCIAL_LINKS.map(({ name, detail, href, Icon }, index) => (
                <a
                  className={`${styles.tile} ${styles.reveal}`}
                  href={href}
                  key={name}
                  data-reveal
                  data-reveal-stagger={index + 1}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.tileIcon}>
                    <Icon />
                  </span>
                  <span className={styles.tileInfo}>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </span>
                  <span className={styles.tileArrow}>
                    <ArrowIcon />
                  </span>
                </a>
              ))}
              <button
                className={`${styles.tile} ${styles.discordTile} ${styles.reveal}`}
                data-reveal
                data-reveal-stagger={3}
                onClick={copyDiscord}
                type="button"
              >
                <span className={styles.tileIcon}>
                  <DiscordIcon />
                </span>
                <span className={styles.tileInfo}>
                  <strong>Discord</strong>
                  <span>yoeekkaa · tap to copy</span>
                </span>
                <span className={styles.tileArrow}>
                  <ArrowIcon />
                </span>
              </button>
            </div>
          </section>

          <aside
            className={`${styles.quote} ${styles.reveal}`}
            data-reveal
            data-scroll-panel
          >
            <span className={styles.quoteMark} aria-hidden="true">
              “
            </span>
            <p>
              “Live free, or die trying.
              <br />
              <em>Life is the only thing worth the risk.</em>”
            </p>
          </aside>

          <section
            className={`${styles.footerInvite} ${styles.reveal}`}
            data-reveal
            aria-labelledby="invite-title"
          >
            <p className={styles.eyebrow}>STAY CONNECTED</p>
            <h2 id="invite-title">
              Your next hello is <em>one tap away.</em>
            </h2>
            <a href="#connect">
              Find Miguel online
              <ArrowIcon />
            </a>
          </section>

          <footer className={`${styles.footer} ${styles.reveal}`} data-reveal>
            <a href="#top">Back to top ↑</a>
            <span>
              Made with <strong>Miguel</strong>
            </span>
          </footer>
        </div>

        <a
          className={`${styles.mobileConnect} ${
            showMobileConnect ? "" : styles.mobileConnectHidden
          }`}
          href="#connect"
        >
          <span className={styles.mobileConnectDot} aria-hidden="true" />
          Tap to connect
          <span className={styles.mobileConnectArrow} aria-hidden="true">
            <ArrowIcon />
          </span>
        </a>

        <div className={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      </main>
    </>
  );
}
