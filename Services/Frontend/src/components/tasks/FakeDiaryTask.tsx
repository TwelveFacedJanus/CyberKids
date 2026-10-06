// components/tasks/FakeDiaryTask.tsx
// «Дневник-двойник»: SMS → разбор адреса → осмотр страницы → решение → последствия → тест на адреса
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import type { TaskComponentProps } from "./taskUtils";
import type { Answer } from "../../types";
import {
  AUTO_SUBMIT_DELAY_MS,
  fmtTime,
  pop,
  rm,
  shake,
  shuffle,
  slideDown,
  bob,
  blink,
  pulseRed,
  useCountUp,
  type SpotState,
} from "./school_trap/kit";

const KEY = "fake_diary_result";

interface UrlPart {
  id: string;
  text: string;
  kind: "scheme" | "bait" | "domain" | "path";
  why: string;
}
interface Hot {
  id: string;
  kind: "logo" | "badge" | "timer" | "field" | "link";
  label: string;
  hint?: string;
  flag?: string;
}
interface Opt {
  id: string;
  label: string;
  outcome: "safe" | "danger";
  conseq?: string;
  lesson: string;
}
interface Conseq {
  title: string;
  lines: string[];
  msgs: { who: string; text: string }[];
  counterLabel: string;
  counterTo: number;
  outro: string;
}
interface QuizItem {
  id: string;
  url: string;
  host: string;
  real: boolean;
  explain: string;
}
type Phase = "sms" | "url" | "page" | "decide" | "conseq" | "lesson" | "quiz";

const P = {
  bg: "linear-gradient(160deg,#E9F1FF,#F5EEFF)",
  ink: "#17203A",
  blue: "#2F6BFF",
  red: "#E5484D",
  amber: "#F5A524",
  green: "#12B886",
  dim: "#6B7494",
};

function Btn({
  children,
  onClick,
  disabled,
  color = P.blue,
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
          bgcolor: "rgba(23,32,58,.08)",
          color: "rgba(23,32,58,.4)",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

/* ── обёртка для интерактивного элемента страницы ── */
function Spot({
  h,
  st,
  active,
  onTap,
  children,
}: {
  h: Hot;
  st?: SpotState;
  active: boolean;
  onTap: () => void;
  children: React.ReactNode;
}) {
  const tappable = active && !st;
  return (
    <Box sx={{ mb: { xs: 1.25, sm: 2 } }}>
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
          position: "relative",
          borderRadius: { xs: 1.5, sm: `4px` },
          transition: "outline-color .2s",
          outlineOffset: 3,
          outline:
            st === "found"
              ? `2px solid ${P.red}`
              : st === "missed"
                ? `2px solid ${P.amber}`
                : tappable
                  ? "2px dashed rgba(47,107,255,.4)"
                  : "2px solid transparent",
          cursor: tappable ? "crosshair" : "default",
          animation: st === "ok" ? `${shake} .4s` : undefined,
          ...rm,
          "&:hover": tappable ? { outlineColor: P.blue } : undefined,
          "&:focus-visible": { outline: `2px solid ${P.blue}` },
        }}
      >
        {children}
        {(st === "found" || st === "missed") && (
          <Box
            sx={{
              position: "absolute",
              top: -10,
              right: -8,
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: st === "found" ? P.red : P.amber,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 900,
              animation: `${pop} .3s both`,
              ...rm,
            }}
          >
            !
          </Box>
        )}
      </Box>
      {st === "found" && h.flag && (
        <Typography
          fontSize={12.5}
          sx={{
            mt: 0.75,
            color: P.red,
            lineHeight: 1.4,
            fontWeight: 700,
            animation: `${pop} .3s both`,
            ...rm,
          }}
        >
          ⚠️ {h.flag}
        </Typography>
      )}
      {st === "missed" && h.flag && (
        <Typography
          fontSize={12.5}
          sx={{
            mt: 0.75,
            color: "#B7791F",
            lineHeight: 1.4,
            animation: `${pop} .3s both`,
            ...rm,
          }}
        >
          👀 Ты пропустил: {h.flag}
        </Typography>
      )}
      {st === "ok" && (
        <Typography
          fontSize={12.5}
          sx={{ mt: 0.75, color: P.dim, animation: `${pop} .3s both`, ...rm }}
        >
          Обычный элемент — сам по себе он ничего не доказывает.
        </Typography>
      )}
    </Box>
  );
}

