import { useMemo, useState } from "react";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import TouchApp from "@mui/icons-material/TouchApp";
import ViewKanban from "@mui/icons-material/ViewKanban";
import { zoneIconFor } from "../../icons";
import type { Answer, Item, Section } from "../../types";
import {
  cubeColor,
  getAnswer,
  setAnswer,
  type TaskComponentProps,
} from "./taskUtils";

interface Props extends TaskComponentProps {
  mode: "zones" | "columns";
}

interface DragState {
  itemId: string;
}

export default function PlacementTask({
  content,
  answers,
  onChange,
  mode,
}: Props) {
  const sections = content.sections ?? [];
  const items = content.items ?? [];
  const [drag, setDrag] = useState<DragState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const placed = useMemo(() => {
    const map = new Map<string, string>();
    for (const i of items) {
      const v = getAnswer(answers, i.id);
      if (v !== undefined) map.set(i.id, String(v));
    }
    return map;
  }, [answers, items]);

  const place = (itemId: string, sectionId: string) => {
    onChange(setAnswer(answers, itemId, sectionId));
    setSelected(null);
    setDrag(null);
  };

  const placeInto = (section: Section) => {
    if (drag) place(drag.itemId, section.id);
    if (selected) place(selected, section.id);
  };

  const pendingItems = items.filter((i) => !placed.has(i.id));

  const cube = (item: Item, index: number) => {
    const isSelected = selected === item.id;
    const color = cubeColor(index);
    return (
      <Box
        key={item.id}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", item.id);
          e.dataTransfer.effectAllowed = "move";
          setDrag({ itemId: item.id });
        }}
        onDragEnd={() => setDrag(null)}
        onClick={() => setSelected(isSelected ? null : item.id)}
        sx={{
          width: mode === "columns" ? "100%" : "auto",
          minWidth: 120,
          cursor: "grab",
          userSelect: "none",
          p: 1.5,
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${color}, ${color}DD)`,
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          border: isSelected ? "3px solid #1A1A2E" : "3px solid transparent",
          transform: isSelected ? "scale(1.05)" : "scale(1)",
          transition: "all 0.2s ease",
          textAlign: "center",
          "&:hover": {
            transform: "scale(1.06)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          },
        }}
      >
        {item.text}
      </Box>
    );
  };

  const zone = (section: Section, idx: number) => {
    const Icon = zoneIconFor(section.icon ?? section.id);
    const inZone = items.filter((i) => placed.get(i.id) === section.id);
    return (
      <Paper
        key={section.id}
        data-tutorial={`zone-${idx}`}
        onClick={() => placeInto(section)}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const itemId = e.dataTransfer.getData("text/plain");
          if (itemId) {
            place(itemId, section.id);
          }
        }}
        sx={{
          p: 2,
          minHeight: 160,
          border: "2px dashed",
          borderColor: "#D1D5DB",
          borderRadius: "16px",
          backgroundColor: "#FAFAFF",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#7C4DFF",
            backgroundColor: "#F1EBFF",
            transform: "translateY(-2px)",
          },
          ...(drag && {
            borderColor: "#7C4DFF",
            backgroundColor: "#F1EBFF",
          }),
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 34, height: 34, bgcolor: "#7C4DFF" }}>
            <Icon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={800}>
            {section.label}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mt: 1, width: "100%" }}
        >
          {inZone.map((i) => cube(i, items.indexOf(i)))}
        </Stack>
      </Paper>
    );
  };

  const column = (section: Section, idx: number) => {
    const Icon = zoneIconFor(section.icon ?? section.id);
    const inZone = items.filter((i) => placed.get(i.id) === section.id);
    return (
      <Box
        key={section.id}
        data-tutorial={`zone-${idx}`}
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Paper
          onClick={() => placeInto(section)}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const itemId = e.dataTransfer.getData("text/plain");
            if (itemId) {
              place(itemId, section.id);
            }
          }}
          sx={{
            p: 1.5,
            minHeight: 220,
            border: "3px dashed",
            borderColor: "#B39DDB",
            background: "#FAF8FF",
            cursor: "pointer",
            "&:hover": { borderColor: "#7C4DFF", background: "#F1EBFF" },
            ...(drag && {
              borderColor: "#7C4DFF",
              backgroundColor: "#F1EBFF",
            }),
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Avatar sx={{ width: 30, height: 30, bgcolor: "#42A5F5" }}>
              <Icon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={800}>
              {section.label}
            </Typography>
          </Stack>
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {inZone.map((i) => cube(i, items.indexOf(i)))}
          </Stack>
        </Paper>
      </Box>
    );
  };

  const tray = (
    <Paper
      data-tutorial="tray"
      sx={{ p: 2, background: "#FFF8E1", border: "2px solid #FFE082" }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <ViewKanban sx={{ color: "#F9A825" }} />
        <Typography variant="h6" fontWeight={800}>
          Карточки
        </Typography>
        <TouchApp sx={{ color: "#7C4DFF", ml: "auto" }} />
        <Typography variant="body2" fontWeight={700} color="text.secondary">
          клик или перетащи
        </Typography>
      </Stack>
      {pendingItems.length === 0 ? (
        <Typography color="text.secondary" fontWeight={600}>
          Все карточки разложены! Проверь ответы ниже.
        </Typography>
      ) : (
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          {pendingItems.map((i) => cube(i, items.indexOf(i)))}
        </Stack>
      )}
    </Paper>
  );

  return (
    <Box>
      {mode === "zones" && (
        <Stack spacing={2}>
          {tray}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {sections.map((s, i) => zone(s, i))}
          </Box>
        </Stack>
      )}

      {mode === "columns" && (
        <Stack spacing={2}>
          {tray}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {sections.map((s, i) => column(s, i))}
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
