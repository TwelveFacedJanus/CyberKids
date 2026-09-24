// src/components/tasks/photo_detective/MacDesktop.tsx

import React from "react";
import { Box, Typography, Stack } from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

interface MacDesktopProps {
  onOpenImageSearch: () => void;
  onOpenNickSearch: () => void;
  onOpenMap: () => void;
  onOpenNotebook: () => void;
  children?: React.ReactNode;
}

export default function MacDesktop({
  onOpenImageSearch,
  onOpenNickSearch,
  onOpenMap,
  onOpenNotebook,
  children,
}: MacDesktopProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 650,
        overflow: "hidden",

        background:
          "radial-gradient(circle at 30% 20%, #475569 0%, transparent 35%)," +
          "radial-gradient(circle at 80% 70%, #312e81 0%, transparent 40%)," +
          "linear-gradient(135deg, #0f172a, #1e293b)",

        color: "#fff",
      }}
    >
      {/* top menu */}
      <Box
        sx={{
          height: 34,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,

          background: "rgba(20,20,25,.7)",

          backdropFilter: "blur(20px)",
        }}
      >
        <Typography fontWeight={800} fontSize={15}>
          
        </Typography>

        <Typography fontSize={12}>Finder</Typography>

        <Typography fontSize={12} sx={{ opacity: 0.7 }}>
          Файл
        </Typography>

        <Typography fontSize={12} sx={{ opacity: 0.7 }}>
          Правка
        </Typography>

        <Typography fontSize={12} sx={{ opacity: 0.7 }}>
          Вид
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Typography fontSize={11} sx={{ opacity: 0.7 }}>
          Дело №001
        </Typography>
      </Box>

      {/* desktop icons */}
      <Box
        sx={{
          p: 4,
          display: "grid",
          gridTemplateColumns: "repeat(4, 100px)",
          gap: 3,
        }}
      >
        <DesktopApp
          icon={<SearchRoundedIcon />}
          title="Поиск по фото"
          onClick={onOpenImageSearch}
        />

        <DesktopApp
          icon={<PersonSearchRoundedIcon />}
          title="Поиск по нику"
          onClick={onOpenNickSearch}
        />

        <DesktopApp
          icon={<MapRoundedIcon />}
          title="Карта"
          onClick={onOpenMap}
        />

        <DesktopApp
          icon={<MenuBookRoundedIcon />}
          title="Блокнот"
          onClick={onOpenNotebook}
        />
      </Box>

      {/* dock */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",

          px: 2,
          py: 1,

          display: "flex",
          gap: 1,

          borderRadius: 3,

          background: "rgba(255,255,255,.18)",

          backdropFilter: "blur(20px)",

          border: "1px solid rgba(255,255,255,.25)",
        }}
      >
        <DockIcon icon="🔎" />
        <DockIcon icon="🌐" />
        <DockIcon icon="🗺️" />
        <DockIcon icon="📓" />
      </Box>

      {children}
    </Box>
  );
}

function DesktopApp({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 90,
        cursor: "pointer",
        textAlign: "center",

        p: 1,

        borderRadius: 2,

        transition: ".2s",

        "&:hover": {
          background: "rgba(255,255,255,.12)",
          transform: "translateY(-3px)",
        },
      }}
    >
      <Box
        sx={{
          width: 58,
          height: 58,
          mx: "auto",
          mb: 0.8,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: 1.8,

          background: "linear-gradient(145deg,#fff,#dbeafe)",

          color: "#334155",

          boxShadow: "0 8px 20px rgba(0,0,0,.25)",
        }}
      >
        {icon}
      </Box>

      <Typography fontSize={11} fontWeight={600}>
        {title}
      </Typography>
    </Box>
  );
}

function DockIcon({ icon }: { icon: string }) {
  return (
    <Box
      sx={{
        width: 38,
        height: 38,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 1.5,

        background: "rgba(255,255,255,.16)",

        fontSize: 21,
      }}
    >
      {icon}
    </Box>
  );
}
