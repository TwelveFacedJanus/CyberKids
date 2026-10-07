// components/tasks/DropperChatTask.tsx
// Сценарий «Тебе предлагают подработку» (дропперство): чат → улики → перевод → давление → схема → роль
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import type { TaskComponentProps } from "./taskUtils";
import type { Answer } from "../../types";

const KEY = "dropper_chat_result";
// Пауза перед автоматической отправкой, чтобы ребёнок успел увидеть «✅ Верно» и правило. 0 — отправлять сразу.
const AUTO_SUBMIT_DELAY_MS = 2600;

/* ───────────── типы контента ───────────── */
interface Reply {
  id: string;
  text: string;
  flag?: string;
}
interface Question {
  id: string;
  label: string;
  replies: Reply[];
  clue: string;
  risk: number;
}
interface PressureOption {
  id: string;
  label: string;
  correct: boolean;
  leadsToTransfer?: boolean;
  reply: string;
  lesson: string;
}
interface RoleOption {
  id: string;
  label: string;
  correct: boolean;
  explain: string;
}
interface Msg {
  uid: number;
  id: string;
  from: "me" | "them" | "sys";
  text: string;
  flag?: string;
}
type Phase =
  | "chat"
  | "spot"
  | "transfer"
  | "flow"
  | "ask"
  | "pressure"
  | "scheme";
type Choice = "transfer" | "ask" | "stop";
type SpotState = "found" | "missed" | "ok";

