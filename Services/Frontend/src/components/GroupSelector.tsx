// components/GroupSelector.tsx
import { Chip, Stack, Box, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Group } from "../types";

interface GroupSelectorProps {
  selectedGroups: string[];
  onChange: (groups: string[]) => void;
  availableGroups?: string[];  // Опционально — можно передать свои
  label?: string;
  loading?: boolean;
}

export default function GroupSelector({
  selectedGroups,
  onChange,
  availableGroups: externalGroups,
  label = "Группы доступа",
  loading: externalLoading,
}: GroupSelectorProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Если группы переданы извне — используем их
  const hasExternalGroups = externalGroups !== undefined;

  useEffect(() => {
    // Если группы переданы извне — не загружаем
    if (hasExternalGroups) {
      setLoading(false);
      return;
    }

    // Загружаем группы из бэкенда
    api
      .get<Group[]>("/api/groups")
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [hasExternalGroups]);

  // Используем внешние группы или загруженные
  const groupNames = hasExternalGroups 
    ? externalGroups || [] 
    : groups.map((g) => g.id);

  const getGroupLabel = (groupId: string) => {
    if (hasExternalGroups) {
      return groupId.toUpperCase();
    }
    const group = groups.find((g) => g.id === groupId);
    return group ? group.name : groupId.toUpperCase();
  };

  const isLoading = externalLoading !== undefined ? externalLoading : loading;

  const toggleGroup = (group: string) => {
    if (selectedGroups.includes(group)) {
      onChange(selectedGroups.filter((g) => g !== group));
    } else {
      onChange([...selectedGroups, group]);
    }
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} gutterBottom>
        {label}
      </Typography>
      
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 1 }}
      >
        {selectedGroups.length === 0
          ? "🌐 Задание будет доступно всем пользователям"
          : `🚫 Запрещено для групп: ${selectedGroups.map((g) => getGroupLabel(g)).join(", ")}`}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="caption" color="text.secondary">
            Загрузка групп...
          </Typography>
        </Box>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {groupNames.map((group) => (
            <Chip
              key={group}
              label={getGroupLabel(group)}
              onClick={() => toggleGroup(group)}
              color={selectedGroups.includes(group) ? "primary" : "default"}
              variant={selectedGroups.includes(group) ? "filled" : "outlined"}
              sx={{ fontWeight: 600, cursor: "pointer" }}
            />
          ))}
          
          {/* Кнопка "Снять все ограничения" */}
          <Chip
            label="🌐 Все группы"
            onClick={() => onChange([])}
            color={selectedGroups.length === 0 ? "success" : "default"}
            variant={selectedGroups.length === 0 ? "filled" : "outlined"}
            sx={{ fontWeight: 600, cursor: "pointer" }}
          />
        </Stack>
      )}
    </Box>
  );
}