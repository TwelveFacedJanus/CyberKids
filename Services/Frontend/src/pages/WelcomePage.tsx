// src/pages/WelcomePage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Layout from "../components/Layout";

/* ───────────── анимации ───────────── */
const popIn = keyframes`
  0% { transform: scale(0) rotate(-30deg); opacity: 0 }
  60% { transform: scale(1.12) rotate(5deg); opacity: 1 }
  100% { transform: scale(1) rotate(0) }`;
const slideUp = keyframes`
  0% { transform: translateY(30px); opacity: 0 }
  100% { transform: translateY(0); opacity: 1 }`;
const floatA = keyframes`0%,100%{transform:translate(0,0)}50%{transform:translate(40px,30px)}`;
const floatB = keyframes`0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,-30px)}`;
const spin = keyframes`to { transform: rotate(360deg) }`;
const wave = keyframes`to { transform: translateX(-100px) }`;
const rise = keyframes`
  0% { transform: translateY(0) scale(.6); opacity: 0 }
  20% { opacity: .9 }
  100% { transform: translateY(-70px) scale(1.1); opacity: 0 }`;
const bob = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}`;
const glow = keyframes`0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.9;transform:scale(1.08)}`;
const shimmer = keyframes`to { background-position: 200% center }`;
const ring = keyframes`0%{transform:scale(1);opacity:.55}100%{transform:scale(1.35);opacity:0}`;
const shine = keyframes`0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(260%) skewX(-20deg)}`;
const launch = keyframes`
  0% { transform: translate(0,0) scale(1); opacity: 1 }
  100% { transform: translate(140px,-220px) scale(1.4); opacity: 0 }`;
const burst = keyframes`
  0% { transform: translate(0,0) rotate(0) scale(1); opacity: 1 }
  100% { transform: translate(var(--dx), var(--dy)) rotate(260deg) scale(.4); opacity: 0 }`;
const dotPulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.25)}`;

const rm = {
  "@media (prefers-reduced-motion: reduce)": { animation: "none !important" },
};

/* ───────────── данные оформления ───────────── */
const THREATS = ["🎣", "🔑", "💳", "🕵️", "🔗", "📱"];
const PARTICLES = [
  { x: "8%", y: "18%", s: 10, c: "#7C4DFF", d: 0 },
  { x: "90%", y: "14%", s: 14, c: "#EC407A", d: 1.2 },
  { x: "16%", y: "72%", s: 12, c: "#FFCA28", d: 2.1 },
  { x: "82%", y: "66%", s: 9, c: "#7C4DFF", d: 0.6 },
  { x: "50%", y: "6%", s: 8, c: "#EC407A", d: 1.8 },
  { x: "70%", y: "88%", s: 13, c: "#FFCA28", d: 2.6 },
  { x: "30%", y: "40%", s: 7, c: "#7C4DFF", d: 3.1 },
  { x: "94%", y: "42%", s: 8, c: "#FFCA28", d: 0.9 },
];
const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2;
  const r = 110 + (i % 3) * 45;
  return {
    dx: `${Math.round(Math.cos(a) * r)}px`,
    dy: `${Math.round(Math.sin(a) * r)}px`,
    c: ["#7C4DFF", "#EC407A", "#FFCA28", "#26C6DA"][i % 4],
    round: i % 2 === 0,
  };
});
const HERO_SIZES = [
  "clamp(170px, 28vh, 260px)",
  "clamp(130px, 20vh, 190px)",
  "clamp(110px, 17vh, 160px)",
];

/* ───────────── колба ───────────── */
const FLASK =
  "M84 12 V92 L28 190 Q18 212 40 222 H160 Q182 212 172 190 L116 92 V12 Z";

