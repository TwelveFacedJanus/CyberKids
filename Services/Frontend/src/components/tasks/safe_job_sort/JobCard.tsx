// components/tasks/safe_job_sort/JobCard.tsx
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Star from "@mui/icons-material/Star";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";

export interface JobEmployer {
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  registered: string;
}

export interface JobChatMessage {
  from: "me" | "them";
  text: string;
}

export interface JobCardData {
  id: string;
  title: string;
  shortDescription: string;
  price: string;
  employer: JobEmployer;
  fullDescription: string;
  chatMessages: JobChatMessage[];
  safety: "safe" | "danger";
  explanation: string;
}

interface Props {
  card: JobCardData;
  expanded: boolean;
  onToggleExpand: () => void;
  onDecide: (decision: "safe" | "danger") => void;
  disabled?: boolean;
}

function ratingColor(rating: number) {
  if (rating >= 4.5) return "#22C55E";
  if (rating >= 3) return "#F59E0B";
  return "#EF4444";
}

export default function JobCard({
  card,
  expanded,
  onToggleExpand,
  onDecide,
  disabled,
}: Props) {
  const [showChat, setShowChat] = useState(false);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "20px",
        border: "2px solid #E5E7EB",
        transition: "all 0.3s ease",
        animation: "cardIn 0.5s ease both",
        "@keyframes cardIn": {
          "0%": { opacity: 0, transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        "&:hover": {
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* ─── Заголовок карточки ─── */}
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          sx={{
            width: 52,
            height: 52,
            bgcolor: "#7C4DFF",
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {card.employer.avatar}
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="baseline"
            flexWrap="wrap"
            sx={{ mb: 0.5 }}
          >
            <Typography fontWeight={800} fontSize={16}>
              {card.title}
            </Typography>
            <Chip
              label={card.price}
              size="small"
              sx={{
                bgcolor: "#FFF3E0",
                color: "#92400E",
                fontWeight: 700,
              }}
            />
          </Stack>

          <Typography fontSize={14} color="text.secondary" sx={{ mb: 1 }}>
            {card.shortDescription}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography fontSize={12.5} fontWeight={600}>
              {card.employer.name}
            </Typography>
            <Stack direction="row" spacing={0.25} alignItems="center">
              <Star
                sx={{ fontSize: 14, color: ratingColor(card.employer.rating) }}
              />
              <Typography fontSize={12} fontWeight={700}>
                {card.employer.rating.toFixed(1)}
              </Typography>
              <Typography fontSize={11} color="text.secondary">
                ({card.employer.reviews} отзывов)
              </Typography>
            </Stack>
            <Typography fontSize={11.5} color="text.secondary">
              {card.employer.registered}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* ─── Кнопка «Раскрыть» ─── */}
      <Button
        onClick={onToggleExpand}
        endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
        sx={{
          mt: 2,
          textTransform: "none",
          color: "#7C4DFF",
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {expanded ? "Свернуть" : "Раскрыть детали"}
      </Button>

      {/* ─── Раскрытая часть ─── */}
      <Collapse in={expanded} timeout={350}>
        <Stack spacing={2} sx={{ mt: 1.5 }}>
          {/* Полное описание */}
          <Paper
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: "#F8F9FA",
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography fontSize={14} sx={{ lineHeight: 1.6 }}>
              {card.fullDescription}
            </Typography>
          </Paper>

          {/* Чат с заказчиком */}
          {card.chatMessages.length > 0 && (
            <Box>
              <Button
                onClick={() => setShowChat(!showChat)}
                startIcon={<ChatBubbleOutline />}
                endIcon={showChat ? <ExpandLess /> : <ExpandMore />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                {showChat ? "Скрыть переписку" : "Показать переписку"}
              </Button>
              <Collapse in={showChat} timeout={300}>
                <Stack spacing={1} sx={{ mt: 1.5, pl: 1 }}>
                  {card.chatMessages.map((m, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent:
                          m.from === "me" ? "flex-end" : "flex-start",
                      }}
                    >
                      <Paper
                        sx={{
                          px: 1.75,
                          py: 1,
                          maxWidth: "80%",
                          borderRadius:
                            m.from === "me"
                              ? "14px 14px 4px 14px"
                              : "14px 14px 14px 4px",
                          backgroundColor:
                            m.from === "me" ? "#DCF8C6" : "#FFFFFF",
                          border:
                            m.from === "me"
                              ? "1px solid #A5D6A7"
                              : "1px solid #E5E7EB",
                        }}
                      >
                        <Typography fontSize={13.5} sx={{ lineHeight: 1.4 }}>
                          {m.text}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          )}
        </Stack>
      </Collapse>

      {/* ─── Кнопки решения ─── */}
      {expanded && (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            mt: 3,
            pt: 2.5,
            borderTop: "1px dashed #E5E7EB",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            disabled={disabled}
            onClick={() => onDecide("safe")}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: 14,
              bgcolor: "#22C55E",
              textTransform: "none",
              "&:hover": { bgcolor: "#16A34A" },
            }}
          >
            ✅ Пропустить заказ
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={disabled}
            onClick={() => onDecide("danger")}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: 14,
              bgcolor: "#EF4444",
              textTransform: "none",
              "&:hover": { bgcolor: "#DC2626" },
            }}
          >
            🚫 Заблокировать
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
