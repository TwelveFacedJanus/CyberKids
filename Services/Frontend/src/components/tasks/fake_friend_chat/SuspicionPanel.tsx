// components/tasks/fake_friend_chat/SuspicionPanel.tsx
import { Box, Paper, Stack, Typography } from "@mui/material";
import WarningAmber from "@mui/icons-material/WarningAmber";

interface RedFlag {
  id: string;
  label: string;
  hint?: string;
}

interface Props {
  allFlags: RedFlag[];
  foundFlags: string[];
}

export default function SuspicionPanel({ allFlags, foundFlags }: Props) {
  return (
    <Paper
      sx={{
        borderRadius: "16px",
        border: "2px solid #F59E0B",
        backgroundColor: "#FFFBEB",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          Подозрения
        </Typography>
        <Typography fontWeight={800} fontSize={16}>
          🚩 Красные флаги
        </Typography>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
        <Stack spacing={1}>
          {allFlags.map((f) => {
            const found = foundFlags.includes(f.id);
            return (
              <Box
                key={f.id}
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  backgroundColor: found ? "#FFFFFF" : "#F3F4F6",
                  border: `1px solid ${found ? "#FCD34D" : "#E5E7EB"}`,
                  transition: "all 0.4s ease",
                  animation: found ? "flagIn 0.5s ease both" : undefined,
                  "@keyframes flagIn": {
                    "0%": { opacity: 0, transform: "translateX(10px)" },
                    "100%": { opacity: 1, transform: "translateX(0)" },
                  },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <WarningAmber
                    sx={{
                      fontSize: 18,
                      color: found ? "#F59E0B" : "#D1D5DB",
                      mt: 0.25,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography
                      fontSize={13}
                      fontWeight={found ? 700 : 500}
                      color={found ? "#92400E" : "#9CA3AF"}
                    >
                      {found ? f.label : "???"}
                    </Typography>
                    {found && f.hint && (
                      <Typography
                        fontSize={11}
                        color="text.secondary"
                        sx={{ mt: 0.25, lineHeight: 1.4 }}
                      >
                        {f.hint}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #FCD34D",
          backgroundColor: "#FEF3C7",
        }}
      >
        <Typography fontSize={12} fontWeight={700} color="#92400E">
          Найдено: {foundFlags.length} / {allFlags.length}
        </Typography>
      </Box>
    </Paper>
  );
}
