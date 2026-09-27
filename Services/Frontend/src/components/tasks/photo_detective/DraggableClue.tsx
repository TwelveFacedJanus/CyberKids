import React from "react";
import { Box, Typography } from "@mui/material";

export interface DraggableClueData {
  id: string;
  text: string;
  source?: string;
  icon?: string;
}

interface DraggableClueProps {
  clue: DraggableClueData;
  disabled?: boolean;
}

const DraggableClue: React.FC<DraggableClueProps> = ({
  clue,
  disabled = false,
}) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
      "application/photo-detective-clue",
      JSON.stringify(clue),
    );
  };

  return (
    <Box
      draggable={!disabled}
      onDragStart={handleDragStart}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,

        px: 1.5,
        py: 1,

        borderRadius: "12px",

        background: disabled
          ? "#e9e9e9"
          : "linear-gradient(135deg, #ffffff, #f4f6f8)",

        border: "1px solid",
        borderColor: disabled ? "#d3d3d3" : "#d5dce2",

        cursor: disabled ? "default" : "grab",

        opacity: disabled ? 0.55 : 1,

        userSelect: "none",

        transition: "transform 0.15s ease, box-shadow 0.15s ease",

        "&:hover": disabled
          ? {}
          : {
              transform: "translateY(-2px)",
              boxShadow: "0 5px 14px rgba(0,0,0,0.1)",
            },

        "&:active": disabled
          ? {}
          : {
              cursor: "grabbing",
              transform: "scale(0.97)",
            },
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
  );
};

export default DraggableClue;
