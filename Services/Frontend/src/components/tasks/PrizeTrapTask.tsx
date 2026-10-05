// components/tasks/PrizeTrapTask.tsx
// «Приз победителю»: чат с «организатором олимпиады» + досье, которое заполняется по мере отправки данных
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import type { TaskComponentProps } from "./taskUtils";
import type { Answer } from "../../types";
import {
  AUTO_SUBMIT_DELAY_MS,
  dot,
  fmtTime,
  pop,
  pulseRed,
  rm,
  shake,
  shuffle,
  slam,
  useCountUp,
  wait,
} from "./school_trap/kit";

const KEY = "prize_trap_result";

interface Reply {
  id: string;
  text: string;
}
interface Req {
  id: string;
  kind: "ok" | "danger";
  label: string;
  icon: string;
  ask: string;
  value: string;
  weight: number;
  why: string;
  sendReply: string;
  refuseReply: string;
  lesson?: string;
}
interface Threat {
  id: string;
  icon: string;
  text: string;
  needs: string[];
}
interface FinalOpt {
  id: string;
  label: string;
  correct: boolean;
  explain: string;
}
interface Msg {
  uid: number;
  from: "me" | "them";
  text: string;
}

const P = {
  bg: "linear-gradient(160deg,#F4EEFF,#FFF0F6)",
  ink: "#221A3D",
  violet: "#7C4DFF",
  pink: "#EC407A",
  green: "#12B886",
  red: "#E5484D",
  dim: "#7A7096",
  dark: "#1B1630",
};

