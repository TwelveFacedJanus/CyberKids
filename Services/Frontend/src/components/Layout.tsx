// components/Layout.tsx
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import StarIcon from "@mui/icons-material/Star";
import QuizIcon from "@mui/icons-material/Quiz";
import SecurityIcon from "@mui/icons-material/Security";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import type { Result } from "../types";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

import { SvgIcon } from "@mui/material";
import HomeIcon from "../../public/ui-icons/home.svg?react";
import ChatIcon from "../../public/ui-icons/message.svg?react";
import ProfileIcon from "../../public/ui-icons/user.svg?react";
import KasperskyIcon from "../../public/ui-icons/kaspersky.svg?react";
import SuperheroIcon from "../../public/ui-icons/superhero.svg?react";
import AdminIcon from "../../public/ui-icons/admin.svg?react";

const SIDEBAR_WIDTH = 280;

// 🆕 Темы для разных страниц
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
    divider: "rgba(8, 8, 8, 0.1)",
    activeBg: "#7C4DFF",
    activeColor: "#FFFFFF",
    pageBg: "#F8F9FA",
  },
  kaspersky: {
    sidebarBg: "#00A651",
    sidebarBorder: "rgba(255,255,255,0.15)",
    logoBg: "rgba(255,255,255,0.25)",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255,255,255,0.8)",
    hoverBg: "rgba(255,255,255,0.15)",
    divider: "rgba(0, 196, 95, 0.87)",
    activeBg: "rgba(255,255,255,0.25)",
    activeColor: "#FFFFFF",
    // pageBg: "linear-gradient(135deg, #00A651 0%, #76FF03 100%)",
    pageBg: "#F8F9FA",
  },
  mailru: {
    sidebarBg: "rgb(8, 8, 8)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    logoBg: "linear-gradient(135deg, #005FF9, #00A3FF)",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255,255,255,0.5)",
    hoverBg: "rgba(0, 95, 249, 0.15)",
    divider: "rgba(49, 49, 49, 0.1)",
    activeBg: "#0041aa",
    activeColor: "#FFFFFF",
    pageBg: "#000000",
  },
  alex: {
    sidebarBg: "linear-gradient(180deg, #FF6B35 0%, #F72585 100%)",
    sidebarBorder: "rgba(255,255,255,0.15)",
    logoBg: "rgba(255,255,255,0.25)",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255,255,255,0.7)",
    hoverBg: "rgba(255,255,255,0.15)",
    divider: "rgba(255,107,53,0.4)",
    activeBg: "rgba(255,255,255,0.25)",
    activeColor: "#FFFFFF",
    pageBg: "#1A1A2E", // тёмный фон
  },
};

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
    {
      label: "Главная",
      icon: <SvgIcon component={HomeIcon} sx={{ fontSize: 24 }} />,
      path: "/",
    },
    {
      label: "Мой профиль",
      icon: <SvgIcon component={ProfileIcon} sx={{ fontSize: 24 }} />,
      path: "/profile",
    },
    {
      label: "Это нормально или опасно?",
      icon: <SvgIcon component={KasperskyIcon} sx={{ fontSize: 24 }} />,
      path: "/test/safety",
    },
    {
      label: "Тест-игра: кибергерой",
      icon: <SvgIcon component={SuperheroIcon} sx={{ fontSize: 24 }} />,
      path: "/test/cyber-hero",
    },
    {
      label: "ALEX — квест",
      icon: <SvgIcon component={ChatIcon} sx={{ fontSize: 24 }} />,
      path: "/alex",
    },
  ];

  if (user?.roles?.includes("admin")) {
    menuItems.push({
      label: "Админ-панель",
      icon: <SvgIcon component={AdminIcon} sx={{ fontSize: 24 }} />,
      path: "/admin",
    });
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: t.pageBg}}>
      {/* Сайдбар */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          backgroundColor: t.sidebarBg,
          // borderRight: `1px solid ${t.sidebarBorder}`,
          boxShadow: `0 2px 160px ${t.divider}`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        {/* Логотип */}
        <Box
          sx={{
            p: 3,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            // borderBottom: `1px solid ${t.sidebarBorder}`,
            boxShadow: `0 0px 160px ${t.divider}`,
          }}
          onClick={() => navigate("/")}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: t.logoBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 20,
            }}
          >
            🚀
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: t.textColor }}>
            CyberKids
          </Typography>
        </Box>

        {/* Навигация */}
        <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <ListItem
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setCurrentPath(item.path);
                }}
                sx={{
                  borderRadius: "12px",
                  mb: 0.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive ? t.activeBg : "transparent",
                  color: isActive ? t.activeColor : t.textColor,
                  "&:hover": {
                    backgroundColor: t.hoverBg,
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: 2,
                }}
              >
                {/* 🆕 вместо ListItemIcon */}
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? t.activeColor : t.mutedColor,
                    flexShrink: 0,
                    "& svg": {
                      width: 24,
                      height: 24,
                      display: "block",
                    },
                  }}
                >
                  {item.icon}
                </Box>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "inherit",
                  }}
                  sx={{ m: 0 }}
                />
              </ListItem>
            );
          })}
        </List>

        {/* Профиль */}
        <Box
          sx={{
            p: 2,
            boxShadow: `0 0px 160px ${t.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor:
                  theme === "mailru"
                    ? "#005FF9"
                    : theme === "kaspersky"
                      ? "rgba(255,255,255,0.3)"
                      : "#7C4DFF",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {user?.full_name?.[0] || "?"}
            </Avatar>
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              fontWeight={700}
              noWrap
              sx={{ color: t.textColor }}
            >
              {user?.full_name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <StarIcon sx={{ fontSize: 16, color: "#FFCA28" }} />
              <Typography variant="caption" sx={{ color: t.mutedColor }}>
                {loadingScore ? (
                  <CircularProgress size={12} />
                ) : (
                  `${totalScore ?? 0} очков`
                )}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Меню профиля */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/profile");
            }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            Мой профиль
          </MenuItem>
          {user?.roles?.includes("admin") && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate("/admin");
              }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              Админ-панель
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
              navigate("/login");
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Menu>
      </Box>

      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: mailru || alex ? 0 : 4,
          maxWidth: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          background: t.pageBg,
          minHeight: "100vh",
          height: "100vh",
          overflow: alex ? "hidden" : "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
