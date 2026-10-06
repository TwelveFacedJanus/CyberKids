import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";

const appear = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const enterFromRight = keyframes`
  from { opacity: 0; transform: translateX(80px); }
  to { opacity: 1; transform: translateX(0); }
`;

const enterFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-80px); }
  to { opacity: 1; transform: translateX(0); }
`;

const softFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const rocketAway = keyframes`
  from { opacity: 1; transform: translate(0, 0) rotate(0); }
  to { opacity: 0; transform: translate(180px, -220px) rotate(24deg); }
`;

const sparkAway = keyframes`
  from { opacity: 1; transform: translate(0, 0) rotate(0); }
  to { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--turn)); }
`;

const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
};

const sparks = Array.from({ length: 24 }, (_, index) => {
  const angle = (index / 24) * Math.PI * 2;
  const distance = 80 + (index % 4) * 22;
  return {
    dx: `${Math.cos(angle) * distance}px`,
    dy: `${Math.sin(angle) * distance}px`,
    turn: `${(index % 2 ? 1 : -1) * (180 + index * 8)}deg`,
    color: ["#F45B35", "#FFD447", "#11BFA4", "#F28BA8"][index % 4],
  };
});

export default function WelcomePage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [launching, setLaunching] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const startRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (stage >= 3 || launching) return;
    const timer = window.setTimeout(
      () => setStage((current) => current + 1),
      4200,
    );
    return () => window.clearTimeout(timer);
  }, [stage, launching]);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const start = () => {
    if (!startRef.current || launching) return;
    const rect = startRef.current.getBoundingClientRect();
    setBurstOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setLaunching(true);
    timerRef.current = window.setTimeout(() => navigate("/blocks"), 1100);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100dvh",
        minHeight: 560,
        overflow: "hidden",
        position: "relative",
        bgcolor: "#FFF8EC",
        color: "#263238",
        fontFamily: '"Nunito", "Segoe UI", sans-serif',
      }}
    >
      {/* Flat shapes keep the page playful without the usual AI-style blob background. */}
      <Box
        sx={{
          position: "absolute",
          top: "8%",
          left: "3%",
          width: 16,
          height: 16,
          bgcolor: "#F45B35",
          transform: "rotate(18deg)",
          ...reduceMotion,
          animation: `${softFloat} 4s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "18%",
          right: "6%",
          width: 24,
          height: 24,
          borderRadius: "50%",
          bgcolor: "#FFD447",
          ...reduceMotion,
          animation: `${softFloat} 5s ease-in-out .3s infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "13%",
          left: "7%",
          width: 22,
          height: 22,
          borderRadius: "50%",
          bgcolor: "#11BFA4",
          ...reduceMotion,
          animation: `${softFloat} 4.5s ease-in-out .6s infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "18%",
          right: "4%",
          width: 18,
          height: 18,
          bgcolor: "#F28BA8",
          transform: "rotate(45deg)",
          ...reduceMotion,
          animation: `${softFloat} 5.5s ease-in-out .5s infinite`,
        }}
      />

      {launching && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <RocketLaunchRoundedIcon
            sx={{
              position: "absolute",
              left: burstOrigin.x,
              top: burstOrigin.y,
              fontSize: 54,
              color: "#F45B35",
              animation: `${rocketAway} 1.1s cubic-bezier(.2,.8,.3,1) forwards`,
              ...reduceMotion,
            }}
          />
          {sparks.map((spark, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                left: burstOrigin.x,
                top: burstOrigin.y,
                width: index % 2 ? 10 : 7,
                height: index % 2 ? 7 : 10,
                borderRadius: index % 3 ? 2 : "50%",
                bgcolor: spark.color,
                "--dx": spark.dx,
                "--dy": spark.dy,
                "--turn": spark.turn,
                animation: `${sparkAway} .9s cubic-bezier(.2,.8,.3,1) ${index * 14}ms forwards`,
                ...reduceMotion,
              }}
            />
          ))}
        </Box>
      )}

      <Stack
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
          px: { xs: "5vw", sm: "6vw", lg: "8vw" },
          pt: { xs: "5vh", md: "7vh" },
          pb: { xs: "9vh", md: "7vh" },
          boxSizing: "border-box",
        }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, md: 2.5 },
            animation: `${appear} .7s ease both`,
            ...reduceMotion,
          }}
        >
          <Box
            component="img"
            src="/ui-icons/k1.png"
            alt="CyberKids"
            sx={{
              width: { xs: 54, md: 76 },
              height: { xs: 54, md: 76 },
              objectFit: "contain",
              animation: `${softFloat} 4s ease-in-out infinite`,
              ...reduceMotion,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.35rem", sm: "1.8rem", md: "2.25rem" },
                fontWeight: 900,
                lineHeight: 1,
                color: "#F45B35",
              }}
            >
              CyberKids
            </Typography>
            <Typography
              sx={{
                mt: 0.7,
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.15rem" },
                fontWeight: 800,
                letterSpacing: ".04em",
                color: "#52616B",
              }}
            >
              ЛАБОРАТОРИЯ ЦИФРОВОЙ БЕЗОПАСНОСТИ
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
            gap: { xs: 2, md: 3 },
            alignItems: "center",
            minHeight: 0,
            flex: 1,
            py: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              gridColumn: { md: "span 5" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              animation: `${appear} .75s ease .15s both`,
              ...reduceMotion,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "clamp(2rem, 8vw, 3rem)",
                  sm: "clamp(2.5rem, 5vw, 4.4rem)",
                },
                fontWeight: 900,
                lineHeight: 0.98,
                letterSpacing: "-.035em",
                color: "#263238",
                maxWidth: 600,
              }}
            >
              Интернет — это навык.
              <Box component="span" sx={{ display: "block", color: "#F45B35" }}>
                Прокачай его!
              </Box>
            </Typography>
            <Typography
              sx={{
                mt: { xs: 2, md: 3 },
                maxWidth: 520,
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                lineHeight: 1.5,
                color: "#52616B",
                fontWeight: 600,
              }}
            >
              Разбирай реальные цифровые ловушки, принимай решения и становись
              увереннее в сети.
            </Typography>
            <Box
              sx={{
                mt: { xs: 2, md: 3 },
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#11A58D",
                fontWeight: 800,
                fontSize: { xs: ".9rem", md: "1.05rem" },
              }}
            >
              <CheckCircleRoundedIcon /> Без скучных лекций
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: { md: "span 7" },
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, md: 2.5 }}
              sx={{ width: "100%", maxWidth: 900 }}
            >
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 2, md: 3 },
                  minHeight: { xs: 105, sm: 210 },
                  borderRadius: "24px",
                  bgcolor: "#FFE2D8",
                  border: "3px solid #F45B35",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  animation:
                    stage >= 1 ? `${enterFromRight} .7s ease both` : "none",
                  opacity: stage >= 1 ? 1 : 0,
                  ...reduceMotion,
                }}
              >
                <Typography sx={{ fontSize: { xs: "1.5rem", md: "2.3rem" } }}>
                  🎯
                </Typography>
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.3rem" },
                      fontWeight: 900,
                      color: "#D94726",
                    }}
                  >
                    Замечай ловушки
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block" },
                      mt: 1,
                      fontSize: "1rem",
                      lineHeight: 1.35,
                      color: "#52616B",
                    }}
                  >
                    Фишинг, обман в играх и подозрительные сообщения.
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 2, md: 3 },
                  minHeight: { xs: 105, sm: 210 },
                  borderRadius: "24px",
                  bgcolor: "#FFF0B8",
                  border: "3px solid #E5B923",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  animation:
                    stage >= 2 ? `${enterFromRight} .7s ease both` : "none",
                  opacity: stage >= 2 ? 1 : 0,
                  ...reduceMotion,
                }}
              >
                <Typography sx={{ fontSize: { xs: "1.5rem", md: "2.3rem" } }}>
                  ⭐
                </Typography>
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.3rem" },
                      fontWeight: 900,
                      color: "#9A7412",
                    }}
                  >
                    Выбирай умно
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block" },
                      mt: 1,
                      fontSize: "1rem",
                      lineHeight: 1.35,
                      color: "#52616B",
                    }}
                  >
                    Тренируй внимательность в коротких интерактивных заданиях.
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 2, md: 3 },
                  minHeight: { xs: 105, sm: 210 },
                  borderRadius: "24px",
                  bgcolor: "#D8F5EE",
                  border: "3px solid #11BFA4",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  animation:
                    stage >= 3 ? `${enterFromLeft} .7s ease both` : "none",
                  opacity: stage >= 3 ? 1 : 0,
                  ...reduceMotion,
                }}
              >
                <Typography sx={{ fontSize: { xs: "1.5rem", md: "2.3rem" } }}>
                  🚀
                </Typography>
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.3rem" },
                      fontWeight: 900,
                      color: "#078B77",
                    }}
                  >
                    Действуй смело
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block" },
                      mt: 1,
                      fontSize: "1rem",
                      lineHeight: 1.35,
                      color: "#52616B",
                    }}
                  >
                    Собери знания и отправляйся в первый блок.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            minHeight: { xs: 48, md: 64 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {stage >= 3 ? (
            <Button
              ref={startRef}
              onClick={start}
              disabled={launching}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 1.3, md: 1.8 },
                borderRadius: "18px",
                bgcolor: "#F45B35",
                color: "#FFF",
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 900,
                boxShadow: "0 10px 24px rgba(244,91,53,.28)",
                "&:hover": {
                  bgcolor: "#D94726",
                  transform: "translateY(-3px)",
                },
                ...reduceMotion,
              }}
            >
              Начать тренировку
            </Button>
          ) : (
            <Typography
              sx={{
                color: "#81909A",
                fontWeight: 700,
                fontSize: { xs: ".85rem", md: "1rem" },
              }}
            >
              Собираем маршрут обучения...
            </Typography>
          )}
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          position: "fixed",
          left: "50%",
          bottom: { xs: 14, md: 22 },
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <Box
            key={index}
            component="button"
            aria-label={`Этап ${index + 1}`}
            onClick={() => setStage(index)}
            // disabled={index > stage}
            sx={{
              width: index === stage ? 42 : 12,
              height: 12,
              p: 0,
              border: 0,
              borderRadius: 8,
              bgcolor: index <= stage ? "#F45B35" : "#D7CFC5",
              cursor: index <= stage ? "pointer" : "default",
              transition: "width .35s ease, background-color .35s ease",
              "&:hover": index <= stage ? { bgcolor: "#D94726" } : {},
              ...reduceMotion,
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
