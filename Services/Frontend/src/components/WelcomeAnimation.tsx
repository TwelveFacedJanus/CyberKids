// components/WelcomeAnimation.tsx
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

interface WelcomeAnimationProps {
  userName?: string;
  onDone: () => void;
}

const CONFETTI_COLORS = [
  "#7C4DFF",
  "#EC407A",
  "#FFCA28",
  "#00A3FF",
  "#00E676",
  "#FF6B35",
];

export default function WelcomeAnimation({
  userName,
  onDone,
}: WelcomeAnimationProps) {
  const [leaving, setLeaving] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // 🎯 Показываем кнопку через 1.4 секунды
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setLeaving(true);
    setTimeout(onDone, 900);
    };

  // 🎊 40 частиц конфетти со случайными параметрами
  const confetti = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2.2 + Math.random() * 1.6,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + Math.random() * 10,
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? "circle" : "rect",
  }));

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",

        // 🌈 Фон с градиентом в фирменных цветах
        background:
          "linear-gradient(135deg, #7C4DFF 0%, #EC407A 60%, #FFCA28 100%)",

        // 🎬 Уход оверлея вверх
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        opacity: leaving ? 0 : 1,
        transition:
          "transform 0.65s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.5s ease 0.15s",

        // 🎊 КОНФЕТТИ
        "& .confetti": {
          position: "absolute",
          bottom: "-40px",
          animationName: "confettiRise",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          willChange: "transform, opacity",
        },
        "@keyframes confettiRise": {
          "0%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: 0,
          },
          "10%": { opacity: 1 },
          "90%": { opacity: 1 },
          "100%": {
            transform: "translateY(-110vh) rotate(720deg)",
            opacity: 0,
          },
        },

        // 🐻 Маскот — пружинистое появление
        "& .mascot": {
          animation: "mascotPop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
          userSelect: "none",
          pointerEvents: "none",
        },
        "@keyframes mascotPop": {
          "0%": { transform: "scale(0) rotate(-45deg)", opacity: 0 },
          "60%": { transform: "scale(1.15) rotate(8deg)", opacity: 1 },
          "80%": { transform: "scale(0.95) rotate(-3deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },

        // 📝 Заголовок — выезжает снизу
        "& .title": {
          animation: "titleSlide 0.7s ease-out 0.5s both",
        },
        "@keyframes titleSlide": {
          "0%": { transform: "translateY(40px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },

        // ✨ Подзаголовок — появляется ещё позже
        "& .subtitle": {
          animation: "titleSlide 0.7s ease-out 0.8s both",
        },

        // 🔘 Кнопка — пульсирует
        "& .start-btn": {
          animation: "titleSlide 0.6s ease-out 0.2s both",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: -6,
            borderRadius: "999px",
            border: "3px solid rgba(255,255,255,0.6)",
            animation: "pulseRing 1.8s ease-out infinite",
            pointerEvents: "none",
          },
        },
        "@keyframes pulseRing": {
          "0%": { transform: "scale(1)", opacity: 0.7 },
          "100%": { transform: "scale(1.4)", opacity: 0 },
        },
      }}
    >
      {/* 🎊 Конфетти */}
      {confetti.map((c) => (
        <Box
          key={c.id}
          className="confetti"
          sx={{
            left: `${c.left}%`,
            width: c.shape === "circle" ? c.size : c.size * 0.5,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: c.shape === "circle" ? "50%" : "2px",
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            transform: `rotate(${c.rotation}deg)`,
          }}
        />
      ))}

      {/* 🐻 Маскот */}
      <Box
        component="img"
        src="/BearSmile.svg"
        alt=""
        className="mascot"
        sx={{
          width: { xs: 160, sm: 200, md: 240 },
          height: "auto",
          mb: 2,
          zIndex: 2,
        }}
      />

      {/* 📝 Заголовок */}
      <Typography
        className="title"
        sx={{
          color: "#fff",
          fontWeight: 900,
          fontSize: { xs: 28, sm: 38, md: 48 },
          textAlign: "center",
          px: 2,
          letterSpacing: "-0.02em",
          textShadow: "0 4px 20px rgba(0,0,0,0.25)",
          zIndex: 2,
        }}
      >
        {userName ? `Привет, ${userName}! 👋` : "Добро пожаловать! 👋"}
      </Typography>

      <Typography
        className="subtitle"
        sx={{
          color: "rgba(255,255,255,0.92)",
          fontWeight: 500,
          fontSize: { xs: 15, sm: 18 },
          textAlign: "center",
          mt: 1,
          mb: 5,
          px: 3,
          maxWidth: 500,
          textShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 2,
        }}
      >
        Готов стать настоящим кибергероем? 🛡️
        <br />
        Тебя ждут крутые задания и звёзды!
      </Typography>

      {/* 🔘 Кнопка старта */}
      {showButton && (
        <Button
          className="start-btn"
          onClick={handleStart}
          sx={{
            position: "relative",
            zIndex: 2,
            backgroundColor: "#fff",
            color: "#7C4DFF",
            fontWeight: 900,
            fontSize: { xs: 16, sm: 18 },
            px: { xs: 4, sm: 6 },
            py: 1.6,
            borderRadius: "999px",
            textTransform: "none",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            transition: "transform 0.15s ease",
            "&:hover": {
              backgroundColor: "#fff",
              transform: "scale(1.06)",
            },
            "&:active": {
              transform: "scale(0.97)",
            },
          }}
        >
          Поехали! 🚀
        </Button>
      )}
    </Box>
  );
}