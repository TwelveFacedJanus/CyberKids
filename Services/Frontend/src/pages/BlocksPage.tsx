// BlocksPage.tsx - Полностью переработанная страница с блоками
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import Layout from "../components/Layout";
import { topicColors, topicLabels } from "../theme";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

export const BLOCKS = [
  { key: "gaming_scams", icon: "/ui-icons/game_scams.png" },
  { key: "fake_friends", icon: "/ui-icons/fake_friends.png" },
  { key: "ai_traps", icon: "/ui-icons/ai_traps.png" },
  { key: "easy_money", icon: "/ui-icons/free_money.png" },
  { key: "digital_footprint", icon: "/ui-icons/digital_step.png" },
  { key: "school_trap", icon: "/ui-icons/school_trap.png" },
  { key: "cybersecurity", icon: "/ui-icons/cybersecurity.png" },
];

const DESCRIPTIONS: Record<string, string> = {
  gaming_scams:
    "Научись распознавать фейковые конкурсы, бесплатные робуксы и кражу игровых аккаунтов!",
  fake_friends:
    "Узнай, как мошенники притворяются друзьями и крадут твои данные",
  ai_traps:
    "Разберись с голосовыми дипфейками, поддельными видео и умными ботами-обманщиками",
  easy_money:
    "Поймёшь, почему «лёгкие деньги» — это ловушка, и как не попасться",
  digital_footprint:
    "Узнай, какие следы ты оставляешь в интернете и кто может их найти",
  school_trap:
    "Изучи фейковые олимпиады, поддельные чаты классов и «учителей»-мошенников",
  cybersecurity:
    "Освой основы: фишинг, надёжные пароли, вирусы и защиту личных данных",
};