/* ── последствия ── */
function ConseqOverlay({ data, onBack }: { data: Conseq; onBack: () => void }) {
  const L = data.lines.length,
    M = data.msgs.length;
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setStep((s) => (s >= L + M + 2 ? s : s + 1)),
      650,
    );
    return () => clearInterval(t);
  }, [L, M]);
  const count = useCountUp(step > L + M ? data.counterTo : 0, 1800);
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 6,
        bgcolor: "rgba(8,12,26,.97)",
        color: "#C8F7DC",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        overflowY: "auto",
        p: 2.5,
      }}
    >
      <Typography
        fontWeight={900}
        fontSize={17}
        sx={{ color: "#FF6B70", mb: 1.5, fontFamily: "inherit" }}
      >
        🚨 {data.title}
      </Typography>
      {data.lines.slice(0, step).map((l, i) => (
        <Typography
          key={i}
          fontSize={13}
          sx={{
            fontFamily: "inherit",
            lineHeight: 1.8,
            animation: `${pop} .25s both`,
            ...rm,
          }}
        >
          {l}
        </Typography>
      ))}
      <Box
        sx={{
          mt: 1.5,
          display: "grid",
          gap: 0.8,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {data.msgs.slice(0, Math.max(0, step - L)).map((m, i) => (
          <Box
            key={i}
            sx={{
              maxWidth: 420,
              p: 1.2,
              borderRadius: "12px 12px 12px 4px",
              bgcolor: "#1E2A4A",
              color: "#fff",
              fontSize: 13,
              animation: `${pop} .3s both`,
              ...rm,
            }}
          >
            <b style={{ color: "#8FB4FF" }}>{m.who}</b>
            <div>{m.text}</div>
          </Box>
        ))}
      </Box>
      {step > L + M && (
        <Box
          sx={{
            mt: 2,
            fontFamily: "system-ui, sans-serif",
            animation: `${pop} .4s both`,
            ...rm,
          }}
        >
          <Typography
            fontSize={40}
            fontWeight={900}
            sx={{ color: "#FF6B70", lineHeight: 1 }}
          >
            {count}
          </Typography>
          <Typography fontSize={13} sx={{ color: "#9AA6C8" }}>
            {data.counterLabel}
          </Typography>
        </Box>
      )}
      {step > L + M + 1 && (
        <Box
          sx={{
            mt: 2,
            fontFamily: "system-ui, sans-serif",
            animation: `${pop} .4s both`,
            ...rm,
          }}
        >
          <Typography
            fontSize={13.5}
            sx={{ color: "#E8ECFF", lineHeight: 1.55, mb: 1.5 }}
          >
            {data.outro}
          </Typography>
          <Btn
            color={P.green}
            onClick={onBack}
            sx={{ width: "100%", justifyContent: "center" }}
          >
            ↩ Вернуться и выбрать иначе
          </Btn>
        </Box>
      )}
    </Box>
  );
}

/* ── основной компонент ── */
type Props = TaskComponentProps & { onSubmit?: (a: Answer[]) => void };

