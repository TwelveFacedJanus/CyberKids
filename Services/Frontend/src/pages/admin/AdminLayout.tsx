// pages/admin/AdminLayout.tsx
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Box, Tab, Tabs, Paper, Typography } from "@mui/material";
import QueryStats from "@mui/icons-material/QueryStats";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import ExtensionOutlined from "@mui/icons-material/ExtensionOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined"; // 🆕
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const tabs = [
  {
    value: "/admin",
    to: "/admin",
    label: "Статистика",
    Icon: QueryStats,
    end: true,
  },
  {
    value: "/admin/users",
    to: "/admin/users",
    label: "Пользователи",
    Icon: GroupOutlined,
    end: false,
  },
  {
    value: "/admin/groups",
    to: "/admin/groups",
    label: "Группы",
    Icon: PeopleOutlined,
    end: false,
  }, // 🆕
  {
    value: "/admin/results",
    to: "/admin/results",
    label: "Результаты",
    Icon: InsightsOutlined,
    end: false,
  },
  {
    value: "/admin/tasks",
    to: "/admin/tasks",
    label: "Задания",
    Icon: ExtensionOutlined,
    end: false,
  },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user?.roles.includes("admin")) return <Navigate to="/" replace />;

  const active = tabs.find((t) =>
    t.end
      ? location.pathname === t.value
      : location.pathname.startsWith(t.value),
  )?.value;

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ color: "#1A1A2E", mb: 0.5 }}
        >
          📊 Админ-панель
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Управление пользователями, группами, заданиями и аналитика платформы
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 1,
          borderRadius: "16px",
          backgroundColor: "#F8F9FA",
          border: "1px solid #F1F1F1",
          mb: 4,
        }}
      >
        <Tabs
          value={active}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#F1EBFF",
              },
              "&.Mui-selected": {
                backgroundColor: "#7C4DFF",
                color: "#FFFFFF",
              },
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          {tabs.map(({ to, label, Icon, end, value }) => (
            <Tab
              key={to}
              value={value}
              label={label}
              icon={<Icon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              component={NavLink}
              to={to}
              end={end}
              sx={{
                textTransform: "none",
                fontSize: "0.9rem",
                minHeight: 48,
              }}
            />
          ))}
        </Tabs>
      </Paper>

      <Box>
        <Outlet />
      </Box>
    </Layout>
  );
}
