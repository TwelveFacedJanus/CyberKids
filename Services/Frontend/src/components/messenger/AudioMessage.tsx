// src/components/messenger/messages/AudioMessage.tsx
import { useState, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import type { AudioMessage as TAudio } from "../../../types/messenger";
import MessageFooter from "./MessageFooter";

interface Props {
  msg: TAudio;
  onListened?: () => void;
}

export default function AudioMessage({ msg, onListened }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const notifiedRef = useRef(false);

  const bars = Array.from(
    { length: 24 },
    () => 6 + Math.round(Math.random() * 16),
  );

  const notifyListened = () => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    console.log("[ALEX] audio listened:", msg.id);
    onListened?.();
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;

    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.warn("[ALEX] audio play failed:", err);
          // ❗ Ошибка воспроизведения — считаем прослушанным,
          // но ТОЛЬКО после явного клика
          notifyListened();
        });
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const handleEnded = () => {
    console.log("[ALEX] audio ended:", msg.id);
    setPlaying(false);
    setProgress(0);
    notifyListened();
  };

  const handleError = () => {
    // ❗ Ничего не делаем по умолчанию — только если пользователь нажал play,
    // это обработается в .catch() выше
    console.warn("[ALEX] audio error:", msg.src);
    setPlaying(false);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress(a.currentTime / a.duration);

    // Если доиграло до 95% — считаем прослушанным
    if (a.currentTime / a.duration >= 0.95) {
      notifyListened();
    }
  };

  return (
    <Box
      sx={{
        px: 1.5,
        pt: 1.125,
        pb: 0.875,
        borderRadius: "16px",
        boxShadow: "0 1px 1px rgba(0,0,0,.04)",
        ...(msg.from === "them"
          ? { bgcolor: "#fff", color: "#1c1e21", borderBottomLeftRadius: "4px" }
          : {
              bgcolor: "#d7ecff",
              color: "#0e2a44",
              border: "1px solid #c3e3ff",
              borderBottomRightRadius: "4px",
            }),
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 220 }}
      >
        <IconButton
          onClick={toggle}
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#2f7bf6",
            color: "#fff",
            flexShrink: 0,
            "&:hover": { bgcolor: "#1f5fd1" },
          }}
        >
          {playing ? (
            <PauseIcon sx={{ fontSize: 15 }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: 15 }} />
          )}
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            height: 20,
            flex: 1,
          }}
        >
          {bars.map((h, i) => (
            <Box
              key={i}
              sx={{
                width: 3,
                height: h,
                bgcolor: playing
                  ? "#2f7bf6"
                  : msg.from === "me"
                    ? "#7fa9cf"
                    : "#9fb6c8",
                borderRadius: "2px",
              }}
            />
          ))}
        </Box>

        <Typography
          sx={{
            fontSize: 11,
            color: msg.listened ? "#2f7bf6" : "#8a8f98",
            minWidth: 30,
            textAlign: "right",
            fontWeight: msg.listened ? 700 : 500,
          }}
        >
          {msg.listened ? "✓" : msg.duration || "0:05"}
        </Typography>
      </Box>

      {msg.transcript && (
        <Typography
          sx={{
            fontSize: 11.5,
            color: "#9199a3",
            mt: 0.5,
            fontStyle: "italic",
            pl: 0.25,
          }}
        >
          «{msg.transcript}»
        </Typography>
      )}

      <audio
        ref={audioRef}
        src={msg.src}
        preload="auto"
        onEnded={handleEnded}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
      />

      <MessageFooter msg={msg} />
    </Box>
  );
}
