// components/tasks/photo_detective/PhotoDossierPanel.tsx
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import LockOpen from "@mui/icons-material/LockOpen";

export interface DossierField {
  id: string;
  label: string;
  icon: string;
  value: string;
}

interface Props {
  allFields: DossierField[];
  unlockedIds: string[];
  totalFound: number;
  totalHotspots: number;
}

export default function PhotoDossierPanel({
  allFields,
  unlockedIds,
  totalFound,
  totalHotspots,
}: Props) {
  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: "2px solid #F59E0B",
        backgroundColor: "#FFFBEB",
        overflow: "hidden",
      }}
    >
      {/* Заголовок */}
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          color: "#fff",
        }}
      >
        <Typography
          fontSize={11}
          sx={{
            opacity: 0.85,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Досье
        </Typography>
        <Typography fontWeight={800} fontSize={16}>
          📋 Дело №001
        </Typography>
      </Box>

      {/* Поля */}
      <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
        <Stack spacing={1}>
          {allFields.map((f) => {
            const unlocked = unlockedIds.includes(f.id);
            return (
              <Box
                key={f.id}
                sx={{
                  p: 1.25,
                  borderRadius: "10px",
                  backgroundColor: unlocked ? "#FFFFFF" : "#F3F4F6",
                  border: `1px solid ${unlocked ? "#FCD34D" : "#E5E7EB"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  transition: "all 0.4s ease",
                  animation: unlocked
                    ? "fieldUnlock 0.5s ease both"
                    : undefined,
                  "@keyframes fieldUnlock": {
                    "0%": { transform: "scale(0.95)", opacity: 0.6 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              >
                <Typography fontSize={20}>{f.icon}</Typography>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    fontSize={10}
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#9CA3AF",
                      fontWeight: 700,
                    }}
                  >
                    {f.label}
                  </Typography>
                  <Typography
                    fontSize={13.5}
                    fontWeight={unlocked ? 700 : 500}
                    color={unlocked ? "#1F2937" : "#9CA3AF"}
                    sx={{ wordBreak: "break-word" }}
                  >
                    {unlocked ? f.value : "???"}
                  </Typography>
                </Box>
                {unlocked && (
                  <LockOpen sx={{ fontSize: 14, color: "#22C55E" }} />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Прогресс */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #FCD34D",
          backgroundColor: "#FEF3C7",
        }}
      >
        <Chip
          label={`Найдено улик: ${totalFound}/${totalHotspots}`}
          sx={{
            bgcolor: "#FFFFFF",
            color: "#92400E",
            fontWeight: 700,
            width: "100%",
          }}
        />
      </Box>
    </Paper>
  );
}
