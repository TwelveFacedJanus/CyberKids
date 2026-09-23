// src/pages/RobloxAuthPage.tsx
import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type CSSProperties,
} from "react";
import { Stack } from "@mui/material";
import Layout from "../components/Layout";
import { phishing } from "../api/client";
import IntroModal from "../components/IntroModal";
import PhishingReveal from "../components/PhishingReveal";
import { useNavigate } from "react-router-dom";

export default function RobloxAuthPage() {
  return (
    <Layout>
      <RobloxAuthInner />
    </Layout>
  );
}

function RobloxAuthInner() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const revealTimer = useRef<number | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const res = await phishing.submit({
        site: "roblox",
        fake_url: "roblox/com/auth",
        username,
        password,
      });
      setError(
        res.error || "Incorrect username or password. Please try again.",
      );

      if (revealTimer.current) window.clearTimeout(revealTimer.current);
      revealTimer.current = window.setTimeout(() => setShowReveal(true), 600);
    } catch {
      setError("Incorrect username or password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("roblox_intro_disabled")) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroDone = () => {
    setShowIntro(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem("roblox_intro_disabled", "1");
    setShowIntro(false);
  };

  const handleRevealClose = () => {
    setShowReveal(false);
    setUsername("");
    setPassword("");
    setError(null);
    navigate("/"); // на дашборд
  };

  return (
    <>
      <IntroModal
        open={showIntro}
        onClose={handleIntroDone}
        onDontShowAgain={handleDontShowAgain}
        title="Это симуляция Roblox"
        description="Перед тобой учебная копия настоящего сайта Roblox. Она создана, чтобы ты научился распознавать подделки."
        emoji="⚠️"
        confirmLabel="Я понял"
        accent="#E53935"
      >
        <Stack spacing={1.5}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>🚫</span>
            <span style={{ fontSize: 14, lineHeight: 1.6 }}>
              <b>Не вводи настоящие логин и пароль</b> — только выдуманные
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>🔍</span>
            <span style={{ fontSize: 14, lineHeight: 1.6 }}>
              Посмотри на <b>адрес сайта</b> — настоящий Roblox живёт на{" "}
              <code>roblox.com</code>, а не на <code>roblox/com</code>
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>💡</span>
            <span style={{ fontSize: 14, lineHeight: 1.6 }}>
              В конце ты увидишь, <b>что происходит с данными</b> на таких
              сайтах
            </span>
          </div>
        </Stack>
      </IntroModal>

      <PhishingReveal
        open={showReveal}
        username={username}
        password={password}
        onClose={handleRevealClose}
      />

      <div style={styles.page}>
        {/* ФОН — fixed, не скроллится */}
        <div style={styles.bg} />

        {/* ВЕРХНИЙ NAVBAR ROBLOX — fixed, не скроллится */}
        <header style={styles.topNav}>
          <div style={styles.topNavInner}>
            {/* 1. Логотип SVG */}
            <a
              style={styles.navLogo}
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Roblox Home"
            >
              <span
                style={{
                  display: "inline-block",
                  width: 175,
                  height: 26,
                  background: "#fff",
                  WebkitMask:
                    "url(/test-images/robloxheader.svg) no-repeat center / contain",
                  mask: "url(/test-images/robloxheader.svg) no-repeat center / contain",
                }}
              />
            </a>

            {/* 2-5. Меню */}
            <ul
              className="nav rbx-navbar hidden-xs hidden-sm col-md-5 col-lg-4"
              style={styles.navMenu}
            >
              <li style={styles.navItem}>
                <a
                  style={styles.navLink}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Charts
                </a>
              </li>
              <li style={styles.navItem}>
                <a
                  style={styles.navLink}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Marketplace
                </a>
              </li>
              <li style={styles.navItem}>
                <a
                  style={styles.navLink}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Create
                </a>
              </li>
              <li style={styles.navItem}>
                <a
                  style={styles.navLink}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Robux
                </a>
              </li>
            </ul>

            {/* 6. Search */}
            <div
              className="navbar-left navbar-search col-xs-5 col-sm-6 col-md-2 col-lg-3 shown"
              data-testid="navigation-search-input"
              style={styles.navSearchWrap}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={styles.navSearchIcon}
              >
                <path
                  d="M11.5 10.5L14.5 13.5M12.5 7.5C12.5 10.2614 10.2614 12.5 7.5 12.5C4.73858 12.5 2.5 10.2614 2.5 7.5C2.5 4.73858 4.73858 2.5 7.5 2.5C10.2614 2.5 12.5 4.73858 12.5 7.5Z"
                  stroke="#B8B8B8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                style={styles.navSearchInput}
                placeholder="Search"
                onFocus={(e) => e.currentTarget.blur()}
                readOnly
              />
            </div>

            {/* 7. Sign Up */}
            <button
              style={styles.navSignupBtn}
              onClick={() => alert("Service temporarily unavailable")}
              type="button"
            >
              Sign Up
            </button>
          </div>
        </header>

        {/* СПЕЙСЕР под fixed-хедер */}
        <div style={{ height: 36, flexShrink: 0 }} />

        {/* ПЕРВЫЙ ЭКРАН — ровно высота viewport, форма по центру */}
        <main style={styles.main}>
          <div style={styles.card}>
            <h1 style={styles.title}>Login to Roblox</h1>

            <form onSubmit={onSubmit} style={styles.form}>
              <div style={{ ...styles.field, marginBottom: 12 }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  style={styles.input}
                  required
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={busy}
                style={{
                  ...styles.button,
                  opacity: busy ? 0.6 : 1,
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                {busy ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div style={styles.forgotWrap}>
              <a
                href="#"
                onClick={() => alert("Service temporarily unavailable")}
                style={styles.forgotLink}
              >
                Forgot Password or Username?
              </a>
            </div>

            <div style={styles.divider} />

            <div style={styles.anotherAuth}>
              <button
                type="button"
                disabled={busy}
                onClick={() => alert("Service temporarily unavailable")}
                style={{
                  ...styles.anotherButton,
                  opacity: busy ? 0.6 : 1,
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                Email Me on a One-Time Code
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => alert("Service temporarily unavailable")}
                style={{
                  ...styles.anotherButton,
                  opacity: busy ? 0.6 : 1,
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                Quick Sign-in
              </button>
            </div>

            <div style={styles.signupBlock}>
              <span style={styles.signupText}>Don't have an account?</span>
              <a
                href="#"
                onClick={() => alert("Service temporarily unavailable")}
                style={styles.signupLink}
              >
                Sign Up
              </a>
            </div>
          </div>
        </main>

        {/* ФУТЕР — в потоке, появляется при скролле */}
        <footer style={styles.footer}>
          <div style={styles.footerInner}>
            <div style={styles.footerCol}>
              <a
                style={styles.footerLink}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                About Us
              </a>
              <a
                style={styles.footerLink}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Careers
              </a>
              <a
                style={styles.footerLink}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Blog
              </a>
            </div>
            <div style={styles.footerCol}>
              <a
                style={styles.footerLink}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Support
              </a>
              <a
                style={styles.footerLink}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Privacy
              </a>
              <a
                style={styles.footerLink}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Terms
              </a>
            </div>
            <div style={styles.footerCopy}>
              ©2026 Roblox Corporation. Roblox, the Roblox logo and Powering
              Imagination are among our registered and unregistered trademarks
              in the U.S. and other countries.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

const FONT_STACK = '"Builder Sans", sans-serif';

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#232527",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT_STACK,
    color: "#FFFFFF",
    position: "relative",
  },

  bg: {
    position: "fixed",
    inset: 0,
    backgroundImage: "url(/test-images/robloxbg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    zIndex: 0,
    pointerEvents: "none",
  },

  topNav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    background: "#191B1D",
    height: 36,
    display: "flex",
    alignItems: "center",
  },
  topNavInner: {
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingRight: 12,
    boxSizing: "border-box",
  },

  navLogo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    flexShrink: 0,
    margin: 0,
    padding: "0 12px",
    width: 175,
    maxWidth: 175,
    boxSizing: "border-box",
  },
  navLogoImg: {
    display: "block",
    width: "100%",
    height: "auto",
    color: "#fff",
    maxHeight: 24,
    objectFit: "contain",
    objectPosition: "left center",
  },

  navMenu: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    listStyle: "none",
    margin: 0,
    padding: 0,
    height: "100%",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    listStyle: "none",
  },
  navLink: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 500,
    textDecoration: "none",
    opacity: 0.9,
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: "0 12px",
    whiteSpace: "nowrap",
  },

  navSearchWrap: {
    background: "#121215",
    borderRadius: 8,
    float: "left",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 10px",
    height: 24,
    width: 220,
    flexShrink: 0,
    boxSizing: "border-box",
  },
  navSearchIcon: {
    flexShrink: 0,
  },
  navSearchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: FONT_STACK,
    minWidth: 0,
  },

  navSignupBtn: {
    marginRight: 12,
    float: "right",
    marginLeft: "auto",
    background: "#FFFFFF",
    color: "#191B1D",
    border: "none",
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    padding: "6px 14px",
    fontFamily: FONT_STACK,
    flexShrink: 0,
  },

  main: {
    position: "relative",
    zIndex: 1,
    height: "calc(100vh - 36px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 16px",
    boxSizing: "border-box",
    flexShrink: 0,
  },
  card: {
    width: "100%",
    maxWidth: 279,
    background: "#272930",
    color: "#fff",
    padding: "15px",
    boxSizing: "border-box",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    margin: "0",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: "5px 12px",
    fontSize: 12,
    border: "1px solid rgba(208, 217, 251,.12)",
    borderRadius: 8,
    outline: "none",
    background: "rgba(208, 217, 251,.08)",
    color: "#fff",
    boxSizing: "border-box",
    fontFamily: FONT_STACK,
  },
  error: {
    background: "#FDEBEB",
    color: "#C0392B",
    padding: "10px 12px",
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 500,
  },
  button: {
    margin: "6px 0 12px",
    width: "100%",
    padding: "6px",
    background: "transparent",
    color: "#f7f7f8",
    border: "1px solid #f7f7f8",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: FONT_STACK,
  },
  anotherButton: {
    marginTop: "6px",
    marginBottom: "3px",
    width: "100%",
    padding: "6px",
    background: "rgba(208, 217, 251,.12)",
    color: "#f7f7f8",
    borderRadius: 8,
    border: "none",
    fontSize: 12,
    fontFamily: FONT_STACK,
    fontWeight: 500,
  },
  forgotWrap: {
    margin: "6px 0 15px",
    textAlign: "center",
    color: "#f7f7f8",
  },
  forgotLink: {
    color: "#f7f7f8",
    fontSize: 12,
    textDecoration: "none",
    fontWeight: 600,
  },
  divider: {
    height: 1,
    background: "rgba(208, 217, 251,.12)",
    margin: "0 0 3px",
  },
  signupBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "16px 0 8px",
    gap: 6,
    fontSize: 12,
    color: "#f7f7f8",
  },
  signupText: {
    color: "#f7f7f8",
  },
  signupLink: {
    color: "#f7f7f8",
    textDecoration: "none",
    fontWeight: 600,
  },

  footer: {
    position: "relative",
    zIndex: 1,
    background: "#1B1D1F",
    borderTop: "1px solid #2A2C2E",
    padding: "24px 16px 32px",
    flexShrink: 0,
    width: "100%",
  },
  footerInner: {
    maxWidth: 1280,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: "0 24px",
  },
  footerCol: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },
  footerLink: {
    color: "#B8B8B8",
    fontSize: 13,
    textDecoration: "none",
  },
  footerCopy: {
    color: "#6E7275",
    fontSize: 11,
    lineHeight: 1.6,
    maxWidth: 720,
  },
};
