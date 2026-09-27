import React from "react";
import { Box, Typography, Stack, Button, Chip } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import type { GeoResults, Clue } from "./photoDetective.types";

interface Props {
  results: GeoResults;
  onAddClue: (clue: Clue) => void;
  addedClues: string[];
  onUse?: () => void;
}

export default function GeoMapApp({
  results,
  onAddClue,
  addedClues,
  onUse,
}: Props) {
  const cityAdded = addedClues.includes("city");
  const districtAdded = addedClues.includes("district");

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 580,
        overflow: "hidden",
        background: "#e8e8df",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Карта города */}
      <Box
        component="svg"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <pattern
            id="city-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="#d5d7cc"
              strokeWidth="0.8"
            />
          </pattern>

          <filter id="map-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodColor="#334155"
              floodOpacity="0.2"
            />
          </filter>
        </defs>

        {/* Фон */}
        <rect width="1000" height="700" fill="#e9e9df" />
        <rect width="1000" height="700" fill="url(#city-grid)" />

        {/* Кварталы */}
        <g fill="#f6f3e9" stroke="#deded2" strokeWidth="1">
          <path d="M0 0 H210 L205 100 L140 125 L0 105 Z" />
          <path d="M240 0 H390 L390 115 L320 145 L230 100 Z" />
          <path d="M420 0 H590 L600 95 L530 130 L420 110 Z" />
          <path d="M650 0 H830 L820 115 L720 130 L650 95 Z" />
          <path d="M860 0 H1000 V115 L920 140 L850 95 Z" />

          <path d="M0 150 L130 145 L180 220 L120 275 L0 260 Z" />
          <path d="M220 150 L360 145 L390 220 L330 275 L220 250 Z" />
          <path d="M420 145 L550 145 L570 220 L510 260 L410 235 Z" />
          <path d="M640 150 L790 145 L820 220 L760 270 L640 245 Z" />
          <path d="M850 155 L1000 145 V270 L920 280 L850 230 Z" />

          <path d="M0 310 L115 300 L165 370 L125 440 L0 425 Z" />
          <path d="M210 310 L345 300 L390 370 L335 435 L220 420 Z" />
          <path d="M430 300 L550 290 L590 360 L535 430 L425 415 Z" />
          <path d="M650 300 L790 300 L830 365 L775 430 L655 410 Z" />
          <path d="M860 310 L1000 300 V430 L920 445 L850 390 Z" />

          <path d="M0 470 L125 460 L175 540 L120 620 L0 605 Z" />
          <path d="M220 470 L355 460 L390 530 L340 610 L220 590 Z" />
          <path d="M440 470 L555 460 L590 535 L530 605 L420 590 Z" />
          <path d="M650 470 L790 460 L830 530 L780 610 L650 590 Z" />
          <path d="M860 475 L1000 460 V610 L920 620 L850 555 Z" />
        </g>

        {/* Парки */}
        <g fill="#b9d9a7" stroke="#a4c996" strokeWidth="2">
          <path d="M30 30 Q95 5 160 45 T180 110 Q125 145 70 115 T30 30 Z" />
          <path d="M700 40 Q760 10 820 55 T850 120 Q810 155 750 125 T700 40 Z" />
          <path d="M60 480 Q130 450 170 500 T155 585 Q100 620 55 570 T60 480 Z" />
          <path d="M790 480 Q870 440 935 490 T950 600 Q885 655 810 600 T790 480 Z" />
        </g>

        {/* Дорожная сеть */}
        <g
          fill="none"
          stroke="#fffdf7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M-20 135 C180 120 280 155 440 135 S760 105 1020 135"
            strokeWidth="17"
          />
          <path
            d="M-20 285 C170 265 290 295 455 280 S790 260 1020 285"
            strokeWidth="18"
          />
          <path
            d="M-20 450 C150 430 300 455 480 440 S790 420 1020 445"
            strokeWidth="19"
          />
          <path
            d="M-20 630 C170 610 320 640 510 620 S820 605 1020 625"
            strokeWidth="17"
          />

          <path
            d="M205 -20 C220 100 195 210 215 330 S230 550 210 720"
            strokeWidth="15"
          />
          <path
            d="M405 -20 C385 100 420 220 400 340 S415 560 400 720"
            strokeWidth="15"
          />
          <path
            d="M620 -20 C640 120 605 220 630 350 S640 550 620 720"
            strokeWidth="16"
          />
          <path
            d="M835 -20 C820 100 850 220 830 350 S845 550 830 720"
            strokeWidth="15"
          />
        </g>

        {/* Обводка дорог */}
        <g fill="none" stroke="#d3cfc1" strokeWidth="1.2" strokeLinecap="round">
          <path d="M-20 135 C180 120 280 155 440 135 S760 105 1020 135" />
          <path d="M-20 285 C170 265 290 295 455 280 S790 260 1020 285" />
          <path d="M-20 450 C150 430 300 455 480 440 S790 420 1020 445" />
          <path d="M-20 630 C170 610 320 640 510 620 S820 605 1020 625" />
          <path d="M205 -20 C220 100 195 210 215 330 S230 550 210 720" />
          <path d="M405 -20 C385 100 420 220 400 340 S415 560 400 720" />
          <path d="M620 -20 C640 120 605 220 630 350 S640 550 620 720" />
          <path d="M835 -20 C820 100 850 220 830 350 S845 550 830 720" />
        </g>

        {/* Река — отдельный слой, не прямоугольник */}
        <path
          d="
            M 510 -30
            C 470 40, 530 80, 490 145
            C 460 200, 520 235, 485 295
            C 450 355, 520 400, 500 450
            C 475 510, 540 565, 515 620
            C 500 655, 510 685, 530 730
            L 640 730
            C 620 665, 610 625, 630 570
            C 655 505, 590 475, 620 415
            C 650 355, 585 315, 625 250
            C 660 195, 605 155, 640 95
            C 675 40, 620 0, 650 -30 Z
          "
          fill="#9cc9e8"
          stroke="#82b7db"
          strokeWidth="3"
        />

        {/* Лёгкие линии течения */}
        <g
          fill="none"
          stroke="#d5edfa"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        >
          <path d="M560 35 Q535 65 560 90" />
          <path d="M535 180 Q515 210 540 235" />
          <path d="M565 335 Q540 365 565 390" />
          <path d="M560 490 Q540 520 565 545" />
          <path d="M570 615 Q550 640 575 665" />
        </g>

        {/* Мосты */}
        <g stroke="#c5c3b8" strokeWidth="2" fill="none">
          <path d="M480 135 L645 135" strokeWidth="20" />
          <path d="M480 135 L645 135" stroke="#fffdf7" strokeWidth="14" />
          <path d="M490 285 L620 285" strokeWidth="21" />
          <path d="M490 285 L620 285" stroke="#fffdf7" strokeWidth="14" />
          <path d="M505 445 L610 445" strokeWidth="22" />
          <path d="M505 445 L610 445" stroke="#fffdf7" strokeWidth="15" />
        </g>

        {/* Названия улиц */}
        <g fill="#898d82" fontSize="12" fontFamily="Arial, sans-serif">
          <text x="40" y="127" transform="rotate(-3 40 127)">
            Комсомольский проспект
          </text>
          <text x="45" y="277" transform="rotate(-2 45 277)">
            Улица Льва Толстого
          </text>
          <text x="50" y="440" transform="rotate(-3 50 440)">
            Зубовский бульвар
          </text>
          <text x="55" y="620" transform="rotate(-2 55 620)">
            Улица Остоженка
          </text>
          <text x="225" y="90" transform="rotate(87 225 90)">
            Улица Тимура Фрунзе
          </text>
          <text x="410" y="500" transform="rotate(87 410 500)">
            Переулок
          </text>
          <text x="850" y="350" transform="rotate(87 850 350)">
            Городская улица
          </text>
        </g>

        {/* Район */}
        <text
          x="720"
          y="185"
          fill="#9ca3af"
          fontSize="26"
          fontWeight="bold"
          opacity="0.8"
        >
          {results.district.toUpperCase()}
        </text>

        {/* Метки объектов */}
        <g filter="url(#map-shadow)">
          <MapPin x={355} y={215} color="#3478e5" icon="Ш" />
          <MapPin x={300} y={375} color="#e49b39" icon="М" />
          <MapPin x={720} y={375} color="#d94f4f" icon="М" />
        </g>

        {/* Подписи объектов */}
        <g fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold">
          <Label x={355} y={246} text="Школа №12" />
          <Label x={300} y={406} text="Магазин" />
          <Label x={720} y={406} text="Метро" />
        </g>

        {/* Север */}
        <g transform="translate(940 65)">
          <circle r="25" fill="white" opacity="0.9" />
          <path d="M0 -16 L7 8 L0 4 L-7 8 Z" fill="#475569" />
          <text x="0" y="-28" textAnchor="middle" fontSize="12" fill="#475569">
            N
          </text>
        </g>
      </Box>

      {/* Панель координат */}
      <Box
        sx={{
          position: "absolute",
          top: 18,
          left: 18,
          width: { xs: 270, md: 310 },
          maxWidth: "calc(100% - 36px)",
          p: 2.5,
          borderRadius: 3,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 35px rgba(30,41,59,.18)",
          border: "1px solid rgba(255,255,255,.9)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              background: "#eaf2ff",
              color: "#2563eb",
              fontSize: 22,
            }}
          >
            📍
          </Box>
          <Box>
            <Typography fontWeight={900} fontSize={18} color="#1e293b">
              Карта координат
            </Typography>
            <Typography fontSize={11} color="#64748b">
              Найденная геопозиция
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "#eff6ff",
            border: "1px solid #dbeafe",
          }}
        >
          <Typography fontSize={10} color="#64748b">
            КООРДИНАТЫ
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={800}
            fontFamily="monospace"
            color="#1e293b"
          >
            {results.coords}
          </Typography>
        </Box>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <InfoRow icon="📍" label="Город" value={results.city} />
          <InfoRow icon="📍" label="Район" value={results.district} />
        </Stack>

        <Typography
          fontSize={12}
          fontWeight={900}
          color="#1e293b"
          sx={{ mt: 2.5, mb: 1 }}
        >
          Объекты рядом
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.8}>
          {results.landmarks.map((landmark) => (
            <Chip
              key={landmark}
              size="small"
              label={landmark}
              sx={{
                bgcolor: "#eff6ff",
                color: "#334155",
                fontWeight: 600,
                fontSize: 11,
              }}
            />
          ))}
        </Stack>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant={cityAdded ? "outlined" : "contained"}
            disabled={cityAdded}
            startIcon={cityAdded ? <CheckRoundedIcon /> : <AddRoundedIcon />}
            onClick={() => {
              onAddClue({
                id: "city",
                text: results.city,
                source: "geo",
                category: "city",
              });
              onUse?.();
            }}
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 800,
              textTransform: "none",
              background: cityAdded ? undefined : "#3478e5",
            }}
          >
            {cityAdded ? "Город в блокноте" : "Добавить город"}
          </Button>

          <Button
            fullWidth
            variant={districtAdded ? "outlined" : "contained"}
            disabled={districtAdded}
            startIcon={
              districtAdded ? <CheckRoundedIcon /> : <AddRoundedIcon />
            }
            onClick={() => {
              onAddClue({
                id: "district",
                text: `Район: ${results.district}`,
                source: "geo",
                category: "district",
              });
              onUse?.();
            }}
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 800,
              textTransform: "none",
              background: districtAdded ? undefined : "#3478e5",
            }}
          >
            {districtAdded ? "Район в блокноте" : "Добавить район"}
          </Button>
        </Stack>
      </Box>

      {/* Масштаб карты */}
      <Box
        sx={{
          position: "absolute",
          bottom: 18,
          right: 18,
          px: 1.5,
          py: 1,
          bgcolor: "rgba(255,255,255,.9)",
          borderRadius: 2,
          color: "#64748b",
          fontSize: 11,
          boxShadow: "0 2px 8px rgba(0,0,0,.1)",
        }}
      >
        ━━━━━━ 500 м
      </Box>
    </Box>
  );
}

function MapPin({
  x,
  y,
  color,
  icon,
}: {
  x: number;
  y: number;
  color: string;
  icon: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 22 C-4 13 -18 2 -18 -8 A18 18 0 1 1 18 -8 C18 2 4 13 0 22 Z"
        fill={color}
        stroke="white"
        strokeWidth="3"
      />
      <circle cy="-8" r="11" fill="white" />
      <text
        x="0"
        y="-3"
        textAnchor="middle"
        fontSize="13"
        fontWeight="bold"
        fill={color}
      >
        {icon}
      </text>
    </g>
  );
}

function Label({ x, y, text }: { x: number; y: number; text: string }) {
  const width = text.length * 7 + 20;

  return (
    <g transform={`translate(${x - width / 2} ${y})`}>
      <rect width={width} height="25" rx="12" fill="white" stroke="#e2e8f0" />
      <text x={width / 2} y="16" textAnchor="middle" fill="#334155">
        {text}
      </text>
    </g>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          bgcolor: "#f1f5f9",
          borderRadius: "50%",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography fontSize={10} color="#64748b">
          {label}
        </Typography>
        <Typography fontSize={14} fontWeight={800} color="#1e293b">
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}
