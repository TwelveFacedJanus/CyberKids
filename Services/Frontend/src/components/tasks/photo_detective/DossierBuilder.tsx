import React, { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import DossierSlot from "./DossierSlot";
import DraggableClue, { type DraggableClueData } from "./DraggableClue";

interface DossierSlotConfig {
  id: string;
  label: string;
  icon: string;
  acceptedClues: string[];
}

interface DossierBuilderProps {
  slots: DossierSlotConfig[];

  clues: DraggableClueData[];

  onComplete?: () => void;

  onBack?: () => void;
}

const DossierBuilder: React.FC<DossierBuilderProps> = ({
  slots,
  clues,
  onComplete,
  onBack,
}) => {
  /**
   * slotId -> clue
   */
  const [placedClues, setPlacedClues] = useState<
    Record<string, DraggableClueData>
  >({});

  const handleDropClue = (slotId: string, clue: DraggableClueData) => {
    setPlacedClues((previous) => ({
      ...previous,
      [slotId]: clue,
    }));
  };

  const usedClueIds = useMemo(() => {
    return new Set(Object.values(placedClues).map((clue) => clue.id));
  }, [placedClues]);

  const completedCount = Object.keys(placedClues).length;

  const isComplete = completedCount === slots.length;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "clamp(520px, calc(100vh - 250px), 760px)",

        p: {
          xs: 2,
          md: 4,
        },

        background: "linear-gradient(135deg, #e9eef2 0%, #d9e1e7 100%)",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          mb: 3,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 22,
                md: 28,
              },

              fontWeight: 900,
              color: "#263238",
            }}
          >
            Составь досье
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 13,
              color: "#607078",
            }}
          >
            Перетащи найденные улики в подходящие поля
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,

            borderRadius: "12px",

            background: "#fff",
            border: "1px solid #d5dde2",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 800,
              color: "#455a64",
            }}
          >
            {completedCount} / {slots.length}
          </Typography>
        </Box>
      </Box>

      {/* MAIN */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",

          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "330px 1fr",
          },

          gap: 3,

          alignItems: "start",
        }}
      >
        {/* CLUES */}
        <Box
          sx={{
            p: 2,

            borderRadius: "18px",

            background: "#fff",

            border: "1px solid #d9e0e5",

            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 900,
              color: "#263238",
              mb: 1.5,
            }}
          >
            🔎 Найденные улики
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#78909c",
              mb: 2,
            }}
          >
            Перетащи каждую улику в подходящее поле досье.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {clues.length === 0 && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#90a4ae",
                  py: 2,
                }}
              >
                Улик пока нет.
              </Typography>
            )}

            {clues.map((clue) => (
              <DraggableClue
                key={clue.id}
                clue={clue}
                disabled={usedClueIds.has(clue.id)}
              />
            ))}
          </Box>
        </Box>

        {/* DOSSIER */}
        <Box
          sx={{
            position: "relative",

            p: {
              xs: 2,
              md: 3,
            },

            borderRadius: "20px",

            background: "linear-gradient(135deg, #fffdf8, #f4eee2)",

            border: "1px solid #d8cdbb",

            boxShadow: "0 15px 40px rgba(65,50,30,0.12)",
          }}
        >
          {/* DOSSIER HEADER */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,

              pb: 2,
              mb: 2,

              borderBottom: "2px solid #ded3c3",
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,

                borderRadius: "12px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "#3f3b38",
                color: "#fff",
              }}
            >
              <AssignmentTurnedInRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: "#302b27",
                }}
              >
                Дело №001
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#817568",
                }}
              >
                Карточка собранной информации
              </Typography>
            </Box>
          </Box>

          {/* SLOTS */}
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },

              gap: 1.5,
            }}
          >
            {slots.map((slot) => (
              <DossierSlot
                key={slot.id}
                slot={slot}
                clue={placedClues[slot.id] ?? null}
                onDropClue={handleDropClue}
              />
            ))}
          </Box>

          {/* BACK */}
          {onBack && (
            <Button
              onClick={onBack}
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                mt: 3,
                color: "#607d8b",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Назад
            </Button>
          )}

          {/* COMPLETE */}
          {isComplete && (
            <Box
              sx={{
                mt: 3,
                p: 2,

                borderRadius: "14px",

                background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",

                border: "1px solid #a5d6a7",

                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: "#2e7d32",
                }}
              >
                ✓ Досье собрано
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 11,
                  color: "#558b5a",
                }}
              >
                Все поля заполнены правильно.
              </Typography>

              {onComplete && (
                <Button
                  variant="contained"
                  onClick={onComplete}
                  sx={{
                    mt: 1.5,

                    borderRadius: "10px",

                    background: "#2e7d32",

                    textTransform: "none",

                    fontWeight: 800,

                    "&:hover": {
                      background: "#1b5e20",
                    },
                  }}
                >
                  Продолжить
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DossierBuilder;