export default function FakeDiaryTask({
  content,
  answers,
  onChange,
  onSubmit,
}: Props) {
  const c = content as any;
  const sms = c.sms;
  const parts: UrlPart[] = c.urlParts || [];
  const hots: Hot[] = c.hotspots || [];
  const opts: Opt[] = useMemo(() => shuffle(c.options || []), [c.options]);
  const conseqs: Record<string, Conseq> = c.consequences || {};
  const quiz: QuizItem[] = c.quiz || [];
  const minFlags: number = c.minFlags ?? 4;
  const flagIds = hots.filter((h) => h.flag).map((h) => h.id);

  const [phase, setPhase] = useState<Phase>("sms");
  const [notif, setNotif] = useState(false);
  const [urlTap, setUrlTap] = useState<Record<string, boolean>>({});
  const [urlMsg, setUrlMsg] = useState<string>("");
  const [urlSolved, setUrlSolved] = useState(false);
  const [urlFirst, setUrlFirst] = useState<boolean | null>(null);
  const [spot, setSpot] = useState<Record<string, SpotState>>({});
  const [spotDone, setSpotDone] = useState(false);
  const [secs, setSecs] = useState<number>(c.timerStart ?? 299);
  const [tried, setTried] = useState<string[]>([]);
  const [firstOpt, setFirstOpt] = useState<Opt | null>(null);
  const [pick, setPick] = useState<Opt | null>(null);
  const [conseq, setConseq] = useState<string | null>(null);
  const [qAns, setQAns] = useState<Record<string, "real" | "fake">>({});
  const [sent, setSent] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (phase !== "sms") return;
    const t = setTimeout(() => setNotif(true), 900);
    return () => clearTimeout(t);
  }, [phase]);
  useEffect(() => {
    if (phase !== "page" && phase !== "decide") return;
    const t = setInterval(
      () => setSecs((s) => (s <= 0 ? (c.timerStart ?? 299) : s - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, [phase, c.timerStart]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const found = Object.values(spot).filter((v) => v === "found").length;
  const wrongTaps = Object.values(spot).filter((v) => v === "ok").length;
  const need = Math.min(minFlags, flagIds.length);

  const tapUrl = (p: UrlPart) => {
    if (urlSolved) return;
    if (urlFirst === null) setUrlFirst(p.kind === "domain");
    setUrlTap((t) => ({ ...t, [p.id]: true }));
    setUrlMsg(p.why);
    if (p.kind === "domain") setUrlSolved(true);
  };
  const tapSpot = (h: Hot) =>
    !spot[h.id] &&
    !spotDone &&
    setSpot((s) => ({ ...s, [h.id]: h.flag ? "found" : "ok" }));
  const finishSpot = () => {
    const next = { ...spot };
    hots.forEach((h) => {
      if (h.flag && !next[h.id]) next[h.id] = "missed";
    });
    setSpot(next);
    setSpotDone(true);
  };
  const choose = (o: Opt) => {
    if (!firstOpt) setFirstOpt(o);
    setTried((t) => [...t, o.id]);
    setPick(o);
    if (o.outcome === "danger" && o.conseq) {
      setConseq(o.conseq);
      setPhase("conseq");
    } else setPhase("lesson");
  };
  const answerQuiz = (q: QuizItem, a: "real" | "fake") => {
    if (qAns[q.id]) return;
    const next = { ...qAns, [q.id]: a };
    setQAns(next);
    if (Object.keys(next).length === quiz.length) {
      const quizCorrect = quiz.filter(
        (x) => (next[x.id] === "real") === x.real,
      ).length;
      const final: Answer[] = [
        ...answers.filter((x: any) => x.key !== KEY),
        {
          key: KEY,
          value: {
            urlFirstCorrect: urlFirst,
            urlTaps: Object.keys(urlTap).length,
            flagsFound: Object.keys(spot).filter((k) => spot[k] === "found"),
            flagsTotal: flagIds.length,
            wrongTaps,
            firstChoice: firstOpt?.id,
            firstOutcome: firstOpt?.outcome,
            tried,
            quiz: next,
            quizCorrect,
            quizTotal: quiz.length,
          },
        } as Answer,
      ];
      onChange(final);
      setSent(true);
      timer.current = window.setTimeout(
        () => onSubmit?.(final),
        AUTO_SUBMIT_DELAY_MS,
      );
    }
  };

  const steps = ["Сообщение", "Адрес", "Страница", "Решение", "Проверка"];
  const stepIdx = {
    sms: 0,
    url: 1,
    page: 2,
    decide: 3,
    conseq: 3,
    lesson: 3,
    quiz: 4,
  }[phase];
  const quizDone = Object.keys(qAns).length === quiz.length;
  const quizCorrect = quiz.filter(
    (x) => (qAns[x.id] === "real") === x.real,
  ).length;

  /* ── элементы страницы-подделки ── */
  const renderHot = (h: Hot) => {
    const active = phase === "page" && !spotDone;
    const w = (child: React.ReactNode) => (
      <Spot
        key={h.id}
        h={h}
        st={spot[h.id]}
        active={active}
        onTap={() => tapSpot(h)}
      >
        {child}
      </Spot>
    );
    if (h.kind === "badge")
      return w(
        <Box
          sx={{
            display: "inline-flex",
            gap: 1,
            px: 1.5,
            py: { xs: 0.6, sm: 0.8 },
            borderRadius: 99,
            bgcolor: "#E7F8F1",
            color: "#0B7A59",
            fontSize: { xs: 16, sm: 20 },
            fontWeight: 700,
          }}
        >
          🔒 {h.label}
        </Box>,
      );
    if (h.kind === "timer")
      return w(
        <Box
          sx={{
            p: 1.1,
            borderRadius: "10px",
            bgcolor: "#FFF1F1",
            color: P.red,
            fontWeight: 800,
            fontSize: { xs: 16, sm: 20 },
            display: "flex",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              mt: 0.7,
              borderRadius: "50%",
              bgcolor: P.red,
              flexShrink: 0,
              animation: `${blink} 1s infinite`,
              ...rm,
            }}
          />
          ⏳ {h.label.replace("{t}", fmtTime(secs))}
        </Box>,
      );
    if (h.kind === "link")
      return w(
        <Typography
          sx={{
            color: P.blue,
            textDecoration: "underline",
            fontSize: { xs: 16, sm: 20 },
          }}
        >
          {h.label}
        </Typography>,
      );
    return w(
      <Box>
        <Typography
          sx={{
            color: P.dim,
            mb: 0.4,
            fontWeight: 600,
            fontSize: { xs: 16, sm: 20 },
          }}
        >
          {h.label}
        </Typography>
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: "10px",
            border: "1.5px solid #D5DBEE",
            bgcolor: "#fff",
            color: "#A3ABC7",
            fontSize: { xs: 14, sm: 20 },
          }}
        >
          {h.hint}
        </Box>
      </Box>,
    );
  };
  const pageBody = (
    <Box>
      <Box sx={{ px: 2, py: 1.25, bgcolor: "#1E5EFF", color: "#fff" }}>
        {hots
          .filter((h) => h.kind === "logo")
          .map((h) => (
            <Box
              key={h.id}
              sx={{
                "& [role=button]": { outlineColor: "rgba(255,255,255,.7)" },
              }}
            >
              <Spot
                h={h}
                st={spot[h.id]}
                active={phase === "page" && !spotDone}
                onTap={() => tapSpot(h)}
              >
                <Typography fontWeight={900} fontSize={16}>
                  📘 {h.label}
                </Typography>
              </Spot>
            </Box>
          ))}
      </Box>
      <Box sx={{ p: 2 }}>
        {hots
          .filter((h) => h.kind === "badge" || h.kind === "timer")
          .map(renderHot)}
        <Box
          sx={{
            p: 2,
            borderRadius: "16px",
            bgcolor: "#F6F8FF",
            border: "1px solid #E1E7FA",
            mt: 1,
          }}
        >
          <Typography
            fontWeight={800}
            sx={{ mb: 0.5, fontSize: { xs: 16, sm: 20 } }}
          >
            {c.pageTitle}
          </Typography>
          <Typography
            fontWeight={900}
            sx={{
              filter: "blur(7px)",
              userSelect: "none",
              mb: 1.5,
              fontSize: { xs: 20, sm: 26 },
            }}
          >
            algebra: 5
          </Typography>
          {hots.filter((h) => h.kind === "field").map(renderHot)}
          <Box
            sx={{
              mt: 1.5,
              py: 1.2,
              textAlign: "center",
              borderRadius: "12px",
              bgcolor: P.blue,
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {c.pageButton}
          </Box>
        </Box>
        <Box sx={{ mt: 1.5 }}>
          {hots.filter((h) => h.kind === "link").map(renderHot)}
        </Box>
      </Box>
    </Box>
  );

  /* ── адресная строка ── */
  const bar = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.9,
        borderRadius: 99,
        bgcolor: "#fff",
        border: "1.5px solid #D5DBEE",
        overflowX: "auto",
        whiteSpace: "nowrap",
        fontSize: 20,
        fontFamily: "ui-monospace, Menlo, monospace",
      }}
    >
      <span>🔒</span>
      <Box component="span" sx={{ display: "inline-flex" }}>
        {parts.map((p) => {
          const interactive = phase === "url" && !urlSolved;
          const solved = urlSolved && phase === "url";
          const isDomain = p.kind === "domain";
          return (
            <Box
              key={p.id}
              component="span"
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              onClick={interactive ? () => tapUrl(p) : undefined}
              onKeyDown={
                interactive
                  ? (e: React.KeyboardEvent) =>
                      (e.key === "Enter" || e.key === " ") && tapUrl(p)
                  : undefined
              }
              sx={{
                px: 0.3,
                borderRadius: "6px",
                transition: "all .3s",
                color: p.kind === "scheme" || p.kind === "path" ? P.dim : P.ink,
                bgcolor:
                  solved && isDomain
                    ? "#FFE58A"
                    : urlTap[p.id] && !isDomain
                      ? "rgba(229,72,77,.15)"
                      : "transparent",
                fontWeight: solved && isDomain ? 800 : 500,
                opacity: solved && !isDomain ? 0.4 : 1,
                cursor: interactive ? "pointer" : "default",
                outline: interactive
                  ? "1.5px dashed rgba(47,107,255,.45)"
                  : "none",
                mr: interactive ? 0.4 : 0,
                animation:
                  urlTap[p.id] && !isDomain && !urlSolved
                    ? `${shake} .4s`
                    : undefined,
                ...rm,
                "&:hover": interactive
                  ? { bgcolor: "rgba(47,107,255,.12)" }
                  : undefined,
              }}
            >
              {p.text}
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const showBrowser = phase !== "sms" && phase !== "quiz";

  return (
    <Box
      data-tutorial="fake-diary"
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
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 0.75,
          mb: 2,
        }}
      >
        {steps.map((l, i) => (
          <Box key={l}>
            <Box
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: i <= stepIdx ? P.blue : "rgba(23,32,58,.12)",
                transition: "background .4s",
              }}
            />
            <Typography
              fontSize={11}
              sx={{
                mt: 0.5,
                fontWeight: i === stepIdx ? 800 : 500,
                color: i === stepIdx ? P.ink : P.dim,
                display: { xs: i === stepIdx ? "block" : "none", sm: "block" },
              }}
            >
              {l}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── телефон с SMS ── */}
      {phase === "sms" && (
        <Box
          sx={{
            mx: "auto",
            width: "15vw",
            height: "52vh",
            borderRadius: "38px",
            p: 1.2,
            bgcolor: "#0E1224",
            boxShadow: "0 30px 60px rgba(23,32,58,.3)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: "100%",
              borderRadius: "30px",
              overflow: "hidden",
              color: "#fff",
              textAlign: "center",
              pt: 6,
              background: "linear-gradient(170deg,#3A57E8,#8B5CF6 60%,#EC6AA6)",
            }}
          >
            <Typography fontSize={52} fontWeight={300} sx={{ lineHeight: 1 }}>
              {sms.time}
            </Typography>
            <Typography fontSize={13} sx={{ opacity: 0.85, mt: 0.5 }}>
              {sms.date}
            </Typography>
            {notif && (
              <Box
                role="button"
                tabIndex={0}
                onClick={() => setPhase("url")}
                onKeyDown={(e) => e.key === "Enter" && setPhase("url")}
                sx={{
                  position: "absolute",
                  left: 10,
                  right: 10,
                  top: 170,
                  textAlign: "left",
                  p: 1.5,
                  borderRadius: "18px",
                  bgcolor: "rgba(255,255,255,.92)",
                  color: P.ink,
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  animation: `${slideDown} .5s both, ${pulseRed} 2s 1s infinite`,
                  ...rm,
                }}
              >
                <Typography
                  fontSize={11.5}
                  sx={{ color: P.dim, fontWeight: 700 }}
                >
                  💬 {sms.from} · сейчас
                </Typography>
                <Typography fontSize={13.5} sx={{ mt: 0.4, lineHeight: 1.45 }}>
                  {sms.text}{" "}
                  <span
                    style={{
                      color: P.blue,
                      textDecoration: "underline",
                      wordBreak: "break-all",
                    }}
                  >
                    {sms.link}
                  </span>
                </Typography>
              </Box>
            )}
            {notif && (
              <Typography
                fontSize={12}
                sx={{
                  position: "absolute",
                  bottom: 22,
                  left: 0,
                  right: 0,
                  opacity: 0.9,
                  animation: `${bob} 1.6s infinite`,
                  ...rm,
                }}
              >
                Нажми на уведомление ☝️
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* ── браузер ── */}
      {showBrowser && (
        <Box sx={{ maxWidth: { xs: "100%", sm: 840 }, mx: "auto" }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              bgcolor: "#fff",
              border: "1.5px solid #D5DBEE",
              boxShadow: "0 20px 50px rgba(47,70,160,.18)",
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 1,
                bgcolor: "#EEF1FA",
                borderBottom: "1px solid #D5DBEE",
              }}
            >
              <Box sx={{ display: "flex", gap: 0.7, mb: 1 }}>
                {["#FF6B70", "#F5A524", "#37C98B"].map((x) => (
                  <Box
                    key={x}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: x,
                    }}
                  />
                ))}
              </Box>
              {bar}
            </Box>
            <Box
              sx={{
                height: { xs: 380, md: 430 },
                overflowY: "auto",
                filter: phase === "url" ? "blur(3px)" : "none",
                pointerEvents: phase === "url" ? "none" : "auto",
                transition: "filter .5s",
              }}
            >
              {pageBody}
            </Box>
            {phase === "conseq" && conseq && conseqs[conseq] && (
              <ConseqOverlay
                data={conseqs[conseq]}
                onBack={() => {
                  setPick(null);
                  setConseq(null);
                  setPhase("decide");
                }}
              />
            )}
          </Box>

          {/* панель действий */}
          <Box
            sx={{
              mt: 1.5,
              p: 1.75,
              borderRadius: "16px",
              bgcolor: "#fff",
              border: "1px solid #E1E7FA",
              display: "grid",
              gap: 1,
            }}
          >
            {phase === "url" && (
              <>
                <Typography fontWeight={800} fontSize={14.5}>
                  {c.urlQuestion}
                </Typography>
                {urlMsg && (
                  <Typography
                    fontSize={20}
                    sx={{
                      lineHeight: 1.5,
                      color: urlSolved ? "#0B7A59" : P.red,
                      animation: `${pop} .3s both`,
                      ...rm,
                    }}
                  >
                    {urlSolved ? "✅ " : "🤔 "}
                    {urlMsg}
                  </Typography>
                )}
                {urlSolved && (
                  <Btn
                    onClick={() => setPhase("page")}
                    sx={{
                      justifyContent: "center",
                      fontSize: 20,
                      animation: `${pop} .4s both`,
                      ...rm,
                    }}
                  >
                    Дальше: осмотреть страницу
                  </Btn>
                )}
              </>
            )}
            {phase === "page" && (
              <>
                <Typography fontSize={13.5}>
                  🔎 {c.spotHint} <b>Найдено: {found}</b> из {flagIds.length}
                  {wrongTaps > 0 && ` · лишних нажатий: ${wrongTaps}`}
                </Typography>
                {!spotDone ? (
                  <Btn
                    disabled={found < need}
                    onClick={finishSpot}
                    sx={{ justifyContent: "center", fontSize: 20 }}
                  >
                    {found < need
                      ? `Найди ещё ${need - found}`
                      : "Проверить себя"}
                  </Btn>
                ) : (
                  <Btn
                    onClick={() => setPhase("decide")}
                    color={P.green}
                    sx={{
                      fontSize: 20,
                      justifyContent: "center",
                      animation: `${pop} .4s both`,
                      ...rm,
                    }}
                  >
                    Дальше: что делать?
                  </Btn>
                )}
              </>
            )}
            {phase === "decide" && (
              <>
                <Typography fontWeight={800}>{c.decideQuestion}</Typography>
                {opts.map((o) => (
                  <Btn
                    key={o.id}
                    color="#3C4A7A"
                    onClick={() => choose(o)}
                    sx={{ fontSize: 16 }}
                  >
                    {o.label}
                    {tried.includes(o.id) ? "  · уже пробовал" : ""}
                  </Btn>
                ))}
              </>
            )}
            {phase === "lesson" && pick && (
              <Box sx={{ animation: `${pop} .3s both`, ...rm }}>
                <Typography
                  fontWeight={800}
                  fontSize={15}
                  sx={{ color: "#0B7A59", mb: 0.5 }}
                >
                  ✅ Хороший ход
                </Typography>
                <Typography fontSize={13.5} sx={{ lineHeight: 1.55, mb: 1.5 }}>
                  {pick.lesson}
                </Typography>
                <Typography fontWeight={800} fontSize={14} sx={{ mb: 0.75 }}>
                  Как проверить ссылку за 3 секунды
                </Typography>
                <Box sx={{ display: "grid", gap: 0.8, mb: 1.5 }}>
                  {(c.rules || []).map((r: string, i: number) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        gap: 1.25,
                        fontSize: 16,
                        lineHeight: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          flexShrink: 0,
                          borderRadius: "50%",
                          bgcolor: P.blue,
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        {i + 1}
                      </Box>
                      {r}
                    </Box>
                  ))}
                </Box>
                <Btn
                  onClick={() => setPhase("quiz")}
                  sx={{ width: "100%", justifyContent: "center", fontSize: 20 }}
                >
                  Дальше: проверь свои навыки
                </Btn>
              </Box>
            )}
            {phase === "conseq" && conseq && conseqs[conseq] && (
              <>
                <Typography fontWeight={800} fontSize={14.5}>
                  {c.conseqTitle}
                </Typography>
                <Typography fontSize={13.5} sx={{ lineHeight: 1.55, mt: 0.75 }}>
                  {conseqs[conseq].outro}
                </Typography>
                <Btn
                  onClick={() => {
                    setPick(null);
                    setConseq(null);
                    setPhase("decide");
                  }}
                  sx={{ width: "100%", justifyContent: "center", mt: 1.5 }}
                >
                  Вернуться и выбрать иначе
                </Btn>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* ── тест на адреса ── */}
      {phase === "quiz" && (
        <Box sx={{ maxWidth: 640, mx: "auto", display: "grid", gap: 1.25 }}>
          <Typography
            fontWeight={900}
            fontSize={18}
            sx={{ textAlign: "center" }}
          >
            {c.quizTitle}
          </Typography>
          {quiz.map((q) => {
            const a = qAns[q.id];
            const ok = a ? (a === "real") === q.real : null;
            const at = q.url.indexOf(q.host);
            return (
              <Box
                key={q.id}
                sx={{
                  p: 1.75,
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  border: `1.5px solid ${ok === null ? "#E1E7FA" : ok ? P.green : P.red}`,
                  animation: `${pop} .35s both`,
                  transition: "border-color .3s",
                  ...rm,
                }}
              >
                <Box
                  sx={{
                    fontFamily: "ui-monospace, Menlo, monospace",
                    fontSize: 18,
                    wordBreak: "break-all",
                    fontWeight: 700,
                  }}
                >
                  {a && at >= 0 ? (
                    <>
                      {q.url.slice(0, at)}
                      <mark
                        style={{
                          background: "#FFE58A",
                          padding: "0 2px",
                          borderRadius: 4,
                          fontWeight: 800,
                        }}
                      >
                        {q.host}
                      </mark>
                      {q.url.slice(at + q.host.length)}
                    </>
                  ) : (
                    q.url
                  )}
                </Box>
                {!a ? (
                  <Box sx={{ display: "flex", gap: 1, mt: 1.25 }}>
                    <Btn
                      color={P.green}
                      onClick={() => answerQuiz(q, "real")}
                      sx={{ flex: 1, justifyContent: "center" }}
                    >
                      ✅ Настоящий
                    </Btn>
                    <Btn
                      color={P.red}
                      onClick={() => answerQuiz(q, "fake")}
                      sx={{ flex: 1, justifyContent: "center" }}
                    >
                      🚫 Подделка
                    </Btn>
                  </Box>
                ) : (
                  <Typography
                    fontSize={13}
                    sx={{
                      mt: 1,
                      lineHeight: 1.5,
                      color: ok ? "#0B7A59" : P.red,
                      fontWeight: 700,
                    }}
                  >
                    {ok ? "✅ Верно. " : "🤔 Не совсем. "}
                    {q.explain}
                  </Typography>
                )}
              </Box>
            );
          })}
          {quizDone && (
            <Box
              sx={{
                p: 2.25,
                borderRadius: "18px",
                bgcolor: "#fff",
                border: `1.5px solid ${P.blue}`,
                textAlign: "center",
                animation: `${pop} .4s both`,
                ...rm,
              }}
            >
              <Typography fontSize={34}>
                {quizCorrect === quiz.length ? "🏆" : "📘"}
              </Typography>
              <Typography fontWeight={900} fontSize={17}>
                Верно: {quizCorrect} из {quiz.length}
              </Typography>
              <Typography
                fontSize={13.5}
                sx={{ mt: 0.75, lineHeight: 1.55, color: P.dim }}
              >
                {c.finalRule}
              </Typography>
              {sent && (
                <Typography fontSize={12.5} sx={{ mt: 1.25, color: P.dim }}>
                  Сохраняем результат…
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
