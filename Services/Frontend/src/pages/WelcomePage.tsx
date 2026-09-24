// src/pages/WelcomePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Layout from "../components/Layout";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Автоматический переход между экранами
  useEffect(() => {
    if (step >= 2) return;
    const t = setTimeout(() => setStep((s) => s + 1), 4000);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          px: 3,
        }}
      >
        {/* Декоративные блобы на фоне */}
        <Box
          sx={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            top: "-20%",
            left: "-15%",
            background:
              "radial-gradient(circle, rgba(124,77,255,0.35) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            animation: "floatA 12s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            bottom: "-20%",
            right: "-15%",
            background:
              "radial-gradient(circle, rgba(236,64,122,0.35) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            animation: "floatB 14s ease-in-out infinite",
          }}
        />

        <Stack
          spacing={4}
          alignItems="center"
          sx={{
            maxWidth: 900,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Экран 1 — заставка */}
          <Box
            sx={{
              fontSize: { xs: 100, sm: 140, md: 180 },
              lineHeight: 1,
              filter: "drop-shadow(0 20px 40px rgba(124,77,255,0.35))",
              animation: "popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both",
              "@keyframes popIn": {
                "0%": { transform: "scale(0) rotate(-30deg)", opacity: 0 },
                "60%": { transform: "scale(1.15) rotate(6deg)", opacity: 1 },
                "100%": { transform: "scale(1) rotate(0deg)" },
              },
            }}
          >
            🧪
          </Box>

          <Typography
            variant="h2"
            fontWeight={900}
            sx={{
              fontSize: { xs: 28, sm: 40, md: 52 },
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              background:
                "linear-gradient(135deg, #7C4DFF 0%, #EC407A 60%, #FFCA28 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "slideUp 0.7s ease 0.2s both",
              "@keyframes slideUp": {
                "0%": { transform: "translateY(30px)", opacity: 0 },
                "100%": { transform: "translateY(0)", opacity: 1 },
              },
            }}
          >
            Добро пожаловать в «Лабораторию цифровой безопасности»!
          </Typography>

          {/* Экран 2 — суть */}
          {step >= 1 && (
            <Stack
              spacing={2}
              sx={{
                animation: "slideUp 0.7s ease both",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "#1A1A2E", lineHeight: 1.5 }}
              >
                Сегодня тебе предстоит занятие на{" "}
                <span style={{ color: "#7C4DFF" }}>
                  «Тренажёре цифровых угроз»
                </span>
                .
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: 18,
                  lineHeight: 1.7,
                  maxWidth: 700,
                }}
              >
                Перед тобой появятся задания, благодаря которым ты научишься
                выявлять мошеннические схемы.
              </Typography>
            </Stack>
          )}

          {/* Экран 3 — призыв */}
          {step >= 2 && (
            <Stack
              spacing={3}
              alignItems="center"
              sx={{ animation: "slideUp 0.7s ease both", mt: 2 }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: "#1A1A2E" }}
              >
                Ну что, ты готов? Тогда жми на старт!
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<RocketLaunchIcon />}
                onClick={() => navigate("/blocks")}
                sx={{
                  py: 2.5,
                  px: 8,
                  fontSize: 22,
                  fontWeight: 900,
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
                  boxShadow: "0 12px 40px rgba(124,77,255,0.45)",
                  transition: "all 0.25s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.03)",
                    boxShadow: "0 20px 60px rgba(124,77,255,0.6)",
                    background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
                  },
                  "&:active": {
                    transform: "translateY(-2px) scale(1.01)",
                  },
                }}
              >
                Старт
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </Layout>
  );
}
