// src/components/tasks/photo_detective/DossierBuilder.tsx

import React, { useState } from "react";
import { Box, Typography, Paper, Chip, Stack, Button } from "@mui/material";

import type { Clue, DossierSlot } from "./photoDetective.types";

interface Props {
  clues: Clue[];
  onComplete: () => void;
}

const slots: DossierSlot[] = [
  {
    id: "nickname",
    label: "Никнейм",
    icon: "🆔",
    acceptedClues: ["nickname"],
  },
  {
    id: "about",
    label: "О себе",
    icon: "💬",
    acceptedClues: ["interests"],
  },
  {
    id: "city",
    label: "Город",
    icon: "🏙️",
    acceptedClues: ["city"],
  },
  {
    id: "district",
    label: "Район",
    icon: "📍",
    acceptedClues: ["district"],
  },
  {
    id: "school",
    label: "Школа",
    icon: "🏫",
    acceptedClues: ["school"],
  },
  {
    id: "route",
    label: "Маршрут",
    icon: "🚌",
    acceptedClues: ["bus"],
  },
];

export default function DossierBuilder({ clues, onComplete }: Props) {
  const [placed, setPlaced] = useState<Record<string, Clue>>({});

  const [errorSlot, setErrorSlot] = useState<string | null>(null);

  const handleDrop = (slot: DossierSlot, clue: Clue) => {
    if (!slot.acceptedClues.includes(clue.id)) {
      setErrorSlot(slot.id);

      setTimeout(() => setErrorSlot(null), 900);

      return;
    }

    setPlaced((prev) => ({
      ...prev,
      [slot.id]: clue,
    }));
  };

  const allComplete = slots.every((slot) => placed[slot.id]);

  React.useEffect(() => {
    if (allComplete) {
      onComplete();
    }
  }, [allComplete, onComplete]);

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: 4,

        background:
          "radial-gradient(circle at 20% 20%, #334155, transparent 35%)," +
          "linear-gradient(135deg,#0f172a,#1e293b)",
      }}
    >
      <Typography
        color="#fff"
        fontSize={27}
        fontWeight={900}
        textAlign="center"
      >
        🗂️ Собери досье
      </Typography>

      <Typography
        color="rgba(255,255,255,.65)"
        textAlign="center"
        fontSize={13}
        sx={{ mt: 0.7, mb: 3 }}
      >
        Перетащи каждую улику в подходящее поле
      </Typography>

      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",

          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 3,
        }}
      >
        {/* clues */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 1,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.12)",
          }}
        >
          <Typography color="#fff" fontWeight={800} sx={{ mb: 2 }}>
            🔎 Найденные улики
          </Typography>

          <Stack spacing={1}>
            {clues.map((clue) => {
              const alreadyPlaced = Object.values(placed).some(
                (item) => item.id === clue.id,
              );

              return (
                <Chip
                  key={clue.id}
                  draggable={!alreadyPlaced}
                  label={clue.text}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("clueId", clue.id);
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    height: 42,

                    color: alreadyPlaced ? "rgba(255,255,255,.3)" : "#fff",

                    background: alreadyPlaced
                      ? "rgba(255,255,255,.04)"
                      : "rgba(255,255,255,.12)",

                    border: "1px solid rgba(255,255,255,.15)",

                    cursor: alreadyPlaced ? "default" : "grab",

                    "&:hover": {
                      background: alreadyPlaced
                        ? undefined
                        : "rgba(255,255,255,.18)",
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Paper>

        {/* dossier */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 1,
            background: "linear-gradient(145deg,#fff,#f8fafc)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography fontSize={21} fontWeight={900}>
                Личное дело
              </Typography>

              <Typography fontSize={11} color="text.secondary">
                Учебный персонаж
              </Typography>
            </Box>

            <Typography fontSize={30}>🗃️</Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1.5,
            }}
          >
            {slots.map((slot) => {
              const clue = placed[slot.id];

              const isError = errorSlot === slot.id;

              return (
                <DossierSlot
                  key={slot.id}
                  slot={slot}
                  clue={clue}
                  error={isError}
                  onDrop={handleDrop}
                />
              );
            })}
          </Box>

          {allComplete && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 1,
                background: "#dcfce7",
                border: "1px solid #86efac",
                textAlign: "center",
              }}
            >
              <Typography fontWeight={800} color="#166534">
                ✓ Досье собрано
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

function DossierSlot({
  slot,
  clue,
  error,
  onDrop,
}: {
  slot: DossierSlot;
  clue?: Clue;
  error: boolean;
  onDrop: (slot: DossierSlot, clue: Clue) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <Box
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();

        setDragOver(false);

        const clueId = event.dataTransfer.getData("clueId");

        const clueElement = document.querySelector(
          `[data-clue-id="${clueId}"]`,
        );

        void clueElement;

        window.dispatchEvent(
          new CustomEvent("photo-detective-drop", {
            detail: {
              slotId: slot.id,
              clueId,
            },
          }),
        );
      }}
      sx={{
        minHeight: 105,
        p: 2,

        borderRadius: 1.5,

        border: error
          ? "2px solid #ef4444"
          : dragOver
            ? "2px solid #3b82f6"
            : clue
              ? "2px solid #22c55e"
              : "2px dashed #cbd5e1",

        background: error ? "#fef2f2" : clue ? "#f0fdf4" : "#f8fafc",

        transition: ".15s",

        transform: error ? "translateX(-4px)" : "none",
      }}
    >
      <Typography fontSize={11} color="text.secondary" fontWeight={700}>
        {slot.icon} {slot.label}
      </Typography>

      {clue ? (
        <Chip
          label={clue.text}
          sx={{
            mt: 1,
            fontWeight: 800,
            background: "#dcfce7",
            color: "#166534",
          }}
        />
      ) : (
        <Typography fontSize={12} color="text.secondary" sx={{ mt: 2 }}>
          Перетащи улику сюда
        </Typography>
      )}

      {error && (
        <Typography
          fontSize={10}
          color="#dc2626"
          fontWeight={700}
          sx={{ mt: 0.5 }}
        >
          Эта улика сюда не подходит
        </Typography>
      )}
    </Box>
  );
}
