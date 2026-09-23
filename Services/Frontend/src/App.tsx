import { Navigate, Route, Routes } from "react-router-dom";
import { type ReactNode, useEffect, useState } from "react";
import { Snackbar, Alert, Button } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminGroupsPage from "./pages/admin/AdminGroupsPage";
import AdminResultsPage from "./pages/admin/AdminResultsPage";
import AdminStatsPage from "./pages/admin/AdminStatsPage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";
import TestSafetyPage from "./pages/TestSafetyPage";
import TestCyberHeroPage from "./pages/TestCyberHeroPage";
import AlexQuestPage from "./pages/AlexQuestPage";
import RobloxAuthPage from "./pages/RobloxAuthPage";

declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
      };
    };
    process?: {
      type: string;
      versions: Record<string, string>;
    };
  }
}

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    // ✅ Проверка на Electron без ошибок TypeScript
    const isElectron = (window as any).process?.type === "renderer";

    if (isElectron) {
      try {
        // ✅ Используем window.electron вместо require
        const electron = (window as any).electron;

        if (electron && electron.ipcRenderer) {
          electron.ipcRenderer.on("update_available", () => {
            setUpdateAvailable(true);
          });

          electron.ipcRenderer.on("update_downloaded", () => {
            setUpdateDownloaded(true);
            setUpdateAvailable(false);
          });

          return () => {
            electron.ipcRenderer.removeAllListeners("update_available");
            electron.ipcRenderer.removeAllListeners("update_downloaded");
          };
        }
      } catch (e) {
        console.log("Electron IPC не доступен");
      }
    }
  }, []);

  const handleRestart = () => {
    try {
      const electron = (window as any).electron;
      if (electron && electron.ipcRenderer) {
        electron.ipcRenderer.send("restart_app");
      }
    } catch (e) {
      console.log("Не удалось перезапустить приложение");
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route
          path="/task/:id"
          element={
            <Protected>
              <TaskPage />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />
        <Route
          path="/test/safety"
          element={
            <Protected>
              <TestSafetyPage />
            </Protected>
          }
        />
        <Route
          path="/test/cyber-hero"
          element={
            <Protected>
              <TestCyberHeroPage />
            </Protected>
          }
        />
        <Route
          path="/alex"
          element={
            <Protected>
              <AlexQuestPage />
            </Protected>
          }
        />
        <Route
          path="/roblox/com/auth"
          element={
            <Protected>
              <RobloxAuthPage />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminStatsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="groups" element={<AdminGroupsPage />} />
          <Route path="results" element={<AdminResultsPage />} />
          <Route path="tasks" element={<AdminTasksPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Уведомление о доступном обновлении */}
      {updateAvailable && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            🚀 Доступна новая версия! Обновление загружается...
          </Alert>
        </Snackbar>
      )}

      {/* Уведомление о загруженном обновлении */}
      {updateDownloaded && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            sx={{ width: "100%" }}
            action={
              <Button color="inherit" size="small" onClick={handleRestart}>
                Перезапустить
              </Button>
            }
          >
            ✅ Обновление загружено! Нажми "Перезапустить" для установки.
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
