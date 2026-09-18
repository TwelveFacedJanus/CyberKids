// pages/admin/AdminGroupsPage.tsx
import { useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemText,
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
  Autocomplete,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import type { Group, User, GroupCreate, GroupUpdate } from "../../types";

export default function AdminGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState<GroupCreate>({
    name: "",
    description: "",
    user_ids: [],
  });
  const [busy, setBusy] = useState(false);

  const loadData = async () => {
    try {
      const [groupsData, usersData] = await Promise.all([
        api.get<Group[]>("/api/groups"),
        api.get<User[]>("/api/admin/users"),
      ]);
      setGroups(groupsData);
      setUsers(usersData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", user_ids: [] });
    setOpen(true);
  };

  const openEdit = (g: Group) => {
    setEditing(g);
    setForm({
      name: g.name,
      description: g.description,
      user_ids: g.user_ids,
    });
    setOpen(true);
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      if (editing) {
        await api.put<Group>(`/api/groups/${editing.id}`, {
          name: form.name,
          description: form.description,
          user_ids: form.user_ids,
        });
      } else {
        await api.post<Group>("/api/groups", form);
      }
      setOpen(false);
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (g: Group) => {
    if (!window.confirm(`Удалить группу «${g.name}»?`)) return;
    try {
      await api.delete(`/api/groups/${g.id}`);
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка удаления");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={700}>
            👥 Группы
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Всего: {groups.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreate}
          sx={{ borderRadius: "12px" }}
        >
          Создать группу
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: "16px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8F9FA" }}>
              <TableCell sx={{ fontWeight: 700 }}>Название</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Описание</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Участников</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Участники</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((g) => {
              const groupUsers = users.filter((u) => g.user_ids.includes(u.id));
              return (
                <TableRow key={g.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{ bgcolor: "#7C4DFF", width: 32, height: 32 }}
                      >
                        <GroupIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography fontWeight={600}>{g.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{g.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${g.user_count} чел.`}
                      size="small"
                      sx={{ backgroundColor: "#F1EBFF", fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {groupUsers.slice(0, 3).map((u) => (
                        <Chip
                          key={u.id}
                          label={u.full_name}
                          size="small"
                          sx={{ backgroundColor: "#E0F2FE", fontWeight: 500 }}
                        />
                      ))}
                      {groupUsers.length > 3 && (
                        <Chip
                          label={`+${groupUsers.length - 3}`}
                          size="small"
                          sx={{ backgroundColor: "#F3F4F6", fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => openEdit(g)}
                      sx={{ "&:hover": { backgroundColor: "#F1EBFF" } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => remove(g)}
                      sx={{ "&:hover": { backgroundColor: "#FEF2F2" } }}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    Групп пока нет. Создайте первую группу!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог создания/редактирования группы */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editing ? `Редактировать: ${editing.name}` : "Создать группу"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название группы"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              placeholder="Например: 7А класс"
            />
            <TextField
              label="Описание"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
              placeholder="Краткое описание группы"
            />
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) =>
                `${option.full_name} (@${option.username})`
              }
              value={users.filter((u) => form.user_ids.includes(u.id))}
              onChange={(_, newValue) => {
                setForm({
                  ...form,
                  user_ids: newValue.map((u) => u.id),
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Участники"
                  placeholder="Выберите пользователей"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.full_name}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
            />
            <Typography variant="caption" color="text.secondary">
              Выбрано участников: {form.user_ids.length}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button
            variant="contained"
            disabled={busy || !form.name}
            onClick={save}
          >
            {busy ? "Сохраняем…" : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
