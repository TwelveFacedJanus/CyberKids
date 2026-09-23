// frontend/src/components/PhishingReveal.tsx
import { useEffect, useMemo, useState } from "react";

export interface PhishingRevealProps {
  open: boolean;
  username: string;
  password: string;
  onClose: () => void;
  onFinished?: () => void;
}

type Stage = "send" | "hijack" | "arrow" | "final";

export default function PhishingReveal({
  open,
  username,
  password,
  onClose,
  onFinished,
}: PhishingRevealProps) {
  const [stage, setStage] = useState<Stage>("send");
  const [arrowStep, setArrowStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStage("send");
    setArrowStep(0);

    const t1 = setTimeout(() => setStage("hijack"), 3500);
    const t2 = setTimeout(() => setStage("arrow"), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  useEffect(() => {
    if (stage !== "arrow") return;
    const delays = [0, 5000, 10000, 15000];
    const timers = delays.map((d, i) =>
      setTimeout(() => setArrowStep(i + 1), d),
    );
    const finish = setTimeout(() => {
      setStage("final");
      onFinished?.();
    }, 22000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [stage, onFinished]);

  if (!open) return null;

  const isFinal = stage === "final";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "auto",
        overflow: "hidden",
        fontFamily: '"Builder Sans", "Inter", sans-serif',
        animation: "screenFadeIn 0.7s ease both",
      }}
    >
      {/* Затемнение с blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(8, 8, 15, 0.82)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: "screenFadeIn 0.7s ease both",
        }}
      />

      {/* Красная пульсирующая рамка */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 120px 20px rgba(229, 57, 53, 0.55)",
          animation:
            "frameGlowIn 1.2s ease-out both, pulseFrame 2.4s ease-in-out 1.2s infinite",
          pointerEvents: "none",
        }}
      />

      {/* Заголовок сверху */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          zIndex: 3,
          padding: "0 20px",
        }}
      >
        <StageText stage={stage} />
      </div>

      {/* Центральная визуализация */}
      <DataFlight stage={stage} username={username} password={password} />

      {/* Стрелки-подсказки */}
      {stage === "arrow" && <ArrowOverlay step={arrowStep} />}

      {/* Финальная плашка */}
      {isFinal && <FinalPanel onClose={onClose} />}

      {/* Keyframes */}
      <style>{`
        @keyframes screenFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes frameGlowIn {
          0%   { box-shadow: inset 0 0 0 0 rgba(229,57,53,0); }
          100% { box-shadow: inset 0 0 120px 20px rgba(229,57,53,0.55); }
        }
        @keyframes pulseFrame {
          0%, 100% { box-shadow: inset 0 0 120px 20px rgba(229,57,53,0.55); }
          50%      { box-shadow: inset 0 0 180px 40px rgba(229,57,53,0.85); }
        }
        @keyframes stageEnter {
          0%   { opacity: 0; transform: translateY(24px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes subtitleFade {
          0%   { opacity: 0; letter-spacing: 0.45em; }
          100% { opacity: 0.75; letter-spacing: 0.25em; }
        }
        @keyframes dataFly {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(50vw - 40px), -50vh) scale(0.4) rotate(-12deg); opacity: 0; }
        }
        @keyframes envelope {
          0%, 100% { transform: translate(-50%, -50%) rotate(-4deg); }
          50%      { transform: translate(-50%, calc(-50% - 12px)) rotate(4deg); }
        }
        @keyframes moneyFall {
          0%   { transform: translateY(-20vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes arrowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%      { transform: translate(-50%, -50%) scale(1.35); }
        }
        @keyframes arrowDotIn {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          60%  { opacity: 1; transform: translate(-50%, -50%) scale(1.25); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes lineGrow {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 0.9; }
        }
        @keyframes lineGrowY {
          0%   { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 0.9; }
        }
        @keyframes labelIn {
          0%   { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes stampIn {
          0%   { transform: scale(3) rotate(-30deg); opacity: 0; }
          60%  { transform: scale(0.9) rotate(-12deg); opacity: 1; }
          100% { transform: scale(1) rotate(-12deg); opacity: 1; }
        }
        @keyframes finalPanelIn {
          0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hackerLogIn {
          0%   { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ============ ЗАГОЛОВОК СТАДИИ ============ */
function StageText({ stage }: { stage: Stage }) {
  const map: Record<Stage, { sub: string; title: string; key: string }> = {
    send: {
      sub: "Отправка данных...",
      title: "Ты ввёл данные...",
      key: "send",
    },
    hijack: {
      sub: "⚠ Данные перехвачены",
      title: "Они улетели мошеннику",
      key: "hijack",
    },
    arrow: {
      sub: "🔍 Что ты не заметил",
      title: "Вот на что стоило смотреть",
      key: "arrow",
    },
    final: { sub: "🎣 Фишинг", title: "Тебя обманули", key: "final" },
  };
  const cur = map[stage];

  return (
    <div
      key={cur.key}
      style={{
        animation: "stageEnter 0.7s cubic-bezier(0.34, 1.2, 0.64, 1) both",
      }}
    >
      <div
        style={{
          fontSize: 13,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: 0.75,
          marginBottom: 12,
          animation: "subtitleFade 0.9s ease both",
        }}
      >
        {cur.sub}
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          textShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        {cur.title}
      </h1>
    </div>
  );
}

/* ============ ВИЗУАЛИЗАЦИЯ ПОЛЁТА ДАННЫХ ============ */
function DataFlight({
  stage,
  username,
  password,
}: {
  stage: Stage;
  username: string;
  password: string;
}) {
  const maskedPassword = useMemo(() => password.replace(/./g, "•"), [password]);

  if (stage !== "send" && stage !== "hijack") return null;

  return (
    <>
      {/* Карточка с данными */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          background: "#272930",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "24px 32px",
          minWidth: 320,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          color: "#fff",
          zIndex: 2,
          animation:
            stage === "send"
              ? "stageEnter 0.7s ease both, envelope 3s ease-in-out 0.7s infinite"
              : "dataFly 1.4s cubic-bezier(0.6, 0, 0.75, 0) forwards",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#E53935",
            fontWeight: 700,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          📨 Твои данные
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>
              Username
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {username || "—"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>
              Password
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "monospace",
                letterSpacing: 1,
              }}
            >
              {maskedPassword || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Деньги */}
      {stage === "hijack" && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i * 41) % 100}%`,
                top: "-10%",
                fontSize: 20 + ((i * 7) % 14),
                animation: `moneyFall ${1.8 + (i % 5) * 0.35}s linear ${
                  (i % 8) * 0.12
                }s infinite`,
              }}
            >
              {["💸", "🪙", "💰", "🎮", "💎"][i % 5]}
            </div>
          ))}
        </div>
      )}

      {/* Логи сервера мошенника */}
      {stage === "hijack" && (
        <div
          style={{
            position: "absolute",
            top: 120,
            right: 60,
            background: "#0D0D14",
            border: "2px solid #E53935",
            borderRadius: 12,
            padding: "12px 18px",
            color: "#E53935",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 700,
            zIndex: 3,
            boxShadow: "0 0 60px rgba(229,57,53,0.6)",
          }}
        >
          <div
            style={{
              opacity: 0.6,
              marginBottom: 4,
              animation: "hackerLogIn 0.5s ease 0s both",
            }}
          >
            🖥 server: scam-node.ru
          </div>
          <div style={{ animation: "hackerLogIn 0.5s ease 0.4s both" }}>
            ✔ получено: {username}
          </div>
          <div style={{ animation: "hackerLogIn 0.5s ease 0.8s both" }}>
            ✔ получено: {maskedPassword}
          </div>
          <div
            style={{
              marginTop: 6,
              color: "#ff8a80",
              animation: "hackerLogIn 0.5s ease 1.2s both",
            }}
          >
            ⏳ кража аккаунта...
          </div>
        </div>
      )}
    </>
  );
}