function Flask() {
  return (
    <Box
      component="svg"
      viewBox="0 0 200 240"
      sx={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        animation: `${bob} 5s ease-in-out infinite`,
        ...rm,
      }}
      aria-hidden
    >
      <defs>
        <clipPath id="flaskClip">
          <path d={FLASK} />
        </clipPath>
        <linearGradient id="liq" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C4DFF" />
          <stop offset="0.6" stopColor="#EC407A" />
          <stop offset="1" stopColor="#FFCA28" />
        </linearGradient>
      </defs>
      <path d={FLASK} fill="rgba(255,255,255,.55)" />
      <g clipPath="url(#flaskClip)">
        <g style={{ animation: `${wave} 3.2s linear infinite` }}>
          <path
            opacity=".55"
            fill="url(#liq)"
            d="M0 138 Q25 126 50 138 T100 138 T150 138 T200 138 T250 138 T300 138 V260 H0 Z"
          />
        </g>
        <g style={{ animation: `${wave} 2.2s linear infinite` }}>
          <path
            fill="url(#liq)"
            d="M0 150 Q25 140 50 150 T100 150 T150 150 T200 150 T250 150 T300 150 V260 H0 Z"
          />
        </g>
        {[
          [70, 205, 0],
          [105, 190, 0.8],
          [135, 210, 1.5],
          [90, 175, 2.2],
          [120, 180, 0.4],
        ].map(([x, y, d], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4 + (i % 3)}
            fill="#fff"
            fillOpacity=".7"
            style={{ animation: `${rise} 2.6s ${d}s ease-in infinite` }}
          />
        ))}
      </g>
      <path
        d={FLASK}
        fill="none"
        stroke="#1A1A2E"
        strokeOpacity=".85"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M76 12 H124"
        stroke="#1A1A2E"
        strokeOpacity=".85"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M96 30 V88"
        stroke="#fff"
        strokeOpacity=".8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={96 + i * 8}
          cy="8"
          r={4 - i * 0.6}
          fill={["#7C4DFF", "#EC407A", "#FFCA28"][i]}
          style={{ animation: `${rise} 2.4s ${i * 0.7}s ease-out infinite` }}
        />
      ))}
    </Box>
  );
}

function Hero({ step }: { step: number }) {
  const size = HERO_SIZES[Math.min(step, 2)];
  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        my: 3,
        transition:
          "width .9s cubic-bezier(.4,0,.2,1), height .9s cubic-bezier(.4,0,.2,1)",
        animation: `${popIn} .9s cubic-bezier(.34,1.4,.64,1) both`,
        ...rm,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "-20%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,77,255,.4), rgba(236,64,122,.18) 55%, transparent 72%)",
          animation: `${glow} 4s ease-in-out infinite`,
          ...rm,
        }}
      />
      {/* орбита угроз */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          animation: `${spin} 30s linear infinite`,
          ...rm,
        }}
      >
        {THREATS.map((t, i) => {
          const a = (360 / THREATS.length) * i;
          const counter = keyframes`from{transform:rotate(${-a}deg)}to{transform:rotate(${-a - 360}deg)}`;
          return (
            <Box
              key={t}
              sx={{
                position: "absolute",
                inset: 0,
                transform: `rotate(${a}deg)`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "-12%",
                  left: "50%",
                  ml: "-0.7em",
                  fontSize: "clamp(20px, 3.4vh, 32px)",
                  lineHeight: 1,
                  display: "inline-block",
                  animation: `${counter} 30s linear infinite`,
                  filter: "drop-shadow(0 6px 10px rgba(26,26,46,.25))",
                  ...rm,
                }}
              >
                {t}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: "6% 14% 0",
          filter: "drop-shadow(0 18px 30px rgba(124,77,255,.35))",
        }}
      >
        <Flask />
      </Box>
    </Box>
  );
}

