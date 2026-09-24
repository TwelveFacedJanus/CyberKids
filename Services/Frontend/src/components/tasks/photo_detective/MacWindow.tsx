// src/components/tasks/photo_detective/MacWindow.tsx

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CropSquareRoundedIcon from "@mui/icons-material/CropSquareRounded";

interface MacWindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  width?: number | string;
  height?: number | string;
}

export default function MacWindow({
  title,
  icon,
  children,
  onClose,
  width = "min(900px, 90vw)",
  height = "min(650px, 78vh)",
}: MacWindowProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",

        width,
        height,

        display: "flex",
        flexDirection: "column",

        overflow: "hidden",

        background: "#f8f8fa",

        borderRadius: 1,

        border: "1px solid rgba(0,0,0,.22)",

        boxShadow: "0 30px 90px rgba(0,0,0,.45)",

        zIndex: 20,

        animation: "windowOpen .25s ease",

        "@keyframes windowOpen": {
          from: {
            opacity: 0,
            transform: "translate(-50%, -48%) scale(.96)",
          },
          to: {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)",
          },
        },
      }}
    >
      {/* titlebar */}
      <Box
        sx={{
          height: 46,
          flexShrink: 0,

          display: "flex",
          alignItems: "center",

          px: 1.5,

          background: "linear-gradient(#fafafa, #e9e9eb)",

          borderBottom: "1px solid #d2d2d5",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 0.7,
          }}
        >
          <TrafficLight color="#ff5f57" onClick={onClose} />

          <TrafficLight color="#febc2e" />

          <TrafficLight color="#28c840" />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          {icon}

          <Typography fontSize={13} fontWeight={700} color="#333">
            {title}
          </Typography>
        </Box>

        <Box sx={{ width: 65 }} />
      </Box>

      {/* content */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function TrafficLight({
  color,
  onClick,
}: {
  color: string;
  onClick?: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,

        cursor: onClick ? "pointer" : "default",

        boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)",

        "&:hover": onClick
          ? {
              filter: "brightness(.9)",
            }
          : undefined,
      }}
    />
  );
}
