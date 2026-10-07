import { useEffect, useMemo, useState } from "react";

export interface PhishingRevealProps {
  open: boolean;
  username: string;
  password: string;
  onClose: () => void;
  onFinished?: () => void;
}

type RevealStage = "send" | "hijack" | "inspect" | "final";

const colors = {
  ink: "#203238",
  muted: "#62737A",
  cream: "#FFF8EC",
  orange: "#F45B35",
  yellow: "#FFD447",
  mint: "#11BFA4",
  cyan: "#48BFE3",
  red: "#D94726",
};

const signs = [
  {
    number: "01",
    icon: "🌐",
    title: "Неправильный адрес",
    text: "Настоящий Roblox живёт на roblox.com. В этой копии адрес написан иначе.",
    color: colors.orange,
  },
  {
    number: "02",
    icon: "🔑",
    title: "Просят пароль",
    text: "Поддельная страница пытается получить данные, которые нельзя отдавать по чужой ссылке.",
    color: colors.yellow,
  },
  {
    number: "03",
    icon: "🧩",
    title: "Всё выглядит знакомо",
    text: "Логотип и кнопки можно скопировать. Внешний вид ещё не доказывает, что сайт настоящий.",
    color: colors.mint,
  },
  {
    number: "04",
    icon: "📤",
    title: "Данные уходят",
    text: "После нажатия Log In введённые данные отправляются владельцу подделки.",
    color: colors.cyan,
  },
];

