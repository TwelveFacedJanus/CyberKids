// components/Layout.tsx
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  CircularProgress,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import StarIcon from "@mui/icons-material/Star";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import type { Result } from "../types";

import HomeIcon from "../../public/ui-icons/home.svg?react";
import ChatIcon from "../../public/ui-icons/message.svg?react";
import ProfileIcon from "../../public/ui-icons/user.svg?react";
import KasperskyIcon from "../../public/ui-icons/kaspersky.svg?react";
import SuperheroIcon from "../../public/ui-icons/superhero.svg?react";
import AdminIcon from "../../public/ui-icons/admin.svg?react";

const SIDEBAR_WIDTH = 280;

export type LayoutTheme = "default" | "kaspersky" | "mailru" | "alex";

interface LayoutProps {
  children: React.ReactNode;
  theme?: LayoutTheme;
}

const THEMES: Record<
  LayoutTheme,
  {
    sidebarBg: string;
    sidebarBorder: string;
    logoBg: string;
    textColor: string;
    mutedColor: string;
    hoverBg: string;
    divider: string;
    activeBg: string;
    activeColor: string;
    activeGlow: string;
    pageBg: string;
  }
> = {
  default: {
    sidebarBg: "#FFFFFF",
    sidebarBorder: "#F1F1F1",
    logoBg: "linear-gradient(135deg, #7C4DFF, #EC407A)",
    textColor: "#1A1A2E",
    mutedColor: "#6B7280",
    hoverBg: "#F1EBFF",
    divider: "rgba(8, 8, 8, 0.08)",
    activeBg: "linear-gradient(135deg, #7C4DFF, #EC407A)",
    activeColor: "#FFFFFF",
    activeGlow: "0 8px 24px rgba(124,77,255,0.35)",
    pageBg: "#F8F9FA",
  },
  kaspersky: {
    sidebarBg: "#00A651",
    sidebarBorder: "rgba(255,255,255,0.15)",
    logoBg: "rgba(255,255,255,0.25)",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255,255,255,0.8)",
    hoverBg: "rgba(255,255,255,0.15)",
    divider: "rgba(0, 196, 95, 0.4)",
    activeBg: "rgba(255,255,255,0.25)",
    activeColor: "#FFFFFF",
    activeGlow: "0 8px 24px rgba(0,0,0,0.25)",
    pageBg: "#F8F9FA",
  },
  mailru: {
    sidebarBg: "rgb(8, 8, 8)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    logoBg: "linear-gradient(135deg, #005FF9, #00A3FF)",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255,255,255,0.5)",
    hoverBg: "rgba(0, 95, 249, 0.15)",
    divider: "rgba(49, 49, 49, 0.4)",
    activeBg: "linear-gradient(135deg, #005FF9, #00A3FF)",
    activeColor: "#FFFFFF",
    activeGlow: "0 8px 24px rgba(0,95,249,0.5)",
    pageBg: "#000000",
  },
  alex: {
    sidebarBg: "linear-gradient(180deg, #FF6B35 0%, #F72585 100%)",
    sidebarBorder: "rgba(255,255,255,0.15)",
    logoBg: "rgba(255,255,255,0.25)",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255,255,255,0.7)",
    hoverBg: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.2)",
    activeBg: "rgba(255,255,255,0.25)",
    activeColor: "#FFFFFF",
    activeGlow: "0 8px 24px rgba(0,0,0,0.25)",
    pageBg: "#1A1A2E",
  },
};

/* ============================================================
   🎨 Анимированный фон
   ============================================================ */
function AnimatedBackground() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        top: 0,
        left: `${SIDEBAR_WIDTH}px`,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,

        "& .blob": {
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.55,
          willChange: "transform",
        },
        "& .blob-1": {
          width: 480, height: 480, top: "-10%", left: "-8%",
          background: "radial-gradient(circle, #7C4DFF 0%, transparent 70%)",
          animation: "blobFloat1 18s ease-in-out infinite",
        },
        "& .blob-2": {
          width: 520, height: 520, top: "30%", right: "-12%",
          background: "radial-gradient(circle, #EC407A 0%, transparent 70%)",
          animation: "blobFloat2 22s ease-in-out infinite",
        },
        "& .blob-3": {
          width: 420, height: 420, bottom: "-15%", left: "35%",
          background: "radial-gradient(circle, #00A3FF 0%, transparent 70%)",
          animation: "blobFloat3 26s ease-in-out infinite",
        },
        "& .grid": {
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(124,77,255,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 80%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 80%)",
        },

        "@keyframes blobFloat1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(120px, 60px) scale(1.15)" },
          "66%": { transform: "translate(60px, 140px) scale(0.9)" },
        },
        "@keyframes blobFloat2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-140px, 80px) scale(0.9)" },
          "66%": { transform: "translate(-60px, -100px) scale(1.2)" },
        },
        "@keyframes blobFloat3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-80px, -120px) scale(1.1)" },
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& .blob": { animation: "none" },
        },
      }}
    >
      <Box className="blob blob-1" />
      <Box className="blob blob-2" />
      <Box className="blob blob-3" />
      <Box className="grid" />
    </Box>
  );
}

