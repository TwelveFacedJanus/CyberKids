// pages/admin/AdminUsersPage.tsx
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Key from "@mui/icons-material/Key";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ageGroupLabels } from "../../theme";
import type { User, Group } from "../../types";

interface FormState {
  username: string;
  full_name: string;
  password: string;
  age_group: string;
  roles: string[];
  groups: string[];
}

const EMPTY: FormState = {
  username: "",
  full_name: "",
  password: "",
  age_group: "junior",
  roles: ["user"],
  groups: [],
};

export default function AdminUsersPage() {
  const { isFull } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]); // 🆕
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, groupsData] = await Promise.all([
        api.get<User[]>("/api/admin/users"),
        api.get<Group[]>("/api/groups"),
      ]);
      setUsers(usersData);
      setGroups(groupsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({
      username: u.username,
      full_name: u.full_name,
      password: "",
      age_group: u.age_group,
      roles: u.roles,
      groups: u.groups || [],
    });
    setOpen(true);
  };

  const toggleRole = (role: string) => {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role)
        ? f.roles.filter((r) => r !== role)
        : [...f.roles, role],
    }));
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/api/admin/users/${editing.id}`, {
          full_name: form.full_name || null,
          age_group: form.age_group,
          roles: form.roles,
          groups: form.groups,
          password: form.password || null,
        });
      } else {
        await api.post("/api/admin/users", {
          ...form,
          groups: form.groups,
        });
      }
      setOpen(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (u: User) => {
    if (
      !window.confirm(
        `Удалить пользователя «${u.full_name}» и все его результаты?`,
      )
    )
      return;
    try {
      await api.delete(`/api/admin/users/${u.id}`);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка удаления");
    }
  };

  const resetPw = async (u: User) => {
    const pw = window.prompt(
      `Новый пароль для «${u.full_name}» (минимум 6 символов):`,
    );
    if (!pw) return;
    try {
      await api.post(`/api/admin/users/${u.id}/reset-password`, {
        new_password: pw,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={700}>
            👥 Пользователи
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Всего: {users.length}
          </Typography>
        </Box>
        {isFull ? (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreate}
            sx={{ borderRadius: "12px" }}
          >
            Создать аккаунт
          </Button>
        ) : (
          <Chip
            label="Роль admin: только просмотр"
            sx={{ backgroundColor: "#FFF3E0", fontWeight: 600 }}
          />
        )}
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {!isFull && (
        <Alert severity="info" sx={{ borderRadius: "12px" }}>
          У тебя роль <strong>admin</strong> — доступен просмотр. Для создания и
          изменения аккаунтов нужна роль <strong>admin + full</strong>.
        </Alert>
      )}

      <Paper sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8F9FA" }}>
                <TableCell sx={{ fontWeight: 700 }}>Пользователь</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Логин</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Группа</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Роли</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#FAFAFF" } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "#7C4DFF",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {u.full_name?.[0] || "?"}
                      </Avatar>
                      <Typography fontWeight={600}>{u.full_name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      @{u.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ageGroupLabels[u.age_group] ?? u.age_group}
                      size="small"
                      sx={{ backgroundColor: "#F1EBFF", fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {u.roles.map((r) => (
                        <Chip
                          key={r}
                          label={r}
                          size="small"
                          sx={{
                            backgroundColor:
                              r === "admin"
                                ? "#E8E0FF"
                                : r === "full"
                                  ? "#FFE0B2"
                                  : "#E0F2E9",
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.is_active ? "Активен" : "Отключён"}
                      size="small"
                      sx={{
                        backgroundColor: u.is_active ? "#E0F2E9" : "#FFCDD2",
                        fontWeight: 600,
                        color: u.is_active ? "#166534" : "#991B1B",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {isFull && (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          size="small"
                          title="Изменить"
                          onClick={() => openEdit(u)}
                          sx={{ "&:hover": { backgroundColor: "#F1EBFF" } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Сбросить пароль"
                          onClick={() => resetPw(u)}
                          sx={{ "&:hover": { backgroundColor: "#FFF3E0" } }}
                        >
                          <Key fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Удалить"
                          onClick={() => remove(u)}
                          sx={{ "&:hover": { backgroundColor: "#FEF2F2" } }}
                        >
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editing ? `Изменить: ${editing.full_name}` : "Новый аккаунт"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Имя (как обращаться)"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Логин"
              value={form.username}
              disabled={Boolean(editing)}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              fullWidth
              helperText={editing ? "Логин изменить нельзя" : undefined}
            />
            <TextField
              label={editing ? "Новый пароль (пусто — не менять)" : "Пароль"}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Возрастная группа"
              value={form.age_group}
              onChange={(e) => setForm({ ...form, age_group: e.target.value })}
              fullWidth
            >
              {Object.entries(ageGroupLabels).map(([v, label]) => (
                <MenuItem key={v} value={v}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            
            {/* ✅ Загружаем группы из бэкенда */}
            <TextField
              select
              label="Группы"
              SelectProps={{ multiple: true }}
              value={form.groups}
              onChange={(e) =>
                setForm({
                  ...form,
                  groups:
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value,
                })
              }
              fullWidth
            >
              {groups.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
              {groups.length === 0 && (
                <MenuItem disabled>Нет доступных групп</MenuItem>
              )}
            </TextField>

            <Box>
              <Typography fontWeight={700} gutterBottom>
                Роли
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="user (ребёнок)"
                  clickable
                  onClick={() => toggleRole("user")}
                  sx={roleChip(form.roles.includes("user"))}
                />
                <Chip
                  label="admin (просмотр)"
                  clickable
                  onClick={() => toggleRole("admin")}
                  sx={roleChip(form.roles.includes("admin"))}
                />
                <Chip
                  label="full (управление)"
                  clickable
                  onClick={() => toggleRole("full")}
                  sx={roleChip(form.roles.includes("full"))}
                />
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Роль <b>full</b> работает только вместе с <b>admin</b>.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button
            variant="contained"
            disabled={busy || !form.username || !form.full_name}
            onClick={save}
          >
            {busy ? "Сохраняем…" : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function roleChip(active: boolean) {
  return {
    bgcolor: active ? "#7C4DFF" : "#F1EBFF",
    color: active ? "#fff" : "#4A148C",
    fontWeight: 700,
  };
}