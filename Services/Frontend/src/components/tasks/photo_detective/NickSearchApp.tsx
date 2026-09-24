// src/components/tasks/photo_detective/NickSearchApp.tsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  Stack,
  Button,
  Chip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import type { NickSearchResult, Clue } from "./photoDetective.types";

interface Props {
  nickname: string;
  results: NickSearchResult[];
  onAddClue: (clue: Clue) => void;
  addedClues: string[];
}

export default function NickSearchApp({
  nickname,
  results,
  onAddClue,
  addedClues,
}: Props) {
  const [query, setQuery] = useState(nickname);

  return (
    <Box
      sx={{
        minHeight: "100%",
        background: "#f8fafc",
      }}
    >
      <Box
        sx={{
          p: 3,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Typography fontSize={23} fontWeight={800} sx={{ mb: 2 }}>
          🔍 Поиск по нику
        </Typography>

        <TextField
          fullWidth
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
              borderRadius: 2,
              background: "#fff",
            },
          }}
        />
      </Box>

      <Box
        sx={{
          p: 3,
          maxWidth: 900,
        }}
      >
        <Typography fontSize={12} color="text.secondary" sx={{ mb: 2 }}>
          Результаты поиска по запросу «{query}»
        </Typography>

        <Stack spacing={2}>
          {results.map((result) => {
            const added = addedClues.includes(result.clueId || "");

            return (
              <Card
                key={result.id}
                elevation={0}
                sx={{
                  p: 2.2,
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  background: "#fff",
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      borderRadius: "50%",

                      background: "#f1f5f9",

                      fontSize: 26,
                    }}
                  >
                    {result.avatar}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={800}>{result.name}</Typography>

                      <Typography fontSize={12} color="text.secondary">
                        {result.platformIcon} {result.platform}
                      </Typography>
                    </Stack>

                    <Typography color="#2563eb" fontSize={13} fontWeight={700}>
                      {result.handle}
                    </Typography>

                    <Typography fontSize={13} sx={{ mt: 0.7 }}>
                      {result.bio}
                    </Typography>

                    {result.extra && (
                      <Typography
                        fontSize={11}
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {result.extra}
                      </Typography>
                    )}
                  </Box>

                  {result.clueId && result.clueText && (
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
                          source: "nick_search",
                        })
                      }
                    >
                      {added ? "Добавлено" : "В блокнот"}
                    </Button>
                  )}
                </Stack>

                {result.isClue && (
                  <Chip
                    label="Проверь, может ли это быть уликой"
                    size="small"
                    sx={{
                      mt: 1.5,
                      background: "#fef3c7",
                      color: "#92400e",
                    }}
                  />
                )}
              </Card>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
