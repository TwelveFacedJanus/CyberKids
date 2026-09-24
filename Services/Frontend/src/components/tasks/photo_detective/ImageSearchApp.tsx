// src/components/tasks/photo_detective/ImageSearchApp.tsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Card,
  Stack,
  Chip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import type { SearchResult, Clue } from "./photoDetective.types";

interface Props {
  results: SearchResult[];
  onAddClue: (clue: Clue) => void;
  addedClues: string[];
}

export default function ImageSearchApp({
  results,
  onAddClue,
  addedClues,
}: Props) {
  const [query, setQuery] = useState("поиск похожих изображений");

  return (
    <Box
      sx={{
        minHeight: "100%",
        background: "#fff",
      }}
    >
      {/* Google-like header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography
          fontSize={24}
          fontWeight={800}
          sx={{
            mb: 2,
            color: "#4285f4",
          }}
        >
          Search
        </Typography>

        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 700,

            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          }}
        />
      </Box>

      {/* tabs */}
      <Box
        sx={{
          px: 3,
          borderBottom: "1px solid #eee",
        }}
      >
        <Stack direction="row" spacing={3}>
          {["Все", "Картинки", "Новости", "Видео"].map((item, index) => (
            <Typography
              key={item}
              sx={{
                py: 1.3,
                fontSize: 13,
                fontWeight: index === 1 ? 700 : 500,
                color: index === 1 ? "#2563eb" : "#666",
                borderBottom: index === 1 ? "2px solid #2563eb" : "none",
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          p: 3,
          maxWidth: 900,
        }}
      >
        <Typography fontSize={12} color="text.secondary" sx={{ mb: 2 }}>
          Найдено результатов: {results.length}
        </Typography>

        <Stack spacing={2}>
          {results.map((result) => {
            const added = addedClues.includes(result.clueId || "");

            return (
              <Card
                key={result.id}
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2.5,
                  transition: ".2s",

                  "&:hover": {
                    borderColor: "#bfdbfe",
                    boxShadow: "0 5px 20px rgba(0,0,0,.06)",
                  },
                }}
              >
                <Stack direction="row" spacing={2}>
                  {/* fake thumbnail */}
                  <Box
                    sx={{
                      width: 130,
                      height: 90,
                      flexShrink: 0,

                      borderRadius: 1.5,

                      background: "linear-gradient(135deg,#dbeafe,#e0e7ff)",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      fontSize: 34,
                    }}
                  >
                    🖼️
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontSize={12} fontWeight={700}>
                        {result.platformIcon} {result.platform}
                      </Typography>

                      <Typography fontSize={11} color="text.secondary">
                        {result.date}
                      </Typography>
                    </Stack>

                    <Typography
                      fontSize={16}
                      fontWeight={700}
                      color="#2563eb"
                      sx={{ mt: 0.5 }}
                    >
                      {result.url}
                    </Typography>

                    <Typography fontSize={13} sx={{ mt: 0.5 }}>
                      {result.caption}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip size="small" label={`❤️ ${result.likes}`} />

                      <Chip size="small" label={`💬 ${result.comments}`} />

                      {result.isClue && (
                        <Chip
                          size="small"
                          label="Возможная улика"
                          sx={{
                            background: "#fef3c7",
                            color: "#92400e",
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {result.clueId && result.clueText ? (
                      <Button
                        size="small"
                        variant={added ? "outlined" : "contained"}
                        disabled={added}
                        startIcon={
                          added ? <CheckRoundedIcon /> : <AddRoundedIcon />
                        }
                        onClick={() =>
                          onAddClue({
                            id: result.clueId!,
                            text: result.clueText!,
                            source: "image_search",
                          })
                        }
                      >
                        {added ? "В блокноте" : "Добавить"}
                      </Button>
                    ) : null}
                  </Box>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
