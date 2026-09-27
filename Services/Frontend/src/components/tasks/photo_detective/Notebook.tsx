// src/components/tasks/photo_detective/Notebook.tsx

import React from "react";

import { Box, Typography } from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import type { Clue } from "./photoDetective.types";

interface Props {
  clues: Clue[];
  compact?: boolean;
}

export default function Notebook({ clues, compact = false }: Props) {
  const rows = Math.max(compact ? 8 : 12, clues.length + 2);

  return (
    <Box
      sx={{
        width: "100%",
        height: compact ? 560 : "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 1,
        background: "#fffdf7",
        border: "1px solid #ddd4c5",
        boxShadow: compact
          ? "0 18px 45px rgba(0,0,0,.25)"
          : "0 12px 35px rgba(15,23,42,.15)",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          flexShrink: 0,
          minHeight: compact ? 82 : 88,
          px: compact ? 2 : 2.2,
          py: 1.6,
          display: "flex",
          alignItems: "center",
          gap: 1.3,
          background: "linear-gradient(135deg, #393632 0%, #45413c 100%)",
          color: "#fff",
        }}
      >
        <MenuBookRoundedIcon
          sx={{
            fontSize: compact ? 29 : 32,
            flexShrink: 0,
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: compact ? 17 : 19,
              lineHeight: 1.1,
              fontWeight: 900,
            }}
          >
            Блокнот улик
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: compact ? 10 : 11,
              color: "rgba(255,255,255,.65)",
              whiteSpace: "nowrap",
            }}
          >
            Собирай только найденную информацию
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: compact ? 17 : 19,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {clues.length}
        </Typography>
      </Box>

      {/* NOTEBOOK BODY */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
          background: "#fffdf7",
        }}
      >
        {/* Красная вертикальная линия тетради */}
        <Box
          sx={{
            position: "absolute",
            left: compact ? 38 : 40,
            top: 0,
            bottom: 0,
            width: "1px",
            background: "rgba(214, 92, 75, .22)",
            pointerEvents: "none",
          }}
        />

        {/* СТРОКИ */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflowY: "auto",
            overflowX: "hidden",

            scrollbarWidth: "thin",

            "&::-webkit-scrollbar": {
              width: 5,
            },

            "&::-webkit-scrollbar-thumb": {
              background: "rgba(120,110,100,.25)",
              borderRadius: 10,
            },
          }}
        >
          {Array.from({ length: rows }).map((_, index) => {
            const clue = clues[index];

            return (
              <NotebookRow
                key={clue?.id ?? `empty-${index}`}
                number={index + 1}
                clue={clue}
                compact={compact}
              />
            );
          })}

          {/* нижняя зона */}
          <Box
            sx={{
              height: 55,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: compact ? 10 : 11,
                color: "#a78b72",
              }}
            >
              Улик найдено: {clues.length}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =========================================================
   ОДНА СТРОКА БЛОКНОТА
========================================================= */

function NotebookRow({
  number,
  clue,
  compact,
}: {
  number: number;
  clue?: Clue;
  compact: boolean;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        /*
         * ВАЖНО:
         * каждая улика получает собственную фиксированную строку.
         */
        minHeight: compact ? 53 : 56,
        height: compact ? 53 : 56,
        display: "flex",
        alignItems: "center",

        /*
         * Линия принадлежит именно этой строке.
         */
        borderBottom: "1px solid rgba(188, 165, 133, .32)",

        boxSizing: "border-box",
      }}
    >
      {/* НОМЕР */}
      <Box
        sx={{
          width: compact ? 43 : 48,
          flexShrink: 0,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          color: "#8f7d69",
          fontSize: compact ? 11 : 12,
          fontFamily: "Georgia, serif",
        }}
      >
        {clue ? `${number}.` : ""}
      </Box>

      {/* СОДЕРЖИМОЕ */}
      {clue ? (
        <Box
          sx={{
            minWidth: 0,
            flex: 1,

            display: "flex",
            alignItems: "center",

            pr: 1.2,
            overflow: "hidden",
          }}
        >
          <ClueChip clue={clue} compact={compact} />
        </Box>
      ) : null}
    </Box>
  );
}

/* =========================================================
   УЛИКА
========================================================= */

function ClueChip({ clue, compact }: { clue: Clue; compact: boolean }) {
  const Icon = getClueIcon(clue.source);

  return (
    <Box
      sx={{
        maxWidth: "100%",

        display: "inline-flex",
        alignItems: "center",
        gap: 0.8,

        px: compact ? 1 : 1.1,
        py: compact ? 0.65 : 0.7,

        borderRadius: 999,

        background: "#fff",
        border: "1px solid #dfd3c4",

        boxShadow: "0 1px 2px rgba(0,0,0,.04)",

        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: compact ? 24 : 27,
          height: compact ? 24 : 27,
          flexShrink: 0,

          borderRadius: 1.2,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "#827b74",
          color: "#fff",
        }}
      >
        <Icon
          sx={{
            fontSize: compact ? 15 : 17,
          }}
        />
      </Box>

      <Typography
        sx={{
          minWidth: 0,

          fontSize: compact ? 13 : 14,
          fontWeight: 700,
          color: "#263238",

          /*
           * Улика не переносится на несколько строк.
           * Если слишком длинная — обрезается.
           */
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {clue.text}
      </Typography>
    </Box>
  );
}

/* =========================================================
   ИКОНКИ ПО ИСТОЧНИКУ
========================================================= */

function getClueIcon(source: Clue["source"]) {
  switch (source) {
    case "geo":
      return LocationOnRoundedIcon;

    case "image_search":
    case "nick_search":
      return SearchRoundedIcon;

    case "photo":
    default:
      return PhotoCameraRoundedIcon;
  }
}