function Btn({
  children,
  onClick,
  disabled,
  color = P.violet,
  sx,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  sx?: object;
}) {
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
        color: "#fff",
        bgcolor: color,
        justifyContent: "flex-start",
        textAlign: "left",
        "&:hover": { bgcolor: color, filter: "brightness(1.08)" },
        "&.Mui-disabled": {
          bgcolor: "rgba(34,26,61,.08)",
          color: "rgba(34,26,61,.38)",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

type Props = TaskComponentProps & { onSubmit?: (a: Answer[]) => void };

export default function PrizeTrapTask({
  content,
  answers,
  onChange,
  onSubmit,
}: Props) {
  const c = content as any;
  const contact = c.contact || { name: "Организатор", avatar: "А" };
  const intro: Reply[] = c.intro || [];
  const outro: Reply[] = c.outro || [];
  const reqs: Req[] = c.requests || [];
  const threats: Threat[] = c.threats || [];
  const finalQ = c.finalQuestion as { text: string; options: FinalOpt[] };
  const finalOpts = useMemo(() => shuffle(finalQ?.options || []), [finalQ]);
  const totalWeight = reqs.reduce((s, r) => s + r.weight, 0) || 1;

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [idx, setIdx] = useState(0);
  const [awaiting, setAwaiting] = useState(false);
  const [decisions, setDecisions] = useState<Record<string, "send" | "refuse">>(
    {},
  );
  const [askedWhy, setAskedWhy] = useState<string[]>([]);
  const [phase, setPhase] = useState<"chat" | "final" | "done">("chat");
  const [finalFirst, setFinalFirst] = useState<string | null>(null);
  const [finalWrong, setFinalWrong] = useState<FinalOpt[]>([]);
  const [secs, setSecs] = useState<number>(c.timerStart ?? 599);

  const alive = useRef(true);
  const started = useRef(false);
  const seq = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const submitTimer = useRef<number | undefined>(undefined);

  const add = useCallback(
    (from: "me" | "them", text: string) =>
      setMsgs((p) => [...p, { uid: ++seq.current, from, text }]),
    [],
  );
  const say = useCallback(
    async (list: { text: string }[]) => {
      for (const r of list) {
        if (!alive.current) return;
        setTyping(true);
        await wait(Math.min(1400, 450 + r.text.length * 13));
        if (!alive.current) return;
        setTyping(false);
        add("them", r.text);
        await wait(240);
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

  const askNext = useCallback(
    async (i: number) => {
      if (i >= reqs.length) {
        await say(outro);
        if (alive.current) setPhase("final");
        return;
      }
      setIdx(i);
      await say([{ text: reqs[i].ask }]);
      if (alive.current) setAwaiting(true);
    },
    [reqs, outro, say],
  );

  useEffect(() => {
    alive.current = true;
    if (!started.current) {
      started.current = true;
      act(async () => {
        await wait(500);
        await say(intro);
        await askNext(0);
      });
    }
    return () => {
      alive.current = false;
      window.clearTimeout(submitTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, typing]);

  const req = reqs[idx];
  const decide = (d: "send" | "refuse") =>
    act(async () => {
      setAwaiting(false);
      setDecisions((p) => ({ ...p, [req.id]: d }));
      add("me", d === "send" ? req.value : "Нет, это я отправлять не буду.");
      await wait(400);
      await say([{ text: d === "send" ? req.sendReply : req.refuseReply }]);
      await askNext(idx + 1);
    });
  const askWhy = () =>
    act(async () => {
      setAskedWhy((a) => [...a, req.id]);
      add("me", "А зачем это нужно?");
      await wait(350);
      await say([{ text: req.why }]);
    });

  /* ── производные ── */
  const sentIds = Object.keys(decisions).filter((k) => decisions[k] === "send");
  const leakRaw = reqs
    .filter((r) => sentIds.includes(r.id))
    .reduce((s, r) => s + r.weight, 0);
  const leak = Math.round((leakRaw / totalWeight) * 100);
  const leakShown = useCountUp(leak, 900);
  const leakColor = leak < 20 ? P.green : leak < 55 ? "#F5A524" : P.red;
  const unlocked = threats.filter((t) =>
    t.needs.every((n) => sentIds.includes(n)),
  );
  const dangerReqs = reqs.filter((r) => r.kind === "danger");

  const pickFinal = (o: FinalOpt) => {
    const first = finalFirst ?? o.id;
    if (!finalFirst) setFinalFirst(o.id);
    if (!o.correct) {
      setFinalWrong((w) => [...w, o]);
      return;
    }
    setPhase("done");
    const final: Answer[] = [
      ...answers.filter((a: any) => a.key !== KEY),
      {
        key: KEY,
        value: {
          decisions,
          askedWhy,
          leakPercent: leak,
          unlocked: unlocked.map((t) => t.id),
          finalFirst: first,
          final: o.id,
        },
      } as Answer,
    ];
    onChange(final);
    submitTimer.current = window.setTimeout(
      () => onSubmit?.(final),
      AUTO_SUBMIT_DELAY_MS,
    );
  };
  const doneOpt = finalOpts.find((o) => o.correct);

  return (
    <Box
      data-tutorial="prize-trap"
      sx={{
        background: P.bg,
        color: P.ink,
        borderRadius: "24px",
        p: { xs: 1.5, md: 2.5 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) 300px" },
        }}
      >
        {/* ───────── чат / финал ───────── */}
        <Box sx={{ minWidth: 0 }}>
          {phase === "chat" && (
            <>
              <Box
                sx={{
                  height: { xs: 440, md: 520 },
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1.5px solid #E6DEFA",
                  boxShadow: "0 18px 40px rgba(124,77,255,.14)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 2,
                    py: 1.25,
                    background: `linear-gradient(135deg,${P.violet},${P.pink})`,
                    color: "#fff",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,.25)",
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
                    <Typography fontSize={11.5} sx={{ opacity: 0.85 }}>
                      {typing ? "печатает…" : "в сети"}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography fontSize={10.5} sx={{ opacity: 0.85 }}>
                      приз закрепится за тобой
                    </Typography>
                    <Typography
                      fontWeight={900}
                      fontSize={16}
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      ⏳ {fmtTime(secs)}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  ref={scroller}
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    bgcolor: "#FAF8FF",
                  }}
                >
                  {msgs.map((m) => (
                    <Box
                      key={m.uid}
                      sx={{
                        alignSelf: m.from === "me" ? "flex-end" : "flex-start",
                        maxWidth: "84%",
                        px: 1.75,
                        py: 1,
                        fontSize: 14,
                        lineHeight: 1.45,
                        borderRadius:
                          m.from === "me"
                            ? "16px 16px 4px 16px"
                            : "16px 16px 16px 4px",
                        color: m.from === "me" ? "#fff" : P.ink,
                        background:
                          m.from === "me"
                            ? `linear-gradient(135deg,${P.violet},#9B6DFF)`
                            : "#fff",
                        border: m.from === "me" ? "none" : "1px solid #E6DEFA",
                        animation: `${pop} .28s both`,
                        ...rm,
                      }}
                    >
                      {m.text}
                    </Box>
                  ))}
                  {typing && (
                    <Box
                      sx={{
                        alignSelf: "flex-start",
                        display: "flex",
                        gap: 0.6,
                        px: 1.75,
                        py: 1.3,
                        bgcolor: "#fff",
                        border: "1px solid #E6DEFA",
                        borderRadius: "16px 16px 16px 4px",
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: P.violet,
                            animation: `${dot} 1s ${i * 0.15}s infinite`,
                            ...rm,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  border: "1.5px solid #E6DEFA",
                  display: "grid",
                  gap: 1,
                  minHeight: 64,
                }}
              >
                <Typography fontSize={12.5} sx={{ color: P.dim }}>
                  Запрос {Math.min(idx + 1, reqs.length)} из {reqs.length}
                  {awaiting && req ? ` · ${req.icon} ${req.label}` : ""}
                </Typography>
                {awaiting && req ? (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1,
                      animation: `${pop} .3s both`,
                      ...rm,
                    }}
                  >
                    <Btn
                      color={P.green}
                      disabled={busy}
                      onClick={() => decide("send")}
                    >
                      📤 Отправить: {req.value}
                    </Btn>
                    <Btn
                      color={P.red}
                      disabled={busy}
                      onClick={() => decide("refuse")}
                    >
                      🛡 Не отправлять
                    </Btn>
                    {!askedWhy.includes(req.id) && (
                      <Btn color="#5B4B8A" disabled={busy} onClick={askWhy}>
                        🤔 Спросить, зачем это нужно
                      </Btn>
                    )}
                  </Box>
                ) : (
                  <Typography fontSize={13} sx={{ color: P.dim }}>
                    Организатор пишет…
                  </Typography>
                )}
              </Box>
            </>
          )}

          {phase === "final" && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: "20px",
                bgcolor: "#fff",
                border: "1.5px solid #E6DEFA",
                animation: `${pop} .4s both`,
                ...rm,
              }}
            >
              <Typography fontWeight={900} fontSize={18} sx={{ mb: 0.5 }}>
                {finalQ.text}
              </Typography>
              <Typography
                fontSize={13.5}
                sx={{ color: P.dim, mb: 1.5, lineHeight: 1.5 }}
              >
                Смотри в досье справа: вот что мошенник узнал о тебе. Как нужно
                было поступить с самого начала?
              </Typography>
              <Box sx={{ display: "grid", gap: 1 }}>
                {finalOpts.map((o) => (
                  <Btn
                    key={o.id}
                    color="#4B3A7A"
                    disabled={finalWrong.some((w) => w.id === o.id)}
                    onClick={() => pickFinal(o)}
                  >
                    {o.label}
                  </Btn>
                ))}
              </Box>
              {finalWrong.length > 0 && (
                <Typography
                  fontSize={13.5}
                  sx={{
                    mt: 1.5,
                    color: "#B45309",
                    lineHeight: 1.5,
                    animation: `${shake} .4s`,
                    ...rm,
                  }}
                >
                  🤔 {finalWrong[finalWrong.length - 1].explain} Попробуй ещё
                  раз.
                </Typography>
              )}
            </Box>
          )}

          {phase === "done" && doneOpt && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: "20px",
                bgcolor: "#fff",
                border: `1.5px solid ${P.green}`,
                animation: `${pop} .4s both`,
                ...rm,
              }}
            >
              <Typography
                fontWeight={900}
                fontSize={18}
                sx={{ color: "#0B7A59" }}
              >
                ✅ Именно так
              </Typography>
              <Typography fontSize={14} sx={{ mt: 0.75, lineHeight: 1.55 }}>
                {doneOpt.explain}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
                {[
                  `🔓 Утечка данных: ${leak}%`,
                  `⚠️ Угроз открыто: ${unlocked.length} из ${threats.length}`,
                  `🛡 Отказов: ${Object.values(decisions).filter((d) => d === "refuse").length}`,
                ].map((t) => (
                  <Box
                    key={t}
                    sx={{
                      px: 1.5,
                      py: 0.6,
                      borderRadius: 99,
                      bgcolor: "#F4EEFF",
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
              <Typography fontWeight={800} fontSize={14} sx={{ mb: 0.5 }}>
                Если уже отправил что-то из этого
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, pl: 2.5, fontSize: 13.5, lineHeight: 1.7 }}
              >
                {(c.whatToDo || []).map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </Box>
              <Typography fontSize={12.5} sx={{ mt: 2, color: P.dim }}>
                Сохраняем результат…
              </Typography>
            </Box>
          )}
        </Box>

        {/* ───────── досье ───────── */}
        <Box
          sx={{
            borderRadius: "20px",
            bgcolor: P.dark,
            color: "#EDE7FF",
            p: 2,
            alignSelf: "start",
            boxShadow: "0 18px 40px rgba(27,22,48,.35)",
          }}
        >
          <Typography
            fontSize={10.5}
            sx={{ letterSpacing: "0.16em", color: "#FF8FB3", fontWeight: 800 }}
          >
            ДОСЬЕ · ГЛАЗАМИ МОШЕННИКА
          </Typography>
          <Typography fontWeight={900} fontSize={17} sx={{ mb: 1.25 }}>
            Что он знает о тебе
          </Typography>

          <Box sx={{ display: "grid", gap: 0.7 }}>
            {reqs.map((r) => {
              const d = decisions[r.id];
              const sent = d === "send";
              return (
                <Box
                  key={r.id}
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.25,
                    py: 0.8,
                    borderRadius: "10px",
                    bgcolor: sent
                      ? r.kind === "danger"
                        ? "rgba(229,72,77,.22)"
                        : "rgba(255,255,255,.1)"
                      : "rgba(255,255,255,.05)",
                    border: `1px solid ${d === "refuse" ? "rgba(18,184,134,.5)" : "rgba(255,255,255,.08)"}`,
                    transition: "background .4s",
                  }}
                >
                  <Box sx={{ fontSize: 16, width: 22 }}>{r.icon}</Box>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography fontSize={10.5} sx={{ color: "#A99BD6" }}>
                      {r.label}
                    </Typography>
                    {sent ? (
                      <Typography
                        fontSize={13}
                        fontWeight={700}
                        sx={{
                          animation: `${pop} .4s both`,
                          wordBreak: "break-word",
                          ...rm,
                        }}
                      >
                        {r.value}
                      </Typography>
                    ) : d === "refuse" ? (
                      <Typography
                        fontSize={12.5}
                        sx={{ color: "#5BE0B3", fontWeight: 700 }}
                      >
                        🛡 не отдал
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          height: 12,
                          mt: 0.4,
                          width: "70%",
                          borderRadius: 3,
                          bgcolor: "rgba(255,255,255,.18)",
                        }}
                      />
                    )}
                  </Box>
                  {sent && r.kind === "danger" && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 6,
                        top: 4,
                        px: 0.6,
                        border: "2px solid #FF6B70",
                        borderRadius: "4px",
                        color: "#FF6B70",
                        fontSize: 9.5,
                        fontWeight: 900,
                        animation: `${slam} .4s both`,
                        ...rm,
                      }}
                    >
                      ПОЛУЧЕНО
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ mt: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <Typography fontSize={12.5} fontWeight={800}>
                Уровень утечки
              </Typography>
              <Typography
                fontSize={20}
                fontWeight={900}
                sx={{ color: leakColor, transition: "color .4s" }}
              >
                {leakShown}%
              </Typography>
            </Box>
            <Box
              sx={{
                mt: 0.5,
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,.12)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${leak}%`,
                  bgcolor: leakColor,
                  borderRadius: 4,
                  transition: "width .7s, background .5s",
                }}
              />
            </Box>
          </Box>

          <Typography
            fontSize={12.5}
            fontWeight={800}
            sx={{ mt: 1.75, mb: 0.75 }}
          >
            Что с этим можно сделать
          </Typography>
          <Box sx={{ display: "grid", gap: 0.6 }}>
            {threats.map((t) => {
              const on = unlocked.some((u) => u.id === t.id);
              return (
                <Box
                  key={t.id}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    px: 1.25,
                    py: 0.8,
                    borderRadius: "10px",
                    fontSize: 12.5,
                    lineHeight: 1.4,
                    bgcolor: on
                      ? "rgba(229,72,77,.2)"
                      : "rgba(255,255,255,.04)",
                    color: on ? "#fff" : "#7F74A6",
                    border: `1px solid ${on ? "#FF6B70" : "rgba(255,255,255,.06)"}`,
                    animation: on
                      ? `${shake} .45s, ${pulseRed} 2s .5s 2`
                      : undefined,
                    transition: "all .4s",
                    ...rm,
                  }}
                >
                  <span>{on ? t.icon : "🔒"}</span>
                  <span>{on ? t.text : "Закрыто — пока ты это не отдал"}</span>
                </Box>
              );
            })}
          </Box>
          {dangerReqs.length > 0 &&
            phase === "chat" &&
            leak === 0 &&
            Object.keys(decisions).length > 0 && (
              <Typography fontSize={12} sx={{ mt: 1.25, color: "#5BE0B3" }}>
                Пока мошенник ничего не получил 🛡
              </Typography>
            )}
        </Box>
      </Box>
    </Box>
  );
}
