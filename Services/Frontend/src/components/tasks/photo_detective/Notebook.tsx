// src/components/tasks/photo_detective/Notebook.tsx

import React from "react";
import { Box, Typography, Paper, Chip, Stack, Divider } from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";

import type { Clue } from "./photoDetective.types";

interface NotebookProps {
  clues: Clue[];
  compact?: boolean;
}

const getSourceIcon = (source: Clue["source"]) => {
  switch (source) {
    case "photo":
      return <CameraAltRoundedIcon fontSize="small" />;
    default:
      return <SearchRoundedIcon fontSize="small" />;
  }
};

export default function Notebook({ clues, compact = false }: NotebookProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: compact ? 280 : 330,
        height: compact ? "auto" : "100%",
        minHeight: compact ? 180 : 460,
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",

        background: "linear-gradient(145deg, #fffdf5 0%, #fffaf0 100%)",

        border: "1px solid #eadfca",

        boxShadow: "0 16px 45px rgba(70, 55, 30, 0.12)",
      }}
    >
      {/* Верх блокнота */}
      <Box
        sx={{
          px: 2.2,
          py: 1.8,
          background: "linear-gradient(135deg, #292524 0%, #44403c 100%)",
          color: "#fff",
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <MenuBookRoundedIcon />

          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={800} fontSize={16}>
              Блокнот улик
            </Typography>

            <Typography fontSize={11} sx={{ opacity: 0.65 }}>
              Собирай только найденную информацию
            </Typography>
          </Box>

          <Typography fontWeight={800} fontSize={14} sx={{ opacity: 0.8 }}>
            {clues.length}
          </Typography>
        </Stack>
      </Box>

      {/* Листы */}
      <Box
        sx={{
          p: 2,
          minHeight: compact ? 110 : 390,
          backgroundImage: "linear-gradient(#eee5d4 1px, transparent 1px)",
          backgroundSize: "100% 28px",
        }}
      >
        {clues.length === 0 ? (
          <Box
            sx={{
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Box>
              <Typography fontSize={32} sx={{ mb: 1 }}>
                🔎
              </Typography>

              <Typography fontWeight={700} color="text.secondary" fontSize={14}>
                Здесь пока пусто
              </Typography>

              <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
                Находи улики на фотографии и в инструментах
              </Typography>
            </Box>
          </Box>
        ) : (
          <Stack spacing={1.3}>
            {clues.map((clue, index) => (
              <Box
                key={clue.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,

                  animation: "clueAppear .4s ease",

                  "@keyframes clueAppear": {
                    from: {
                      opacity: 0,
                      transform: "translateX(25px) scale(.9)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateX(0) scale(1)",
                    },
                  },
                }}
              >
                <Typography
                  fontSize={11}
                  color="text.secondary"
                  sx={{
                    width: 18,
                    textAlign: "right",
                  }}
                >
                  {index + 1}.
                </Typography>

                <Chip
                  icon={getSourceIcon(clue.source)}
                  label={clue.text}
                  sx={{
                    height: 32,
                    borderRadius: 2,
                    background: "#fff",
                    border: "1px solid #e4d8c4",
                    fontWeight: 700,

                    "& .MuiChip-icon": {
                      color: "#78716c",
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box sx={{ p: 1.5 }}>
        <Typography fontSize={11} color="text.secondary" textAlign="center">
          Улик найдено: <b>{clues.length}</b>
        </Typography>
      </Box>
    </Paper>
  );
}