/* ───────────── страница ───────────── */
export default function WelcomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [launching, setLaunching] = useState(false);
  const timer = useRef<number>();

  // Автоматический переход между экранами
  useEffect(() => {
    if (step >= 2) return;
    const t = setTimeout(() => setStep((s) => s + 1), 4000);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const start = () => {
    if (launching) return;
    setLaunching(true);
    timer.current = window.setTimeout(() => navigate("/blocks"), 850);
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          px: 3,
          py: 4,
          background:
            "linear-gradient(160deg, #F7F3FF 0%, #FFF3F8 55%, #FFF9E6 100%)",
        }}
      >
        {/* лабораторная «миллиметровка» */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(rgba(124,77,255,.18) 1.3px, transparent 1.3px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at center, #000 30%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, #000 30%, transparent 78%)",
          }}
        />

        {/* блобы */}
        <Box
          sx={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            top: "-20%",
            left: "-15%",
            background:
              "radial-gradient(circle, rgba(124,77,255,0.35) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            animation: `${floatA} 12s ease-in-out infinite`,
            ...rm,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            bottom: "-20%",
            right: "-15%",
            background:
              "radial-gradient(circle, rgba(236,64,122,0.35) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            animation: `${floatB} 14s ease-in-out infinite`,
            ...rm,
          }}
        />

        {/* частицы */}
        {PARTICLES.map((p, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              borderRadius: i % 2 ? "3px" : "50%",
              bgcolor: p.c,
              opacity: 0.5,
              pointerEvents: "none",
              animation: `${bob} ${5 + (i % 3)}s ${p.d}s ease-in-out infinite`,
              ...rm,
            }}
          />
        ))}

        <Stack
          spacing={3.5}
          alignItems="center"
          sx={{
            maxWidth: 900,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Экран 1 — заставка */}
          <Hero step={step} />

          <Typography
            variant="h2"
            fontWeight={900}
            sx={{
              fontSize: { xs: 28, sm: 40, md: 52 },
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              background:
                "linear-gradient(135deg, #7C4DFF 0%, #EC407A 45%, #FFCA28 80%, #7C4DFF 100%)",
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `${slideUp} .7s ease .2s both, ${shimmer} 7s linear 1s infinite`,
              ...rm,
            }}
          >
            Добро пожаловать в «Лабораторию цифровой безопасности»!
          </Typography>

          {/* Экран 2 — суть */}
          {step >= 1 && (
            <Stack
              spacing={2}
              sx={{
                p: { xs: 2.5, md: 4 },
                borderRadius: "28px",
                position: "relative",
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,.66)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1.5px solid rgba(255,255,255,.9)",
                boxShadow: "0 24px 60px rgba(124,77,255,.18)",
                animation: `${slideUp} .7s ease both`,
                ...rm,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 6,
                  background:
                    "linear-gradient(180deg, #7C4DFF, #EC407A, #FFCA28)",
                },
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "#1A1A2E", lineHeight: 1.5 }}
              >
                Сегодня тебе предстоит занятие на{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#7C4DFF",
                    fontWeight: 800,
                    background:
                      "linear-gradient(transparent 62%, rgba(124,77,255,.2) 0)",
                    px: 0.5,
                  }}
                >
                  «Тренажёре цифровых угроз»
                </Box>
                .
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: 18,
                  lineHeight: 1.7,
                  maxWidth: 700,
                }}
              >
                Перед тобой появятся задания, благодаря которым ты научишься
                выявлять мошеннические схемы.
              </Typography>
            </Stack>
          )}

          {/* Экран 3 — призыв */}
          {step >= 2 && (
            <Stack
              spacing={3}
              alignItems="center"
              sx={{ animation: `${slideUp} .7s ease both`, mt: 2, ...rm }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: "#1A1A2E" }}
              >
                Ну что, ты готов? Тогда жми на старт!
              </Typography>

              <Box sx={{ position: "relative" }}>
                {!launching && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "20px",
                      border: "3px solid #7C4DFF",
                      pointerEvents: "none",
                      animation: `${ring} 1.8s ease-out infinite`,
                      ...rm,
                    }}
                  />
                )}
                <Button
                  variant="contained"
                  size="large"
                  onClick={start}
                  startIcon={
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        animation: launching
                          ? `${launch} .8s ease-in forwards`
                          : `${bob} 1.6s ease-in-out infinite`,
                        ...rm,
                      }}
                    >
                      <RocketLaunchIcon />
                    </Box>
                  }
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    py: 2.5,
                    px: { xs: 5, sm: 8 },
                    fontSize: 22,
                    fontWeight: 900,
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
                    boxShadow: "0 12px 40px rgba(124,77,255,0.45)",
                    transition: "all .25s ease",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      width: "30%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)",
                      animation: `${shine} 3.2s ease-in-out infinite`,
                      ...rm,
                    },
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.03)",
                      boxShadow: "0 20px 60px rgba(124,77,255,0.6)",
                      background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
                    },
                    "&:active": { transform: "translateY(-2px) scale(1.01)" },
                    "&:focus-visible": {
                      outline: "3px solid #FFCA28",
                      outlineOffset: 3,
                    },
                  }}
                >
                  Старт
                </Button>
                {launching && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      pointerEvents: "none",
                    }}
                  >
                    {CONFETTI.map((p, i) => (
                      <Box
                        key={i}
                        sx={{
                          position: "absolute",
                          width: 10,
                          height: p.round ? 10 : 6,
                          borderRadius: p.round ? "50%" : "2px",
                          bgcolor: p.c,
                          "--dx": p.dx,
                          "--dy": p.dy,
                          animation: `${burst} .9s cubic-bezier(.2,.8,.3,1) forwards`,
                          ...rm,
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Stack>
          )}

          {/* индикатор экранов */}
          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                component="button"
                aria-label={`Экран ${i + 1}`}
                disabled={i <= step}
                onClick={() => setStep(i)}
                sx={{
                  p: 0,
                  border: 0,
                  height: 8,
                  borderRadius: 4,
                  cursor: i > step ? "pointer" : "default",
                  width: i === step ? 28 : 8,
                  bgcolor: i <= step ? "#7C4DFF" : "rgba(124,77,255,.25)",
                  transition: "all .4s",
                  animation:
                    i === step
                      ? `${dotPulse} 2s ease-in-out infinite`
                      : undefined,
                  ...rm,
                  "&:focus-visible": {
                    outline: "2px solid #7C4DFF",
                    outlineOffset: 3,
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
}