export default function Layout({ children, theme = "default" }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [loadingScore, setLoadingScore] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const mailru = theme === "mailru";
  const alex = theme === "alex";

  const t = THEMES[theme];

  useEffect(() => {
    if (!user) return;
    api
      .get<Result[]>("/api/results/me")
      .then((results) => {
        const sum = results.reduce((acc, r) => acc + r.score, 0);
        setTotalScore(sum);
      })
      .catch(() => setTotalScore(0))
      .finally(() => setLoadingScore(false));
  }, [user]);

  const menuItems = [
    { label: "Главная", icon: <SvgIcon component={HomeIcon} sx={{ fontSize: 22 }} />, path: "/" },
    { label: "Мой профиль", icon: <SvgIcon component={ProfileIcon} sx={{ fontSize: 22 }} />, path: "/profile" },
    { label: "Это нормально или опасно?", icon: <SvgIcon component={KasperskyIcon} sx={{ fontSize: 22 }} />, path: "/test/safety" },
    { label: "Тест-игра: кибергерой", icon: <SvgIcon component={SuperheroIcon} sx={{ fontSize: 22 }} />, path: "/test/cyber-hero" },
    { label: "ALEX — квест", icon: <SvgIcon component={ChatIcon} sx={{ fontSize: 22 }} />, path: "/alex" },
  ];

  if (user?.roles?.includes("admin")) {
    menuItems.push({
      label: "Админ-панель",
      icon: <SvgIcon component={AdminIcon} sx={{ fontSize: 22 }} />,
      path: "/admin",
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: t.pageBg,
        position: "relative",
      }}
    >
      {theme === "default" && <AnimatedBackground />}

      {/* ==================== САЙДБАР ==================== */}
      <Box
        component="aside"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          backgroundColor: t.sidebarBg,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "hidden",
          transition: "all 0.3s ease",
          zIndex: 10,
          // Тонкая вертикальная «грань» между сайдбаром и контентом
          borderRight: `1px solid ${t.sidebarBorder}`,
        }}
      >
        {/* ─── ЛОГОТИП ─── */}
        <Box
          sx={{
            flexShrink: 0,
            px: 3,
            pt: 3,
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="CyberKids"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              maxWidth: "100%",
              maxHeight: 140,
              objectFit: "contain",
              userSelect: "none",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.03)" },
            }}
          />
        </Box>

        {/* ─── НАВИГАЦИЯ ─── */}
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            px: 2,
            pb: 1,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: t.sidebarBorder,
              borderRadius: 3,
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              px: 1.5,
              mb: 1,
              color: t.mutedColor,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: 11,
            }}
          >
            Меню
          </Typography>

          <List disablePadding>
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setCurrentPath(item.path);
                  }}
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    mb: 0.5,
                    px: 1.5,
                    py: 1.25,
                    minHeight: "auto",
                    gap: 1.5,

                    // Активный пункт — градиентный фон + свечение
                    background: isActive ? t.activeBg : "transparent",
                    color: isActive ? t.activeColor : t.textColor,
                    boxShadow: isActive ? t.activeGlow : "none",

                    transition: "all 0.2s ease",

                    "&:hover": {
                      background: isActive ? t.activeBg : t.hoverBg,
                      transform: "translateX(3px)",
                    },

                    // Индикатор слева для активного пункта
                    "&::before": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          left: -8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 4,
                          height: 24,
                          borderRadius: 2,
                          background: t.activeColor,
                          opacity: 0.9,
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "inherit",
                      "& svg": {
                        width: 22,
                        height: 22,
                        display: "block",
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 600,
                      fontSize: "0.9rem",
                      color: "inherit",
                      lineHeight: 1.3,
                    }}
                    sx={{ m: 0 }}
                  />

                  {isActive && (
                    <ChevronRightIcon
                      sx={{ fontSize: 18, opacity: 0.85 }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* ─── ПРОФИЛЬ ─── */}
        <Box
          sx={{
            flexShrink: 0,
            mx: 2,
            mb: 2,
            p: 1.5,
            borderRadius: "14px",
            backgroundColor: t.hoverBg,
            border: `1px solid ${t.sidebarBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: t.activeGlow,
            },
          }}
        >
          <Tooltip title="Меню профиля" arrow>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ p: 0 }}
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor:
                    theme === "mailru"
                      ? "#005FF9"
                      : theme === "kaspersky"
                        ? "rgba(255,255,255,0.3)"
                        : "linear-gradient(135deg, #7C4DFF, #EC407A)",
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                {user?.full_name?.[0] || "?"}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight={700}
              noWrap
              sx={{ color: t.textColor, fontSize: "0.85rem" }}
            >
              {user?.full_name || "Гость"}
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mt: 0.25 }}
            >
              <StarIcon sx={{ fontSize: 14, color: "#FFCA28" }} />
              <Typography
                variant="caption"
                sx={{ color: t.mutedColor, fontWeight: 600 }}
              >
                {loadingScore ? (
                  <CircularProgress size={10} />
                ) : (
                  `${totalScore ?? 0} очков`
                )}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* ─── МЕНЮ ПРОФИЛЯ ─── */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "12px",
                minWidth: 200,
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                mt: -1,
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/profile");
            }}
            sx={{ py: 1.2, borderRadius: "8px", mx: 0.5 }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Мой профиль
          </MenuItem>

          {user?.roles?.includes("admin") && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate("/admin");
              }}
              sx={{ py: 1.2, borderRadius: "8px", mx: 0.5 }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon fontSize="small" />
              </ListItemIcon>
              Админ-панель
            </MenuItem>
          )}

          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
              navigate("/login");
            }}
            sx={{
              py: 1.2,
              borderRadius: "8px",
              mx: 0.5,
              color: "#EF4444",
              "& .MuiListItemIcon-root": { color: "#EF4444" },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Menu>
      </Box>

      {/* ==================== ОСНОВНОЙ КОНТЕНТ ==================== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${SIDEBAR_WIDTH}px`,
          p: mailru || alex ? 0 : 4,
          minHeight: "100vh",
          height: "100vh",
          overflow: alex ? "hidden" : "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}