/* ============ СТРЕЛКИ-ПОДСКАЗКИ ============ */
interface ArrowDef {
  x: number;
  y: number;
  text: string;
  from: "top" | "bottom" | "left" | "right";
}

const ARROWS: ArrowDef[] = [
  {
    x: 0.5,
    y: 0.06,
    text: "Настоящий Roblox — на roblox.com. А тут — roblox/com/auth",
    from: "top",
  },
  {
    x: 0.5,
    y: 0.5,
    text: "Тебя торопят и просят данные — это классический приём фишеров",
    from: "left",
  },
  {
    x: 0.86,
    y: 0.06,
    text: "Кнопка «Sign Up» и меню ведут в никуда — настоящий сайт бы работал",
    from: "right",
  },
  {
    x: 0.5,
    y: 0.95,
    text: "Ни одного реального контакта в футере — только заглушки",
    from: "bottom",
  },
];

function ArrowOverlay({ step }: { step: number }) {
  if (step === 0) return null;
  return (
    <>
      {ARROWS.slice(0, step).map((a, i) => (
        <Arrow key={i} def={a} index={i} />
      ))}
    </>
  );
}

function Arrow({ def, index }: { def: ArrowDef; index: number }) {
  const left = `${def.x * 100}%`;
  const top = `${def.y * 100}%`;

  const labelOffset = 20;
  let labelPos: React.CSSProperties = {};
  let lineStyle: React.CSSProperties = {};
  let dotPos: React.CSSProperties = {};
  let lineAnim = "lineGrow";

  switch (def.from) {
    case "top":
      labelPos = {
        left,
        top: `calc(${top} + ${labelOffset}px)`,
        transform: "translateX(-50%)",
      };
      lineStyle = {
        left,
        top: `calc(${top} - 8px)`,
        width: 2,
        height: 80,
        transform: "translateX(-50%)",
        transformOrigin: "top center",
      };
      dotPos = { left, top: `calc(${top} + 80px)` };
      lineAnim = "lineGrowY";
      break;
    case "bottom":
      labelPos = {
        left,
        top: `calc(${top} - ${labelOffset + 30}px)`,
        transform: "translateX(-50%)",
      };
      lineStyle = {
        left,
        top: `calc(${top} - 80px)`,
        width: 2,
        height: 80,
        transform: "translateX(-50%)",
        transformOrigin: "bottom center",
      };
      dotPos = { left, top: `calc(${top} - 80px)` };
      lineAnim = "lineGrowY";
      break;
    case "left":
      labelPos = {
        left: `calc(${left} + ${labelOffset}px)`,
        top: `calc(${top} - 40px)`,
      };
      lineStyle = {
        left: `calc(${left} - 60px)`,
        top,
        width: 60,
        height: 2,
        transformOrigin: "right center",
      };
      dotPos = { left: `calc(${left} - 60px)`, top };
      break;
    case "right":
      labelPos = {
        right: `calc(${(1 - def.x) * 100}% + ${labelOffset}px)`,
        top: `calc(${top} - 40px)`,
      };
      lineStyle = {
        left: `calc(${left} + 8px)`,
        top,
        width: 60,
        height: 2,
        transformOrigin: "left center",
      };
      dotPos = { left: `calc(${left} + 68px)`, top };
      break;
  }

  return (
    <>
      {/* Точка */}
      <div
        style={{
          position: "absolute",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#E53935",
          border: "3px solid #fff",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 0 8px rgba(229,57,53,0.35)",
          zIndex: 4,
          animation: `arrowDotIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0s both, arrowPulse 1.6s ease-in-out 0.5s infinite`,
          ...dotPos,
        }}
      />

      {/* Линия */}
      <div
        style={{
          position: "absolute",
          background: "#E53935",
          opacity: 0.9,
          zIndex: 4,
          animation: `${lineAnim} 0.5s ease 0.15s both`,
          ...lineStyle,
        }}
      />

      {/* Подпись */}
      <div
        style={{
          position: "absolute",
          background: "#0D0D14",
          border: "2px solid #E53935",
          borderRadius: 10,
          padding: "10px 16px",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          maxWidth: 320,
          boxShadow: "0 12px 40px rgba(229,57,53,0.5)",
          zIndex: 5,
          animation: `labelIn 0.5s ease 0.35s both`,
          ...labelPos,
        }}
      >
        {def.text}
      </div>
    </>
  );
}

