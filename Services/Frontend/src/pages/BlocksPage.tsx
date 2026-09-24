// src/pages/BlocksPage.tsx
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Layout from "../components/Layout";
import { topicColors, topicLabels } from "../theme";

const BLOCKS = [
  { key: "phishing", emoji: "🎣" },
  { key: "cyberbullying", emoji: "🛡️" },
  { key: "passwords", emoji: "🔑" },
  { key: "viruses", emoji: "🦠" },
  { key: "privacy", emoji: "🔒" },
  { key: "gaming_scams", emoji: "🎮" },
  { key: "digital_footprint", emoji: "👣" },
];

const DESCRIPTIONS: Record<string, string> = {
  phishing: "Как распознать поддельные сайты и сообщения",
  cyberbullying: "Что делать, если тебя обижают в сети",
  passwords: "Как придумать надёжный пароль",
  viruses: "Как защитить компьютер от вредных программ",
  privacy: "Что можно, а что нельзя рассказывать о себе",
  gaming_scams: "Как не попасться на уловки в играх",
  digital_footprint: "Что остаётся в интернете после тебя",
};

export default function BlocksPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box>
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            mb: 1,
            background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Выбери блок заданий
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          7 тем — от фишинга до цифрового следа. Проходи в любом порядке.
        </Typography>

        <Grid container spacing={3}>
          {BLOCKS.map((b, i) => {
            const color = topicColors[b.key] || "#7C4DFF";
            const label = topicLabels[b.key] || b.key;
            const desc = DESCRIPTIONS[b.key] || "";

            return (
              <Grid item xs={12} sm={6} md={4} key={b.key}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    borderTop: `6px solid ${color}`,
                    height: "100%",
                    background: "#FFFFFF",
                    transition: "all 0.3s ease",
                    animation: `cardIn 0.6s ease ${i * 0.08}s both`,
                    "@keyframes cardIn": {
                      "0%": { opacity: 0, transform: "translateY(20px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 20px 40px ${color}40`,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/block/${b.key}`)}
                    sx={{ p: 4, height: "100%" }}
                  >
                    <Stack spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: "18px",
                          background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 38,
                          boxShadow: `0 8px 24px ${color}55`,
                        }}
                      >
                        {b.emoji}
                      </Box>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{ color: "#1A1A2E" }}
                      >
                        {label}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {desc}
                      </Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Layout>
  );
}
