import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { DraggableClueData } from "./DraggableClue";

interface DossierSlotProps {
  slot: {
    id: string;
    label: string;
    icon: string;
    acceptedClues: string[];
  };

  clue: DraggableClueData | null;

  onDropClue: (slotId: string, clue: DraggableClueData) => void;
}

const DossierSlot: React.FC<DossierSlotProps> = ({
  slot,
  clue,
  onDropClue,
}) => {
  const [isOver, setIsOver] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (clue) {
      return;
    }

    event.dataTransfer.dropEffect = "move";

    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsOver(false);

    if (clue) {
      return;
    }

    const raw = event.dataTransfer.getData("application/photo-detective-clue");

    if (!raw) {
      return;
    }

    try {
      const droppedClue: DraggableClueData = JSON.parse(raw);

      const isCorrect = slot.acceptedClues.includes(droppedClue.id);

      if (!isCorrect) {
        setIsWrong(true);

        setTimeout(() => {
          setIsWrong(false);
        }, 600);

        return;
      }

      onDropClue(slot.id, droppedClue);
    } catch {
      console.error("Не удалось прочитать улику");
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        minHeight: 82,

        p: 1.5,

        borderRadius: "14px",

        border: "2px dashed",

        borderColor: isWrong
          ? "#ef5350"
          : isOver
            ? "#26a69a"
            : clue
              ? "#81c784"
              : "#cbd5dc",

        background: isWrong
          ? "rgba(239,83,80,0.08)"
          : isOver
            ? "rgba(38,166,154,0.08)"
            : clue
              ? "rgba(129,199,132,0.08)"
              : "#f8fafb",

        transition: "all 0.2s ease",

        transform: isWrong
          ? "translateX(-4px)"
          : isOver
            ? "scale(1.01)"
            : "scale(1)",

        animation: isWrong ? "wrongDrop 0.5s ease" : "none",

        "@keyframes wrongDrop": {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "25%": {
            transform: "translateX(-6px)",
          },
          "75%": {
            transform: "translateX(6px)",
          },
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: clue ? 1 : 0,
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
          }}
        >
          {slot.icon}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 800,
            color: "#37474f",
          }}
        >
          {slot.label}
        </Typography>

        {clue && (
          <CheckCircleRoundedIcon
            sx={{
              ml: "auto",
              fontSize: 19,
              color: "#43a047",
            }}
          />
        )}
      </Box>

      {/* EMPTY */}
      {!clue && !isWrong && (
        <Typography
          sx={{
            fontSize: 11,
            color: "#9aa7ad",
          }}
        >
          Перетащи сюда подходящую улику
        </Typography>
      )}

      {/* WRONG */}
      {isWrong && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <CloseRoundedIcon
            sx={{
              fontSize: 16,
              color: "#e53935",
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "#e53935",
            }}
          >
            Эта улика не подходит
          </Typography>
        </Box>
      )}

      {/* CORRECT CLUE */}
      {clue && (
        <Box
          sx={{
            px: 1.2,
            py: 0.8,

            borderRadius: "9px",

            background: "#fff",

            border: "1px solid #c8e6c9",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#263238",
            }}
          >
            {clue.text}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DossierSlot;