/* ============ ФИНАЛЬНАЯ ПЛАШКА ============ */
function FinalPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 6,
        animation: "screenFadeIn 0.6s ease both",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          background: "#14141C",
          border: "2px solid #E53935",
          borderRadius: 24,
          padding: "40px 32px",
          color: "#fff",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          textAlign: "center",
          animation: "finalPanelIn 0.7s cubic-bezier(0.34, 1.2, 0.64, 1) both",
        }}
      >
        <div
          style={{
            fontSize: 72,
            marginBottom: 8,
            animation: "arrowPulse 2s ease-in-out infinite",
          }}
        >
          🎣
        </div>

        <div
          style={{
            display: "inline-block",
            border: "3px solid #E53935",
            color: "#E53935",
            padding: "6px 20px",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: "0.2em",
            marginBottom: 20,
            animation: "stampIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          ФИШИНГ
        </div>

        <h2
          style={{
            fontSize: 26,
            fontWeight: 900,
            margin: "0 0 12px",
            lineHeight: 1.25,
          }}
        >
          Твои данные улетели мошеннику
        </h2>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            opacity: 0.85,
            margin: "0 0 24px",
          }}
        >
          Настоящий Roblox никогда не попросит пароль на стороннем сайте. Всегда
          проверяй адрес, не спеши и{" "}
          <b>никогда не вводи данные по ссылке из чата</b>.
        </p>

        <button
          onClick={onClose}
          style={{
            background: "#fff",
            color: "#14141C",
            border: "none",
            borderRadius: 12,
            padding: "14px 40px",
            fontSize: 16,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          Я понял
        </button>
      </div>
    </div>
  );
}
