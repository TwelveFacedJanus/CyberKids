// src/components/tasks/photo_detective/GeoMapApp.tsx

import React from "react";
import { Box, Typography, Stack, Button, Chip } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import type { GeoResults, Clue } from "./photoDetective.types";

interface Props {
  results: GeoResults;
  onAddClue: (clue: Clue) => void;
  addedClues: string[];
}

export default function GeoMapApp({ results, onAddClue, addedClues }: Props) {
  const cityAdded = addedClues.includes("city");

  const districtAdded = addedClues.includes("district");

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 550,
        background: "#dbeafe",
        position: "relative",
      }}
    >
      {/* fake map */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,

          backgroundColor: "#e5e7eb",

          backgroundImage: `
            linear-gradient(35deg,
              transparent 48%,
              #ffffff 49%,
              #ffffff 51%,
              transparent 52%),
            linear-gradient(120deg,
              transparent 48%,
              #ffffff 49%,
              #ffffff 51%,
              transparent 52%)
          `,

          backgroundSize: "150px 150px",
        }}
      />

      {/* river */}
      <Box
        sx={{
          position: "absolute",
          width: 180,
          height: "130%",
          right: 80,
          top: -100,

          background: "#93c5fd",

          transform: "rotate(12deg)",

          opacity: 0.8,
        }}
      />

      {/* roads */}
      <Box
        sx={{
          position: "absolute",
          left: "10%",
          top: "45%",
          width: "80%",
          height: 32,
          background: "#fff",
          transform: "rotate(-10deg)",
          boxShadow: "0 2px 5px rgba(0,0,0,.1)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "25%",
          top: "10%",
          width: 28,
          height: "85%",
          background: "#fff",
          transform: "rotate(14deg)",
        }}
      />

      {/* markers */}
      <MapMarker left="47%" top="39%" icon="📍" label="Школа №12" />

      <MapMarker left="33%" top="60%" icon="🏪" label="Магазин" />

      <MapMarker left="67%" top="53%" icon="🚇" label="Метро" />

      {/* panel */}
      <Box
        sx={{
          position: "absolute",
          top: 18,
          left: 18,
          width: 320,
          background: "rgba(255,255,255,.95)",
          backdropFilter: "blur(15px)",
          borderRadius: 1,
          p: 2,
          boxShadow: "0 10px 35px rgba(0,0,0,.2)",
        }}
      >
        <Typography fontWeight={800} fontSize={17}>
          🗺️ Карта координат
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          Найдена точка:
        </Typography>
        <Typography
          fontFamily="monospace"
          fontWeight={700}
          sx={{ color: "#000" }}
        >
          {results.coords}
        </Typography>
        <Stack spacing={1} sx={{ color: "#000" }}>
          <InfoRow label="Город" value={results.city} />
          <InfoRow label="Район" value={results.district} />
        </Stack>
        <Typography
          fontSize={12}
          color="text.secondary"
          fontWeight={700}
          sx={{ mt: 2, mb: 0.8 }}
        >
          Объекты рядом
        </Typography>
        <Stack spacing={0.6}>
          {results.landmarks.map((landmark) => (
            <Chip key={landmark} label={landmark} size="small" />
          ))}
        </Stack>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button
            fullWidth
            size="small"
            variant={cityAdded ? "outlined" : "contained"}
            disabled={cityAdded}
            startIcon={cityAdded ? <CheckRoundedIcon /> : <AddRoundedIcon />}
            onClick={() =>
              onAddClue({
                id: "city",
                text: results.city,
                source: "geo",
                category: "city",
              })
            }
          >
            {cityAdded ? "Город в блокноте" : "Добавить город"}
          </Button>

          <Button
            fullWidth
            size="small"
            variant={districtAdded ? "outlined" : "contained"}
            disabled={districtAdded}
            startIcon={
              districtAdded ? <CheckRoundedIcon /> : <AddRoundedIcon />
            }
            onClick={() =>
              onAddClue({
                id: "district",
                text: results.district,
                source: "geo",
                category: "district",
              })
            }
          >
            {districtAdded ? "Район в блокноте" : "Добавить район"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography fontSize={10} color="text.secondary">
        {label}
      </Typography>

      <Typography fontSize={13} fontWeight={700}>
        {value}
      </Typography>
    </Box>
  );
}

function MapMarker({
  left,
  top,
  icon,
  label,
}: {
  left: string;
  top: string;
  icon: string;
  label: string;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        left,
        top,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        fontSize: 22,
      }}
    >
      <Box>{icon}</Box>

      <Typography
        fontSize={10}
        fontWeight={700}
        sx={{
          background: "#fff",
          px: 0.7,
          borderRadius: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