/* ═══════════════ АНИМАЦИИ ═══════════════ */
const bounceIn = keyframes`
  0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.05) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;
const slideInUp = keyframes`
  0% { transform: translateY(60px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;
const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-3deg); }
  20%, 40%, 60%, 80% { transform: rotate(3deg); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;
const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export default function BlocksPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box>
        {/* ══════ ЗАГОЛОВОК С ДЕКОРОМ ══════ */}
        <Box
          sx={{
            position: "relative",
            mb: 6,
            p: { xs: 4, md: 6 },
            borderRadius: "40px",
            background: "linear-gradient(135deg, #FFFFFF, #FFF9F0)",
            boxShadow: "0 20px 60px rgba(255,107,53,0.15)",
            overflow: "hidden",
            animation: `${bounceIn} 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) both`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "200%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,210,63,0.3), transparent)",
              animation: `${shine} 3s infinite`,
            },
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                textAlign: "center",
                background:
                  "linear-gradient(135deg, #FF6B35, #FF8C42, #FFD23F)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Выбери своё приключение!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "#2C3E50",
                maxWidth: 800,
                fontWeight: 600,
              }}
            >
              7 увлекательных тем от игровых мошенничеств до ловушек с
              искусственным интеллектом. Проходи в любом порядке и зарабатывай
              баллы! ⭐
            </Typography>
          </Stack>

          {/* Декоративные элементы */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 30,
              fontSize: 60,
              animation: `${wiggle} 2s ease-in-out infinite`,
            }}
          >
            🔐
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 40,
              fontSize: 50,
              animation: `${float} 3s ease-in-out infinite`,
            }}
          >
            🛡️
          </Box>
        </Box>

        {/* ══════ СЕТКА БЛОКОВ ══════ */}
        <Grid container spacing={4}>
          {BLOCKS.map((b, i) => {
            const color = topicColors[b.key] || "#FF6B35";
            const label = topicLabels[b.key] || b.key;
            const desc = DESCRIPTIONS[b.key] || "";

            return (
              <Grid item xs={12} sm={6} md={4} key={b.key}>
                <Card
                  sx={{
                    borderRadius: "32px",
                    height: "100%",
                    background: "#FFFFFF",
                    boxShadow: `0 12px 40px ${color}30`,
                    border: `4px solid transparent`,
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    animation: `${slideInUp} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
                    position: "relative",
                    overflow: "visible",
                    "&:hover": {
                      transform: "translateY(-16px) scale(1.05) rotate(2deg)",
                      boxShadow: `0 24px 80px ${color}50`,
                      border: `4px solid ${color}`,
                      "& .play-icon": {
                        transform: "scale(1.3) rotate(90deg)",
                        opacity: 1,
                      },
                      "& .card-image": {
                        transform: "scale(1.1) rotate(-5deg)",
                        filter: "brightness(1) invert(0) blur(0px) opacity(1)",
                      },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={b.icon}
                    alt={label}
                    className="card-image"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 420,
                      height: 420,
                      objectFit: "contain",
                      filter: "brightness(1) invert(0) blur(5px) opacity(0.4)",
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onError={(e) => {
                      // Если картинка не загрузилась - показываем эмодзи
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div style="font-size: 80px;">🎮</div>`;
                      }
                    }}
                  />
                  <CardActionArea
                    onClick={() => navigate(`/block/${b.key}`)}
                    sx={{ p: 4, height: "100%", position: "relative" }}
                  >
                    <Stack spacing={3} alignItems="center">
                      {/* ═══ ИКОНКА/КАРТИНКА БЛОКА ═══ */}
                      <Box
                        sx={{
                          width: 140,
                          height: 140,
                          borderRadius: "28px",
                          // background: `linear-gradient(135deg, ${color}, ${color}DD)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // boxShadow: `0 12px 32px ${color}60`,
                          position: "relative",
                          overflow: "hidden",
                          transition:
                            "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      >
                        {/* Если иконка существует */}
                        {/* <Box
                          component="img"
                          src={b.icon}
                          alt={label}
                          className="card-image"
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: "contain",
                            filter: "brightness(1) invert(0)",
                            transition:
                              "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                          onError={(e) => {
                            // Если картинка не загрузилась - показываем эмодзи
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div style="font-size: 80px;">🎮</div>`;
                            }
                          }}
                        /> */}

                        {/* Иконка воспроизведения */}
                        <Box
                          className="play-icon"
                          sx={{
                            position: "absolute",
                            bottom: "50%",
                            right: "50",
                            transform: "translate(50%, 50%)",
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: "#FFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                            opacity: 0.7,
                            transition:
                              "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        >
                          <PlayArrowRoundedIcon sx={{ fontSize: 32, color }} />
                        </Box>
                      </Box>

                      {/* ═══ ЗАГОЛОВОК ═══ */}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: color,
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {label}
                      </Typography>

                      {/* ═══ ОПИСАНИЕ ═══ */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#2C3E50",
                          lineHeight: 1.8,
                          textAlign: "center",
                        }}
                      >
                        {desc}
                      </Typography>

                      {/* ═══ КНОПКА "НАЧАТЬ" ═══ */}
                      <Box
                        sx={{
                          mt: "auto",
                          px: 4,
                          py: 1.5,
                          borderRadius: "20px",
                          background: `linear-gradient(135deg, ${color}, ${color}DD)`,
                          color: "#FFF",
                          fontWeight: 800,
                          fontSize: "1.125rem",
                          boxShadow: `0 6px 20px ${color}40`,
                          transition:
                            "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: `0 8px 28px ${color}60`,
                          },
                        }}
                      >
                        Начать →
                      </Box>
                    </Stack>
                  </CardActionArea>

                  {/* ═══ МЕТКА "НОВОЕ" (пример для первого блока) ═══ */}
                  {i === 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        px: 2,
                        py: 0.75,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #FF6B9D, #FF8C42)",
                        color: "#FFF",
                        fontSize: "0.875rem",
                        fontWeight: 900,
                        boxShadow: "0 4px 16px rgba(255,107,157,0.5)",
                        animation: `${wiggle} 1.5s ease-in-out infinite`,
                      }}
                    >
                      🔥 НОВОЕ!
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* ══════ НИЖНИЙ ПРИЗЫВ К ДЕЙСТВИЮ ══════ */}
        <Box
          sx={{
            mt: 8,
            p: { xs: 4, md: 6 },
            borderRadius: "40px",
            background: "linear-gradient(135deg, #FF6B35, #FFD23F)",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(255,107,53,0.4)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "#FFF",
              mb: 2,
            }}
          >
            🏆 Стань мастером кибербезопасности!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#FFF",
              opacity: 0.95,
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Проходи все блоки, зарабатывай баллы и получай награды. Чем больше
            заданий выполнишь — тем круче станешь! 💪
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