const keyframes = `
  @keyframes revealIn {
    from { opacity: 0; transform: translateY(24px) scale(.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes revealInRight {
    from { opacity: 0; transform: translateX(42px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes dataPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 18px 50px rgba(244,91,53,.18); }
    50% { transform: scale(1.025); box-shadow: 0 24px 70px rgba(244,91,53,.32); }
  }
  @keyframes routeDash {
    to { stroke-dashoffset: -180; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: .3; transform: scale(1); }
    50% { opacity: .65; transform: scale(1.08); }
  }
  @keyframes finalIn {
    from { opacity: 0; transform: translateY(30px) scale(.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

export default function PhishingReveal({
  open,
  username,
  password,
  onClose,
  onFinished,
}: PhishingRevealProps) {
  const [stage, setStage] = useState<RevealStage>("send");
  const [activeSign, setActiveSign] = useState(0);
  const maskedPassword = useMemo(() => password.replace(/./g, "•"), [password]);

  useEffect(() => {
    if (!open) return;
    setStage("send");
    setActiveSign(0);

    const hijackTimer = window.setTimeout(() => setStage("hijack"), 10000);
    const inspectTimer = window.setTimeout(() => setStage("inspect"), 22500);
    const finalTimer = window.setTimeout(() => {
      setStage("final");
      onFinished?.();
    }, 57000);

    return () => {
      window.clearTimeout(hijackTimer);
      window.clearTimeout(inspectTimer);
      window.clearTimeout(finalTimer);
    };
  }, [open, onFinished]);

  useEffect(() => {
    if (stage !== "inspect") return;
    const timer = window.setInterval(() => {
      setActiveSign((current) =>
        current < signs.length - 1 ? current + 1 : current,
      );
    }, 6000);
    return () => window.clearInterval(timer);
  }, [stage]);

  if (!open) return null;

  return (
    <div style={styles.root}>
      <style>{keyframes}</style>
      <div style={styles.backdrop} />
      <div
        style={{
          ...styles.colorWash,
          background:
            stage === "final" ? "rgba(17,191,164,.1)" : "rgba(244,91,53,.1)",
        }}
      />

      {stage === "final" ? (
        <FinalPanel onClose={onClose} />
      ) : (
        <main style={styles.shell}>
          <header style={styles.header}>
            <div style={styles.eyebrow}>
              <span
                style={{
                  ...styles.liveDot,
                  background: stage === "hijack" ? colors.red : colors.orange,
                }}
              />
              УЧЕБНАЯ СИМУЛЯЦИЯ · РАЗБОР СИТУАЦИИ
            </div>
            <div style={styles.stageTitle}>
              {stage === "send" && "Смотрим, что происходит с данными"}
              {stage === "hijack" && "Данные покинули страницу"}
              {stage === "inspect" && "Разбираем подделку по признакам"}
            </div>
            <div style={styles.stageHint}>
              {stage === "send" &&
                "Ты нажал Log In — запусти анимацию и следи за маршрутом."}
              {stage === "hijack" &&
                "Теперь видно, почему нельзя вводить настоящие данные."}
              {stage === "inspect" &&
                `Признак ${activeSign + 1} из ${signs.length}`}
            </div>
          </header>

          {stage === "send" && (
            <SendScene username={username} password={maskedPassword} />
          )}
          {stage === "hijack" && (
            <HijackScene username={username} password={maskedPassword} />
          )}
          {stage === "inspect" && (
            <InspectScene activeSign={activeSign} onSelect={setActiveSign} />
          )}
        </main>
      )}
    </div>
  );
}

function SendScene({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return (
    <section style={styles.scene}>
      <div
        style={{
          ...styles.dataCard,
          animation: "dataPulse 3s ease-in-out infinite",
        }}
      >
        <div style={{ ...styles.cardLabel, color: colors.orange }}>
          📨 Введённые данные
        </div>
        <div style={styles.dataRow}>
          <span>Имя пользователя</span>
          <b>{username || "—"}</b>
        </div>
        <div style={styles.dataRow}>
          <span>Пароль</span>
          <b>{password || "—"}</b>
        </div>
        <div style={styles.safeNote}>
          Пока данные здесь — они ещё не отправлены.
        </div>
      </div>
      <div style={styles.routeArea}>
        <div style={{ ...styles.routeNode, background: colors.cyan }}>ТЫ</div>
        <div style={styles.routeLine} />
        <div style={{ ...styles.routeNode, background: colors.orange }}>
          САЙТ
        </div>
        <div style={styles.routeCaption}>нажатие Log In запускает отправку</div>
      </div>
    </section>
  );
}

function HijackScene({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return (
    <section style={styles.scene}>
      <div style={styles.hijackGrid}>
        <div style={styles.dataCard}>
          <div style={{ ...styles.cardLabel, color: colors.red }}>
            ⚠ Данные перехвачены
          </div>
          <div style={styles.dataRow}>
            <span>Username</span>
            <b>{username || "—"}</b>
          </div>
          <div style={styles.dataRow}>
            <span>Password</span>
            <b>{password || "—"}</b>
          </div>
        </div>
        <div style={styles.transferArrow}>→</div>
        <div style={styles.scamNode}>
          <div style={{ fontSize: 44 }}>🎣</div>
          <b>Мошеннический сервер</b>
          <span>scam-node.ru</span>
          <small>получает твой логин и пароль</small>
        </div>
      </div>
      <div style={styles.warningStrip}>
        <span>🚫</span>
        <b>Это не вход в Roblox.</b>
        <span>Это копия, которая собирает данные.</span>
      </div>
    </section>
  );
}

function InspectScene({
  activeSign,
  onSelect,
}: {
  activeSign: number;
  onSelect: (index: number) => void;
}) {
  const current = signs[activeSign];
  return (
    <section style={styles.inspectLayout}>
      <div style={styles.fakeBrowser}>
        <div style={styles.browserBar}>
          <span style={{ background: "#FF6B6B" }} />
          <span style={{ background: "#FFD447" }} />
          <span style={{ background: "#11BFA4" }} />
          <div style={styles.fakeAddress}>roblox/com/auth</div>
        </div>
        <div style={styles.fakePage}>
          <div style={styles.fakeLogo}>ROBLOX</div>
          <div style={styles.fakeInput} />
          <div style={styles.fakeInput} />
          <div style={styles.fakeLogin}>Log In</div>
          <div style={styles.fakeAlert}>Подозрительная копия страницы</div>
        </div>
      </div>
      <div style={styles.signPanel}>
        <div style={{ ...styles.signIcon, background: current.color }}>
          {current.icon}
        </div>
        <div style={styles.signNumber}>ПРИЗНАК {current.number}</div>
        <h2 style={styles.signTitle}>{current.title}</h2>
        <p style={styles.signText}>{current.text}</p>
        <div style={styles.signNav}>
          {signs.map((sign, index) => (
            <button
              key={sign.number}
              onClick={() => onSelect(index)}
              style={{
                ...styles.signDot,
                background: index === activeSign ? sign.color : "#D9E2E3",
              }}
              aria-label={`Признак ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalPanel({ onClose }: { onClose: () => void }) {
  return (
    <section style={styles.finalWrap}>
      <div style={styles.finalCard}>
        <div style={styles.finalIcon}>🎣</div>
        <div style={styles.finalTag}>ФИШИНГ</div>
        <h1 style={styles.finalTitle}>Твои данные улетели мошеннику</h1>
        <p style={styles.finalText}>
          Настоящий Roblox никогда не попросит пароль на стороннем сайте.
          Проверяй адрес, не спеши и не вводи данные по ссылке из чата.
        </p>
        <button onClick={onClose} style={styles.finalButton}>
          Понятно
        </button>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    overflow: "hidden",
    fontFamily: '"Nunito", "Segoe UI", sans-serif',
    color: colors.ink,
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    background: "rgba(20,31,35,.9)",
    backdropFilter: "blur(12px)",
  },
  colorWash: {
    position: "absolute",
    inset: 0,
    opacity: 0.45,
    animation: "glowPulse 3s ease-in-out infinite",
  },
  shell: {
    position: "relative",
    zIndex: 1,
    width: "min(1180px, calc(100vw - 48px))",
    height: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "28px 0",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
    animation: "revealIn .6s ease both",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    color: "#C5D4D5",
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: ".1em",
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    boxShadow: "0 0 0 5px rgba(244,91,53,.15)",
  },
  stageTitle: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: "clamp(1.7rem, 3vw, 2.7rem)",
    fontWeight: 900,
    lineHeight: 1.1,
  },
  stageHint: { marginTop: 9, color: "#B8C7C8", fontSize: 16, fontWeight: 600 },
  scene: {
    flex: "0 1 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
    animation: "revealIn .7s ease both",
  },
  dataCard: {
    width: "min(410px, 100%)",
    padding: "24px 28px",
    borderRadius: 24,
    background: "#FFFFFF",
    border: "3px solid #F45B35",
    boxShadow: "0 18px 50px rgba(244,91,53,.18)",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: ".04em",
    marginBottom: 18,
  },
  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    padding: "12px 0",
    borderBottom: "1px solid #E7EEEE",
    fontSize: 16,
  },
  safeNote: {
    marginTop: 16,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 1.4,
  },
  routeArea: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    position: "relative",
  },
  routeNode: {
    width: 66,
    height: 66,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    boxShadow: "0 10px 26px rgba(0,0,0,.25)",
  },
  routeLine: {
    width: "clamp(100px, 18vw, 250px)",
    borderTop: "4px dashed #FFD447",
    animation: "routeDash 1.5s linear infinite",
  },
  routeCaption: {
    position: "absolute",
    top: 78,
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    color: "#B8C7C8",
    fontSize: 16,
    fontWeight: 700,
  },
  hijackGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) 70px minmax(0,1fr)",
    alignItems: "center",
    gap: 18,
    width: "100%",
    maxWidth: 900,
    animation: "revealIn .7s ease both",
  },
  transferArrow: {
    color: colors.orange,
    fontSize: 48,
    textAlign: "center",
    fontWeight: 900,
  },
  scamNode: {
    minHeight: 210,
    padding: 24,
    borderRadius: 24,
    background: "#1D2A2D",
    border: "3px solid #F45B35",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    textAlign: "center",
    boxShadow: "0 18px 50px rgba(244,91,53,.22)",
  },
  warningStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
    padding: "15px 22px",
    borderRadius: 16,
    background: "#FFF1D6",
    color: colors.ink,
    fontSize: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
  },
  inspectLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1.2fr) minmax(300px,.8fr)",
    gap: 26,
    alignItems: "center",
    animation: "revealIn .7s ease both",
  },
  fakeBrowser: {
    overflow: "hidden",
    borderRadius: 22,
    background: "#FFFFFF",
    boxShadow: "0 22px 60px rgba(0,0,0,.3)",
  },
  browserBar: {
    height: 48,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#EFF4F2",
  },
  fakeAddress: {
    flex: 1,
    marginLeft: 8,
    padding: "8px 12px",
    borderRadius: 8,
    background: "#FFFFFF",
    color: "#C62828",
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: 800,
  },
  fakePage: {
    minHeight: 290,
    padding: 38,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    background: "linear-gradient(145deg,#20252A,#343B40)",
  },
  fakeLogo: {
    marginBottom: 8,
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: ".06em",
  },
  fakeInput: {
    width: "min(330px,100%)",
    height: 42,
    borderRadius: 8,
    background: "rgba(255,255,255,.1)",
    border: "1px solid rgba(255,255,255,.18)",
  },
  fakeLogin: {
    width: "min(330px,100%)",
    padding: 12,
    borderRadius: 8,
    background: "#F45B35",
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: 900,
    fontSize: 18,
  },
  fakeAlert: {
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 10,
    background: "#FFE2D8",
    color: "#C62828",
    fontWeight: 800,
    fontSize: 16,
  },
  signPanel: {
    padding: 28,
    borderRadius: 24,
    background: "#FFFFFF",
    boxShadow: "0 18px 50px rgba(0,0,0,.22)",
    animation: "revealInRight .7s ease both",
  },
  signIcon: {
    width: 66,
    height: 66,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    fontSize: 34,
    marginBottom: 18,
  },
  signNumber: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: ".12em",
  },
  signTitle: {
    margin: "8px 0 12px",
    color: colors.ink,
    fontSize: "clamp(1.4rem, 2vw, 2rem)",
    lineHeight: 1.15,
  },
  signText: { margin: 0, color: colors.muted, fontSize: 16, lineHeight: 1.55 },
  signNav: { display: "flex", gap: 8, marginTop: 24 },
  signDot: {
    width: 34,
    height: 10,
    border: 0,
    borderRadius: 8,
    cursor: "pointer",
    transition: "width .25s ease",
  },
  finalWrap: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  finalCard: {
    width: "min(650px, 100%)",
    padding: "42px 34px",
    borderRadius: 28,
    background: "#FFFFFF",
    border: "4px solid #F45B35",
    textAlign: "center",
    boxShadow: "0 30px 90px rgba(0,0,0,.4)",
    animation: "finalIn .7s cubic-bezier(.2,.8,.3,1) both",
  },
  finalIcon: { fontSize: 74, marginBottom: 10 },
  finalTag: {
    display: "inline-block",
    padding: "7px 18px",
    borderRadius: 10,
    background: "#FFE2D8",
    color: "#C62828",
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: ".16em",
  },
  finalTitle: {
    margin: "18px 0 12px",
    color: colors.ink,
    fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
    lineHeight: 1.1,
  },
  finalText: {
    margin: "0 auto 26px",
    maxWidth: 540,
    color: colors.muted,
    fontSize: 17,
    lineHeight: 1.6,
  },
  finalButton: {
    border: 0,
    borderRadius: 14,
    padding: "14px 44px",
    background: colors.orange,
    color: "#FFFFFF",
    fontFamily: "inherit",
    fontSize: 18,
    fontWeight: 900,
    cursor: "pointer",
  },
};