/* ───────────── визуальные токены ───────────── */
const C = {
  ink: "#12172B",
  panel: "#1A2140",
  them: "#262F58",
  me: "#5B6CFF",
  text: "#E8EBFF",
  dim: "#8E97C4",
  danger: "#FF5A5F",
  warn: "#FFB020",
  ok: "#2DD4A7",
  line: "rgba(255,255,255,.09)",
};
const pop = keyframes`from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}`;
const slideDown = keyframes`from{opacity:0;transform:translateY(-26px)}to{opacity:1;transform:none}`;
const shake = keyframes`0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}`;
const slam = keyframes`0%{opacity:0;transform:scale(2.4) rotate(-5deg)}60%{opacity:1;transform:scale(.94) rotate(1deg)}100%{transform:none}`;
const dash = keyframes`to{background-position:0 24px}`;
const pulse = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(255,90,95,.55)}50%{box-shadow:0 0 0 12px rgba(255,90,95,0)}`;
const dot = keyframes`0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}`;
const rm = {
  "@media (prefers-reduced-motion: reduce)": { animation: "none !important" },
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const money = (n: number) => n.toLocaleString("ru-RU") + " ₽";
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function useCountUp(target: number, ms = 1000) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const a = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const val = Math.round(a + (target - a) * (1 - Math.pow(1 - p, 3)));
      from.current = val;
      setV(val);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/* ───────────── мелкие компоненты ───────────── */
type Tone = "ok" | "warn" | "danger" | "brand" | "ghost";
const toneBg: Record<Tone, string> = {
  ok: C.ok,
  warn: C.warn,
  danger: C.danger,
  brand: C.me,
  ghost: "rgba(255,255,255,.07)",
};
function Btn({
  children,
  onClick,
  disabled,
  tone = "ghost",
  sx,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: Tone;
  sx?: object;
}) {
  const dark = tone === "ok" || tone === "warn";
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        fontSize: 14,
        borderRadius: "12px",
        py: 1.1,
        px: 2,
        color: dark ? C.ink : "#fff",
        bgcolor: toneBg[tone],
        justifyContent: "flex-start",
        textAlign: "left",
        border: tone === "ghost" ? `1px solid ${C.line}` : "none",
        "&:hover": { bgcolor: toneBg[tone], filter: "brightness(1.12)" },
        "&.Mui-disabled": { color: C.dim, bgcolor: "rgba(255,255,255,.04)" },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

function Bubble({
  m,
  tappable,
  state,
  onTap,
}: {
  m: Msg;
  tappable: boolean;
  state?: SpotState;
  onTap: () => void;
}) {
  if (m.from === "sys") {
    return (
      <Typography
        fontSize={12}
        sx={{
          textAlign: "center",
          color: C.dim,
          py: 0.5,
          animation: `${pop} .3s both`,
          ...rm,
        }}
      >
        {m.text}
      </Typography>
    );
  }
  const me = m.from === "me";
  const border =
    state === "found"
      ? C.danger
      : state === "missed"
        ? C.warn
        : tappable
          ? "rgba(255,255,255,.28)"
          : "transparent";
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: me ? "flex-end" : "flex-start",
        animation: `${pop} .28s both`,
        ...rm,
      }}
    >
      <Box
        role={tappable ? "button" : undefined}
        tabIndex={tappable ? 0 : undefined}
        onClick={tappable ? onTap : undefined}
        onKeyDown={
          tappable
            ? (e) => (e.key === "Enter" || e.key === " ") && onTap()
            : undefined
        }
        sx={{
          maxWidth: "84%",
          px: 1.75,
          py: 1,
          fontSize: 14,
          lineHeight: 1.45,
          color: "#fff",
          borderRadius: me ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          bgcolor:
            state === "found"
              ? "rgba(255,90,95,.2)"
              : state === "missed"
                ? "rgba(255,176,32,.16)"
                : me
                  ? C.me
                  : C.them,
          border: `1.5px ${tappable ? "dashed" : "solid"} ${border}`,
          cursor: tappable ? "pointer" : "default",
          transition: "background .2s, border-color .2s",
          "&:hover": tappable
            ? { borderColor: C.warn, bgcolor: "rgba(255,255,255,.1)" }
            : undefined,
          "&:focus-visible": {
            outline: `2px solid ${C.warn}`,
            outlineOffset: 2,
          },
          animation: state === "ok" ? `${shake} .4s` : undefined,
          ...rm,
        }}
      >
        {m.text}
      </Box>
      {state === "found" && m.flag && (
        <Callout color={C.danger} icon="⚠️" text={m.flag} />
      )}
      {state === "missed" && m.flag && (
        <Callout color={C.warn} icon="👀" text={`Ты пропустил: ${m.flag}`} />
      )}
      {state === "ok" && (
        <Callout
          color={C.dim}
          icon=""
          text="Само по себе — обычное сообщение. Смотри на всю картину."
        />
      )}
    </Box>
  );
}
function Callout({
  color,
  icon,
  text,
}: {
  color: string;
  icon: string;
  text: string;
}) {
  return (
    <Typography
      fontSize={12.5}
      sx={{
        mt: 0.6,
        maxWidth: "86%",
        color,
        lineHeight: 1.4,
        animation: `${pop} .3s both`,
        ...rm,
      }}
    >
      {icon} {text}
    </Typography>
  );
}
function Typing() {
  return (
    <Box
      sx={{
        display: "inline-flex",
        gap: 0.6,
        px: 1.75,
        py: 1.3,
        bgcolor: C.them,
        borderRadius: "16px 16px 16px 4px",
        alignSelf: "flex-start",
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: C.text,
            animation: `${dot} 1s ${i * 0.15}s infinite`,
            ...rm,
          }}
        />
      ))}
    </Box>
  );
}
function Link({
  delay = 0,
  color = C.warn,
  h = 26,
}: {
  delay?: number;
  color?: string;
  h?: number;
}) {
  return (
    <Box
      sx={{
        width: 3,
        height: h,
        borderRadius: 2,
        backgroundImage: `repeating-linear-gradient(180deg, ${color} 0 6px, transparent 6px 12px)`,
        backgroundSize: "3px 24px",
        animation: `${pop} .3s ${delay}s both, ${dash} .8s linear infinite`,
        ...rm,
      }}
    />
  );
}
function Node({
  label,
  sub,
  you,
  delay = 0,
}: {
  label: string;
  sub?: string;
  you?: boolean;
  delay?: number;
}) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.1,
        borderRadius: "14px",
        textAlign: "center",
        minWidth: 170,
        bgcolor: you ? "rgba(255,90,95,.18)" : C.them,
        border: `1.5px solid ${you ? C.danger : C.line}`,
        animation: `${pop} .4s ${delay}s both${you ? `, ${pulse} 1.8s ${delay + 0.5}s infinite` : ""}`,
        ...rm,
      }}
    >
      <Typography fontWeight={800} fontSize={14} color="#fff">
        {label}
      </Typography>
      {sub && (
        <Typography fontSize={11.5} color={C.dim}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}
function Pill({
  children,
  color = C.ok,
  delay = 0,
}: {
  children: React.ReactNode;
  color?: string;
  delay?: number;
}) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 99,
        border: `1.5px solid ${color}`,
        color,
        fontWeight: 800,
        fontSize: 13.5,
        animation: `${pop} .35s ${delay}s both`,
        ...rm,
      }}
    >
      {children}
    </Box>
  );
}

/* ───────────── оверлей «куда ушли деньги» ───────────── */
function FlowOverlay({
  tr,
  problems,
  outro,
  onSettle,
  onPicked,
  onBack,
}: {
  tr: any;
  problems: { id: string; text: string; correct: boolean }[];
  outro: string;
  onSettle: () => void;
  onPicked: (ids: string[]) => void;
  onBack: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [sel, setSel] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const opts = useMemo(() => shuffle(problems), [problems]);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage(1);
      onSettle();
    }, 4600);
    const t2 = setTimeout(() => setStage(2), 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (stage > 0)
      bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [stage, checked]);

  const fwd = tr.amount - tr.keep;
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        bgcolor: "rgba(10,13,28,.96)",
        overflowY: "auto",
        p: 2.5,
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Node label={tr.from} sub="чужой человек" />
        <Link delay={0.5} />
        <Pill delay={0.8}>+ {money(tr.amount)}</Pill>
        <Link delay={1.2} />
        <Node label="ТВОЯ КАРТА" you delay={1.6} />
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link delay={2.3} />
            <Pill color={C.warn} delay={2.6}>
              {money(tr.keep)} тебе
            </Pill>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link delay={2.3} />
            <Pill delay={2.6}>{money(fwd)}</Pill>
            <Link delay={3.1} />
            <Node label="ДРУГАЯ КАРТА" sub={tr.card} delay={3.5} />
          </Box>
        </Box>

        {stage >= 1 && (
          <Box
            sx={{
              mt: 2.5,
              textAlign: "center",
              animation: `${slam} .5s both`,
              ...rm,
            }}
          >
            <Typography fontSize={26} fontWeight={900} color={C.danger}>
              🚨 Стоп!
            </Typography>
            <Typography fontSize={14} sx={{ maxWidth: 380, mt: 0.5 }}>
              Ты только что провёл через свой счёт чужие деньги.
            </Typography>
          </Box>
        )}

        {stage >= 2 && (
          <Box
            sx={{
              mt: 2.5,
              width: "100%",
              maxWidth: 460,
              animation: `${pop} .4s both`,
              ...rm,
            }}
          >
            <Typography fontWeight={800} fontSize={15} sx={{ mb: 1 }}>
              Что здесь является проблемой? Выбери все.
            </Typography>
            <Box sx={{ display: "grid", gap: 0.8 }}>
              {opts.map((o) => {
                const on = sel.includes(o.id);
                let bg = on ? "rgba(91,108,255,.3)" : "rgba(255,255,255,.06)";
                let bd = on ? C.me : C.line;
                let mark = "";
                if (checked) {
                  if (o.correct && on) {
                    bg = "rgba(45,212,167,.2)";
                    bd = C.ok;
                    mark = "✓ ";
                  } else if (o.correct) {
                    bg = "rgba(255,176,32,.16)";
                    bd = C.warn;
                    mark = "↑ тоже проблема: ";
                  } else if (on) {
                    bg = "rgba(255,90,95,.2)";
                    bd = C.danger;
                    mark = "✗ ";
                  }
                }
                return (
                  <Box
                    key={o.id}
                    role="checkbox"
                    aria-checked={on}
                    tabIndex={0}
                    onClick={() =>
                      !checked &&
                      setSel((s) =>
                        on ? s.filter((x) => x !== o.id) : [...s, o.id],
                      )
                    }
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      !checked &&
                      setSel((s) =>
                        on ? s.filter((x) => x !== o.id) : [...s, o.id],
                      )
                    }
                    sx={{
                      px: 1.75,
                      py: 1.1,
                      borderRadius: "12px",
                      bgcolor: bg,
                      border: `1.5px solid ${bd}`,
                      cursor: checked ? "default" : "pointer",
                      fontSize: 14,
                      transition: "all .15s",
                      "&:focus-visible": { outline: `2px solid ${C.warn}` },
                    }}
                  >
                    {mark}
                    {o.text}
                  </Box>
                );
              })}
            </Box>
            {!checked ? (
              <Btn
                tone="brand"
                disabled={sel.length === 0}
                sx={{ mt: 1.5, width: "100%", justifyContent: "center" }}
                onClick={() => {
                  setChecked(true);
                  onPicked(sel);
                }}
              >
                Проверить
              </Btn>
            ) : (
              <Box sx={{ mt: 1.5, animation: `${pop} .3s both`, ...rm }}>
                <Typography
                  fontSize={13.5}
                  sx={{ lineHeight: 1.5, color: C.dim, mb: 1.5 }}
                >
                  {outro}
                </Typography>
                <Btn
                  tone="ok"
                  sx={{ width: "100%", justifyContent: "center" }}
                  onClick={onBack}
                >
                  ↩ Вернуться к выбору и попробовать иначе
                </Btn>
              </Box>
            )}
          </Box>
        )}
        <div ref={bottom} />
      </Box>
    </Box>
  );
}

/* ───────────── основной компонент ───────────── */
type Props = TaskComponentProps & {
  onSubmit?: (finalAnswers: Answer[]) => void;
};

export default function DropperChatTask(props: Props) {
  return <Inner {...props} />;
}

function Inner({ content, answers, onChange, onSubmit }: Props) {
  const c = content as any;
  const contact = c.contact || { name: "Артём", avatar: "А" };
  const intro: Reply[] = c.intro || [];
  const questions: Question[] = c.questions || [];
  const tr = c.transfer;
  const pressure = c.pressure as {
    messages: Reply[];
    options: PressureOption[];
  };
  const problems = c.problems || [];
  const roles: RoleOption[] = c.roleOptions || [];
  const minQ: number = c.minQuestions ?? 3;
  const minFlags: number = c.minFlags ?? 4;
  const start: number = c.startBalance ?? 1240;

  const [phase, setPhase] = useState<Phase>("chat");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const [spot, setSpot] = useState<Record<string, SpotState>>({});
  const [spotDone, setSpotDone] = useState(false);
  const [balance, setBalance] = useState(start);
  const [notif, setNotif] = useState(false);
  const [tried, setTried] = useState<Choice[]>([]);
  const [firstChoice, setFirstChoice] = useState<Choice | null>(null);
  const [flowFrom, setFlowFrom] = useState<"transfer" | "pressure">("transfer");
  const [pressureFirst, setPressureFirst] = useState<string | null>(null);
  const [pressureTried, setPressureTried] = useState<string[]>([]);
  const [lastPick, setLastPick] = useState<PressureOption | null>(null);
  const [problemsPicked, setProblemsPicked] = useState<string[] | null>(null);
  const [showRole, setShowRole] = useState(false);
  const [roleFirst, setRoleFirst] = useState<string | null>(null);
  const [roleWrong, setRoleWrong] = useState<RoleOption[]>([]);
  const [done, setDone] = useState(false);

  const alive = useRef(true);
  const started = useRef(false);
  const transferShown = useRef(false);
  const visited = useRef<Set<string>>(new Set());
  const seq = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const shownBalance = useCountUp(balance);
  const pressureOpts = useMemo(
    () => shuffle(pressure?.options || []),
    [pressure],
  );

  const add = useCallback(
    (m: Omit<Msg, "uid">) =>
      setMsgs((p) => [...p, { ...m, uid: ++seq.current }]),
    [],
  );
  const pushMe = (text: string) => add({ id: "me", from: "me", text });
  const sys = (text: string) => add({ id: "sys", from: "sys", text });

  const say = useCallback(
    async (list: Reply[]) => {
      for (const r of list) {
        if (!alive.current) return;
        setTyping(true);
        await wait(Math.min(1500, 500 + r.text.length * 14));
        if (!alive.current) return;
        setTyping(false);
        add({ id: r.id, from: "them", text: r.text, flag: r.flag });
        await wait(260);
      }
    },
    [add],
  );

  const act = useCallback(async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      if (alive.current) setBusy(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    if (!started.current) {
      started.current = true;
      act(async () => {
        await wait(500);
        await say(intro);
      });
    }
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, typing]);

  useEffect(() => {
    if (phase !== "scheme") return;
    const t = setTimeout(() => setShowRole(true), 4200);
    return () => clearTimeout(t);
  }, [phase]);

  /* ── производные ── */
  const totalFlags = msgs.filter((m) => m.from === "them" && m.flag).length;
  const found = Object.values(spot).filter((v) => v === "found").length;
  const wrongTaps = Object.values(spot).filter((v) => v === "ok").length;
  const allFlagIds: string[] = [
    ...intro.filter((r) => r.flag).map((r) => r.id),
    ...questions.flatMap((q) =>
      q.replies.filter((r) => r.flag).map((r) => r.id),
    ),
  ];
  const risk = Math.min(
    100,
    10 +
      questions
        .filter((q) => asked.includes(q.id))
        .reduce((s, q) => s + q.risk, 0),
  );
  const riskColor = risk < 35 ? C.ok : risk < 70 ? C.warn : C.danger;
  const riskLabel =
    risk < 35
      ? "Пока спокойно"
      : risk < 70
        ? "Это настораживает"
        : "Это тревожно";
  const clues = questions.filter((q) => asked.includes(q.id));
  const stageIdx = {
    chat: 0,
    spot: 1,
    transfer: 2,
    flow: 2,
    ask: 2,
    pressure: 3,
    scheme: 4,
  }[phase];
  const tips: Record<Phase, string> = {
    chat: `Задавай вопросы Артёму. Нужно минимум ${minQ}.`,
    spot: "Чат заморожен. Нажимай на сообщения, которые кажутся подозрительными.",
    transfer: "Пришёл первый платёж. Что ты сделаешь?",
    flow: "Смотри, куда пошли деньги.",
    ask: "Прочитай ответ — и реши снова.",
    pressure: "Артём давит. Как ответишь?",
    scheme: "Вот что на самом деле происходило.",
  };

  /* ── действия ── */
  const askQuestion = (q: Question) =>
    act(async () => {
      setAsked((a) => [...a, q.id]);
      pushMe(q.label);
      await wait(300);
      await say(q.replies);
    });

  const tapMsg = (m: Msg) => {
    if (spot[m.uid + ""] || spotDone) return;
    setSpot((s) => ({ ...s, [m.uid]: m.flag ? "found" : "ok" }));
  };

  const finishSpot = () => {
    const next = { ...spot };
    msgs.forEach((m) => {
      if (m.from === "them" && m.flag && !next[m.uid]) next[m.uid] = "missed";
    });
    setSpot(next);
    setSpotDone(true);
  };

  const enterTransfer = () => {
    setPhase("transfer");
    if (transferShown.current) return;
    transferShown.current = true;
    act(async () => {
      await wait(400);
      setNotif(true);
      setBalance(start + tr.amount);
      setTimeout(() => alive.current && setNotif(false), 5200);
      await wait(1300);
      await say(tr.messages);
    });
  };

  const choose = (ch: Choice) => {
    if (!firstChoice) setFirstChoice(ch);
    setTried((t) => (t.includes(ch) ? t : [...t, ch]));
    if (ch === "transfer") {
      pushMe("Хорошо, перевожу.");
      setFlowFrom("transfer");
      setPhase("flow");
    } else if (ch === "ask") {
      act(async () => {
        pushMe("А откуда эти деньги?");
        setPhase("ask");
        if (!visited.current.has("ask")) {
          visited.current.add("ask");
          await wait(300);
          await say(tr.askReplies);
        }
      });
    } else {
      act(async () => {
        pushMe("Нет, я останавливаюсь.");
        setPhase("pressure");
        setLastPick(null);
        if (!visited.current.has("stop")) {
          visited.current.add("stop");
          await wait(300);
          await say(pressure.messages);
        }
      });
    }
  };

  const backFromFlow = () => {
    setBalance(start + tr.amount);
    sys("↩ Ты вернулся к моменту перевода. Деньги ещё не ушли.");
    setLastPick(null);
    setPhase(flowFrom);
  };

  const pickPressure = (o: PressureOption) =>
    act(async () => {
      if (!pressureFirst) setPressureFirst(o.id);
      setPressureTried((t) => [...t, o.id]);
      pushMe(o.label);
      await wait(300);
      await say([{ id: "pr-" + o.id, text: o.reply }]);
      if (o.leadsToTransfer) {
        setFlowFrom("pressure");
        setPhase("flow");
        return;
      }
      setLastPick(o);
    });

  const pickRole = (o: RoleOption) => {
    const first = roleFirst ?? o.id;
    if (!roleFirst) setRoleFirst(o.id);
    if (!o.correct) {
      setRoleWrong((w) => [...w, o]);
      return;
    }
    setDone(true);
    const finalAnswers: Answer[] = [
      ...answers.filter((a: any) => a.key !== KEY),
      {
        key: KEY,
        value: {
          questionsAsked: asked,
          flagsFound: Object.keys(spot)
            .filter((k) => spot[k] === "found")
            .map((uid) => msgs.find((m) => String(m.uid) === uid)?.id)
            .filter(Boolean),
          flagsTotal: allFlagIds.length,
          wrongTaps,
          firstChoice,
          pressureFirst,
          pressureTried,
          problemsPicked,
          roleFirst: first,
          role: o.id,
        },
      } as Answer,
    ];
    onChange(finalAnswers);
    // Автоотправка: передаём ответы напрямую, не дожидаясь обновления state в родителе
    window.setTimeout(() => onSubmit?.(finalAnswers), AUTO_SUBMIT_DELAY_MS);
  };

  /* ───────────── рендер ───────────── */
  const labels = ["Переписка", "Улики", "Перевод", "Отказ", "Схема"];
  const doneRole = roles.find((r) => r.correct);

  return (
    <Box
      data-tutorial="dropper-chat"
      sx={{
        bgcolor: C.ink,
        color: C.text,
        borderRadius: "24px",
        p: { xs: 1.5, md: 2.5 },
      }}
    >
      {/* прогресс по этапам */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 0.75,
          mb: 2,
        }}
      >
        {labels.map((l, i) => (
          <Box key={l}>
            <Box
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: i <= stageIdx ? C.me : "rgba(255,255,255,.12)",
                transition: "background .4s",
              }}
            />
            <Typography
              fontSize={11}
              sx={{
                mt: 0.5,
                color: i === stageIdx ? C.text : C.dim,
                fontWeight: i === stageIdx ? 800 : 500,
                display: { xs: i === stageIdx ? "block" : "none", sm: "block" },
              }}
            >
              {l}
            </Typography>
          </Box>
        ))}
      </Box>

      {phase === "scheme" ? (
        <Box sx={{ maxWidth: 560, mx: "auto" }}>
          <Typography
            fontWeight={900}
            fontSize={18}
            sx={{ textAlign: "center", mb: 2 }}
          >
            Схема, которую ты раскрыл
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Node label="НЕИЗВЕСТНЫЙ ЧЕЛОВЕК" sub="чужой, без имени" />
            <Link delay={0.5} />
            <Pill delay={0.8}>💰 {money(tr.amount)}</Pill>
            <Link delay={1.2} />
            <Box sx={{ position: "relative" }}>
              <Node label="ТВОЯ КАРТА" you delay={1.6} />
              <Typography
                fontSize={12}
                fontWeight={800}
                color={C.danger}
                sx={{
                  position: "absolute",
                  left: "calc(100% + 10px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  whiteSpace: "nowrap",
                  animation: `${pop} .4s 2s both`,
                  ...rm,
                }}
              >
                ← ты здесь
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Link delay={2.3} />
                <Pill color={C.warn} delay={2.6}>
                  {money(tr.keep)} тебе
                </Pill>
                <Typography
                  fontSize={11.5}
                  color={C.dim}
                  sx={{ mt: 0.5, animation: `${pop} .4s 2.9s both`, ...rm }}
                >
                  приманка
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Link delay={2.3} />
                <Pill delay={2.6}>{money(tr.amount - tr.keep)}</Pill>
                <Link delay={3.1} />
                <Node label="ДРУГАЯ КАРТА" sub={tr.card} delay={3.5} />
              </Box>
            </Box>
          </Box>

          {showRole && !done && (
            <Box sx={{ mt: 3, animation: `${pop} .4s both`, ...rm }}>
              <Typography
                fontWeight={800}
                fontSize={16}
                sx={{ mb: 1.2, textAlign: "center" }}
              >
                Кем тебя хотели сделать в этой схеме?
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1,
                }}
              >
                {roles.map((o) => (
                  <Btn
                    key={o.id}
                    disabled={roleWrong.some((w) => w.id === o.id)}
                    onClick={() => pickRole(o)}
                    sx={{ justifyContent: "center" }}
                  >
                    {o.label}
                  </Btn>
                ))}
              </Box>
              {roleWrong.length > 0 && (
                <Typography
                  fontSize={13.5}
                  sx={{
                    mt: 1.5,
                    color: C.warn,
                    lineHeight: 1.5,
                    animation: `${shake} .4s`,
                    ...rm,
                  }}
                >
                  🤔 {roleWrong[roleWrong.length - 1].explain} Попробуй ещё раз.
                </Typography>
              )}
            </Box>
          )}

          {done && doneRole && (
            <Box
              sx={{
                mt: 3,
                p: 2.5,
                borderRadius: "18px",
                bgcolor: C.panel,
                border: `1.5px solid ${C.ok}`,
                animation: `${pop} .4s both`,
                ...rm,
              }}
            >
              <Typography fontWeight={900} fontSize={18} color={C.ok}>
                ✅ Верно: ты — посредник
              </Typography>
              <Typography fontSize={14} sx={{ mt: 0.75, lineHeight: 1.55 }}>
                {doneRole.explain}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
                {[
                  `🔎 Тревожных сообщений найдено: ${Object.values(spot).filter((v) => v === "found").length} из ${allFlagIds.length}`,
                  `💬 Вопросов задано: ${asked.length}`,
                  `🧭 Попыток отказа: ${pressureTried.length}`,
                ].map((t) => (
                  <Box
                    key={t}
                    sx={{
                      px: 1.5,
                      py: 0.6,
                      borderRadius: 99,
                      bgcolor: "rgba(255,255,255,.07)",
                      fontSize: 12.5,
                    }}
                  >
                    {t}
                  </Box>
                ))}
              </Box>
              <Typography fontWeight={800} fontSize={14} sx={{ mb: 0.75 }}>
                💡 Главное правило
              </Typography>
              <Typography fontSize={13.5} sx={{ lineHeight: 1.55, mb: 2 }}>
                {c.finalRule}
              </Typography>
              <Typography fontWeight={800} fontSize={14} sx={{ mb: 0.75 }}>
                Если тебе уже написали так же
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, pl: 2.5, fontSize: 13.5, lineHeight: 1.7 }}
              >
                {(c.whatToDo || []).map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </Box>
              <Typography
                fontSize={12.5}
                sx={{
                  mt: 2.5,
                  color: C.dim,
                  animation: `${pop} .4s both`,
                  ...rm,
                }}
              >
                Сохраняем результат…
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
             gridTemplateColumns: { xs: "1fr", lg: "clamp(190px, 22vw, 250px) minmax(0,1fr)" },
          }}
        >
          {/* ── левая панель ── */}
          <Box
            sx={{
              order: { xs: 2, md: 1 },
              display: "grid",
              gap: 1.5,
              alignContent: "start",
            }}
          >
            <Box sx={{ p: 1.75, borderRadius: "16px", bgcolor: C.panel }}>
              <Typography fontWeight={800} fontSize={13}>
                🎯 Задача
              </Typography>
              <Typography fontSize={13} sx={{ mt: 0.5, lineHeight: 1.45 }}>
                {c.goal}
              </Typography>
              <Typography
                fontSize={12.5}
                sx={{ mt: 1, color: C.dim, lineHeight: 1.45 }}
              >
                {tips[phase]}
              </Typography>
            </Box>
            <Box sx={{ p: 1.75, borderRadius: "16px", bgcolor: C.panel }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={800} fontSize={13}>
                  Подозрительность
                </Typography>
                <Typography fontSize={12} color={riskColor} fontWeight={700}>
                  {riskLabel}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,.1)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${risk}%`,
                    bgcolor: riskColor,
                    borderRadius: 4,
                    transition: "width .6s, background .6s",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 1.75, borderRadius: "16px", bgcolor: C.panel }}>
              <Typography fontSize={12} color={C.dim}>
                Твоя карта
              </Typography>
              <Typography
                fontWeight={900}
                fontSize={22}
                sx={{
                  color: shownBalance > start + 5000 ? C.warn : "#fff",
                  transition: "color .3s",
                }}
              >
                {money(shownBalance)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.75,
                borderRadius: "16px",
                bgcolor: C.panel,
                display: clues.length ? "block" : { xs: "none", md: "block" },
              }}
            >
              <Typography fontWeight={800} fontSize={13} sx={{ mb: 0.75 }}>
                🔎 Что выяснилось
              </Typography>
              {clues.length === 0 && (
                <Typography fontSize={12.5} color={C.dim}>
                  Пока ничего. Спроси Артёма.
                </Typography>
              )}
              {clues.map((q) => (
                <Typography
                  key={q.id}
                  fontSize={12.5}
                  sx={{
                    py: 0.4,
                    lineHeight: 1.4,
                    animation: `${pop} .3s both`,
                    ...rm,
                  }}
                >
                  • {q.clue}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* ── чат + действия ── */}
          <Box sx={{ order: { xs: 1, md: 2 }, minWidth: 0 }}>
            <Box
              sx={{
                position: "relative",
                height: { xs: 470, md: 540 },
                display: "flex",
                flexDirection: "column",
                bgcolor: C.panel,
                borderRadius: "20px",
                overflow: "hidden",
                border: `1px solid ${C.line}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 2,
                  py: 1.25,
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: C.me,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                  }}
                >
                  {contact.avatar}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={800} fontSize={14.5}>
                    {contact.name}
                  </Typography>
                  <Typography fontSize={11.5} color={typing ? C.ok : C.dim}>
                    {typing ? "печатает…" : "в сети"}
                  </Typography>
                </Box>
                {phase === "spot" && (
                  <Typography fontSize={12} color={C.warn} fontWeight={700}>
                    🔒 заморожено
                  </Typography>
                )}
              </Box>

              {phase === "spot" && (
                <Box
                  sx={{
                    px: 2,
                    py: 0.9,
                    bgcolor: "rgba(255,176,32,.13)",
                    fontSize: 13,
                    color: C.warn,
                    fontWeight: 700,
                  }}
                >
                  🔎 Отметь сообщения Артёма, которые кажутся подозрительными
                </Box>
              )}

              <Box
                ref={scroller}
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {msgs.map((m) => (
                  <Bubble
                    key={m.uid}
                    m={m}
                    state={spot[m.uid]}
                    tappable={
                      phase === "spot" &&
                      !spotDone &&
                      m.from === "them" &&
                      !spot[m.uid]
                    }
                    onTap={() => tapMsg(m)}
                  />
                ))}
                {typing && <Typing />}
              </Box>

              {notif && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 58,
                    left: 12,
                    right: 12,
                    zIndex: 4,
                    bgcolor: "#fff",
                    color: C.ink,
                    borderRadius: "16px",
                    p: 1.5,
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    boxShadow: "0 14px 34px rgba(0,0,0,.5)",
                    animation: `${slideDown} .5s both`,
                    ...rm,
                  }}
                >
                  <Box sx={{ fontSize: 26 }}>💳</Box>
                  <Box>
                    <Typography fontSize={11.5} sx={{ color: "#6B7280" }}>
                      Банк · Входящий перевод
                    </Typography>
                    <Typography
                      fontWeight={900}
                      fontSize={20}
                      sx={{ color: "#059669", lineHeight: 1.2 }}
                    >
                      +{money(tr.amount)}
                    </Typography>
                    <Typography fontSize={12.5}>От: {tr.from}</Typography>
                  </Box>
                </Box>
              )}

              {phase === "flow" && (
                <FlowOverlay
                  tr={tr}
                  problems={problems}
                  outro={c.problemsOutro || ""}
                  onSettle={() => setBalance(start + tr.keep)}
                  onPicked={setProblemsPicked}
                  onBack={backFromFlow}
                />
              )}
            </Box>

            {/* панель действий */}
            {phase !== "flow" && (
              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  borderRadius: "16px",
                  bgcolor: C.panel,
                  display: "grid",
                  gap: 1,
                }}
              >
                {phase === "chat" && (
                  <>
                    <Typography fontSize={12.5} color={C.dim}>
                      Спроси Артёма ({asked.length} из {questions.length}):
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {questions
                        .filter((q) => !asked.includes(q.id))
                        .map((q) => (
                          <Btn
                            key={q.id}
                            disabled={busy}
                            onClick={() => askQuestion(q)}
                            sx={{ borderRadius: 99, fontSize: 13.5 }}
                          >
                            {q.label}
                          </Btn>
                        ))}
                    </Box>
                    {asked.length >= minQ && (
                      <Btn
                        tone="brand"
                        disabled={busy}
                        onClick={() => setPhase("spot")}
                        sx={{
                          justifyContent: "center",
                          animation: `${pop} .4s both`,
                          ...rm,
                        }}
                      >
                        Мне всё ясно — что здесь странного?
                      </Btn>
                    )}
                  </>
                )}

                {phase === "spot" && (
                  <>
                    <Typography fontSize={13} color={C.dim}>
                      Найдено: <b style={{ color: "#fff" }}>{found}</b> из{" "}
                      {totalFlags}
                      {wrongTaps > 0 && ` · лишних нажатий: ${wrongTaps}`}
                    </Typography>
                    {!spotDone ? (
                      <Btn
                        tone="brand"
                        disabled={found < Math.min(minFlags, totalFlags)}
                        onClick={finishSpot}
                        sx={{ justifyContent: "center" }}
                      >
                        {found < Math.min(minFlags, totalFlags)
                          ? `Найди ещё ${Math.min(minFlags, totalFlags) - found}`
                          : "Проверить себя"}
                      </Btn>
                    ) : (
                      <Btn
                        tone="ok"
                        onClick={enterTransfer}
                        sx={{
                          justifyContent: "center",
                          animation: `${pop} .4s both`,
                          ...rm,
                        }}
                      >
                        Дальше: первый платёж
                      </Btn>
                    )}
                  </>
                )}

                {phase === "transfer" && (
                  <>
                    <Typography fontSize={12.5} color={C.dim}>
                      Что ответишь?
                    </Typography>
                    <Btn
                      tone="ok"
                      disabled={busy || !transferShown.current}
                      onClick={() => choose("transfer")}
                    >
                      🟢 Перевести
                      {tried.includes("transfer") && "  · уже пробовал"}
                    </Btn>
                    <Btn
                      tone="warn"
                      disabled={busy}
                      onClick={() => choose("ask")}
                    >
                      🟡 Спросить, откуда деньги
                      {tried.includes("ask") && "  · уже пробовал"}
                    </Btn>
                    <Btn
                      tone="danger"
                      disabled={busy}
                      onClick={() => choose("stop")}
                    >
                      🔴 Остановиться
                      {tried.includes("stop") && "  · уже пробовал"}
                    </Btn>
                  </>
                )}

                {phase === "ask" && !busy && (
                  <Box sx={{ animation: `${pop} .3s both`, ...rm }}>
                    <Typography
                      fontSize={13.5}
                      sx={{ lineHeight: 1.55, mb: 1.25 }}
                    >
                      🟡 {tr.askLesson}
                    </Typography>
                    <Btn
                      tone="ok"
                      sx={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        sys("↩ Ты вернулся к моменту перевода.");
                        setPhase("transfer");
                      }}
                    >
                      ↩ Вернуться к выбору
                    </Btn>
                  </Box>
                )}

                {phase === "pressure" &&
                  !busy &&
                  (lastPick ? (
                    <Box sx={{ animation: `${pop} .3s both`, ...rm }}>
                      <Typography
                        fontWeight={800}
                        fontSize={14}
                        color={lastPick.correct ? C.ok : C.warn}
                        sx={{ mb: 0.5 }}
                      >
                        {lastPick.correct ? "✅ Именно так" : "🤔 Не сработает"}
                      </Typography>
                      <Typography
                        fontSize={13.5}
                        sx={{ lineHeight: 1.55, mb: 1.25 }}
                      >
                        {lastPick.lesson}
                      </Typography>
                      {lastPick.correct ? (
                        <Btn
                          tone="ok"
                          sx={{ width: "100%", justifyContent: "center" }}
                          onClick={() => setPhase("scheme")}
                        >
                          Дальше: показать схему
                        </Btn>
                      ) : (
                        <Btn
                          tone="brand"
                          sx={{ width: "100%", justifyContent: "center" }}
                          onClick={() => setLastPick(null)}
                        >
                          Попробовать другой ответ
                        </Btn>
                      )}
                    </Box>
                  ) : (
                    <>
                      <Typography fontSize={12.5} color={C.dim}>
                        Артём пытается тебя убедить. Что будешь делать?
                      </Typography>
                      {pressureOpts.map((o) => (
                        <Btn
                          key={o.id}
                          disabled={
                            busy || (pressureTried.includes(o.id) && !o.correct)
                          }
                          onClick={() => pickPressure(o)}
                        >
                          {o.label}
                        </Btn>
                      ))}
                    </>
                  ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
