// src/components/tasks/PhotoDetectiveTask.tsx

import React, { useCallback, useState } from "react";

import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  TextField,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Notebook from "./photo_detective/Notebook";
import MacDesktop from "./photo_detective/MacDesktop";
import MacWindow from "./photo_detective/MacWindow";
import ImageSearchApp from "./photo_detective/ImageSearchApp";
import NickSearchApp from "./photo_detective/NickSearchApp";
import GeoMapApp from "./photo_detective/GeoMapApp";
import DossierBuilder from "./photo_detective/DossierBuilder";
import type { Answer } from "../../types";

import type {
  Clue,
  PhotoDetectiveContent,
} from "./photo_detective/photoDetective.types";

type Phase = "photo" | "desktop" | "dossier" | "completed";

interface Props {
  content: PhotoDetectiveContent;
  answers: Answer[];
  onChange: (answers: Answer[]) => void;
  onSubmit: (finalAnswers: Answer[]) => void;
  onComplete?: () => void;
}

export default function PhotoDetectiveTask({
  content,
  answers,
  onChange,
  onSubmit,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<Phase>("photo");
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [clues, setClues] = useState<Clue[]>([]);
  const [usedTools, setUsedTools] = useState<string[]>([]);
  const [activeApp, setActiveApp] = useState<
    "image" | "nick" | "geo" | "notebook" | null
  >(null);
  const [finalAnswer, setFinalAnswer] = useState("");
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);

  const addClue = useCallback((clue: Clue) => {
    setClues((current) => {
      // Не добавляем одну и ту же улику дважды
      if (current.some((item) => item.id === clue.id)) {
        return current;
      }
      return [...current, clue];
    });
  }, []);

  const handleHotspotClick = (hotspot: (typeof content.hotspots)[number]) => {
    if (foundHotspots.includes(hotspot.id)) {
      return;
    }
    setFoundHotspots((current) => [...current, hotspot.id]);
    addClue({
      id: hotspot.clueId,
      text: hotspot.clueText,
      source: "photo",
    });
  };

  const photoComplete = foundHotspots.length >= content.hotspots.length;

  const goDesktop = () => {
    if (!photoComplete) {
      return;
    }
    setPhase("desktop");
  };

  const goDossier = () => {
    setActiveApp(null);
    setPhase("dossier");
  };

  const handleDossierComplete = () => {
    setShowFinalQuestion(true);
  };

  const submitFinal = () => {
    if (finalAnswer.trim().length < 10) {
      return;
    }

    onChange([
      ...answers.filter((a) => a.key !== "photo_detective_result"),
      {
        key: "photo_detective_result",
        value: {
          foundHotspots,
          usedTools,
          finalAnswer,
          // Для скоринга на бэке:
          totalFound: foundHotspots.length,
          totalTools: usedTools.length,
          // Полный набор улик (по clueId)
          clueIds: clues.map((c) => c.id),
        },
      },
    ]);

    setPhase("completed");
    onComplete?.();
  };

  return (
    <Box
      sx={{
        width: "100%",
         minHeight: "clamp(520px, calc(100vh - 260px), 650px)",
        position: "relative",
        overflow: "hidden",
        borderRadius: 1,
        background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
      }}
    >
      <InvestigationHeader
        phase={phase}
        cluesCount={clues.length}
        foundCount={foundHotspots.length}
        totalCount={content.hotspots.length}
      />

      {/* ======================================================
          PHOTO
      ====================================================== */}
      {phase === "photo" && (
        <PhotoPhase
          content={content}
          foundHotspots={foundHotspots}
          clues={clues}
          onHotspotClick={handleHotspotClick}
          onContinue={goDesktop}
          complete={photoComplete}
        />
      )}

      {/* ======================================================
          DESKTOP
      ====================================================== */}
      {phase === "desktop" && (
        <Box
          sx={{
             height: "clamp(520px, calc(100vh - 300px), 680px)",
            position: "relative",
          }}
        >
          <MacDesktop
            onOpenImageSearch={() => setActiveApp("image")}
            onOpenNickSearch={() => setActiveApp("nick")}
            onOpenMap={() => setActiveApp("geo")}
            onOpenNotebook={() => setActiveApp("notebook")}
          >
            {/* =========================
                IMAGE SEARCH
            ========================= */}
            {activeApp === "image" && (
              <MacWindow
                title="Поиск по фото"
                // icon={<span>🖼️</span>}
                onClose={() => setActiveApp(null)}
              >
                <ImageSearchApp
                  results={content.imageSearchResults}
                  onAddClue={addClue}
                  addedClues={clues.map((clue) => clue.id)}
                  onUse={() =>
                    setUsedTools((prev) => [
                      ...new Set([...prev, "image_search"]),
                    ])
                  }
                />
              </MacWindow>
            )}

            {/* =========================
                NICK SEARCH
            ========================= */}
            {activeApp === "nick" && (
              <MacWindow
                title="Поиск по нику"
                // icon={<span>👤</span>}
                onClose={() => setActiveApp(null)}
              >
                <NickSearchApp
                  nickname={content.nickname}
                  results={content.nickSearchResults}
                  onAddClue={addClue}
                  addedClues={clues.map((clue) => clue.id)}
                  onUse={() =>
                    setUsedTools((prev) => [
                      ...new Set([...prev, "nick_search"]),
                    ])
                  }
                />
              </MacWindow>
            )}

            {/* =========================
                GEO MAP
            ========================= */}
            {activeApp === "geo" && (
              <MacWindow
                title="Карта координат"
                // icon={<span>🗺️</span>}
                onClose={() => setActiveApp(null)}
              >
                <GeoMapApp
                  results={content.geoResults}
                  onAddClue={addClue}
                  addedClues={clues.map((clue) => clue.id)}
                  onUse={() =>
                    setUsedTools((prev) => [...new Set([...prev, "geo_map"])])
                  }
                />
              </MacWindow>
            )}

            {/* =========================
                NOTEBOOK
            ========================= */}
            {activeApp === "notebook" && (
              <MacWindow
                title="Блокнот улик"
                // icon={<MenuBookRoundedIcon fontSize="small" />}
                onClose={() => setActiveApp(null)}
                width={380}
                height={560}
              >
                <Box
                  sx={{
                    p: 2,
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Notebook clues={clues} />
                </Box>
              </MacWindow>
            )}
          </MacDesktop>

          {/* ==================================================
              DESKTOP CONTROLS
          ================================================== */}
          <Box
            sx={{
              position: "absolute",
              right: 18,
              bottom: 18,
              zIndex: 50,
            }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={goDossier}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.2,
                fontWeight: 800,
              }}
            >
              Перейти к досье
            </Button>
          </Box>
        </Box>
      )}

      {/* ======================================================
          DOSSIER
      ====================================================== */}
      {phase === "dossier" && (
        <Box
          sx={{
             minHeight: "clamp(520px, calc(100vh - 300px), 680px)",
            position: "relative",
          }}
        >
          <DossierBuilder
            slots={content.dossierSlots}
            clues={clues}
            onComplete={handleDossierComplete}
            onBack={() => setPhase("desktop")}
          />

          {/* ==================================================
              FINAL QUESTION
          ================================================== */}
          {showFinalQuestion && (
            <FinalQuestion
              question={content.finalQuestion}
              placeholder={content.finalPlaceholder}
              value={finalAnswer}
              onChange={setFinalAnswer}
              onSubmit={submitFinal}
            />
          )}
        </Box>
      )}

      {/* ======================================================
          COMPLETED
      ====================================================== */}
      {phase === "completed" && (
        <CompletedScreen answer={finalAnswer} explainer={content.explainer} />
      )}
    </Box>
  );
}

/* =========================================================
   HEADER
========================================================= */

function InvestigationHeader({
  phase,
  cluesCount,
  foundCount,
  totalCount,
}: {
  phase: Phase;
  cluesCount: number;
  foundCount: number;
  totalCount: number;
}) {
  const steps: [Phase, string][] = [
    ["photo", "Фото"],
    ["desktop", "Инструменты"],
    ["dossier", "Досье"],
  ];

  return (
    <Box
      sx={{
        minHeight: 70,
        px: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 3,
        background: "rgb(255, 255, 255)",
        // color: "#000",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        position: "relative",
        zIndex: 100,
      }}
    >
      {/* TITLE */}
      <Box>
        <Typography fontWeight={900} fontSize={17}>
          🔎 Фото-детектив
        </Typography>
        <Typography
          fontSize={10}
          sx={{
            opacity: 0.55,
          }}
        >
          Учебное расследование
        </Typography>
      </Box>

      {/* STEPS */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flex: 1,
        }}
      >
        {steps.map(([id, label], index) => {
          const active = phase === id;
          return (
            <React.Fragment key={id}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.7,
                  borderRadius: 2,
                  background: active ? "#26C6DA" : "transparent",
                  color: active ? "#000" : "rgba(0,0,0,.4)",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {index + 1}. {label}
              </Box>
              {index < steps.length - 1 && (
                <Typography
                  sx={{
                    color: "rgba(255,255,255,.2)",
                  }}
                >
                  →
                </Typography>
              )}
            </React.Fragment>
          );
        })}
      </Stack>

      {/* STATS */}
      <Stack direction="row" spacing={1}>
        <Stat label="Фото" value={`${foundCount}/${totalCount}`} />
        <Stat label="Улики" value={cluesCount} />
      </Stack>
    </Box>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        minWidth: 55,
      }}
    >
      <Typography fontWeight={900} fontSize={14}>
        {value}
      </Typography>
      <Typography
        fontSize={9}
        sx={{
          opacity: 0.45,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/* =========================================================
   PHOTO
========================================================= */

function PhotoPhase({
  content,
  foundHotspots,
  clues,
  onHotspotClick,
  onContinue,
  complete,
}: {
  content: PhotoDetectiveContent;
  foundHotspots: string[];
  clues: Clue[];
  onHotspotClick: (hotspot: PhotoDetectiveContent["hotspots"][number]) => void;
  onContinue: () => void;
  complete: boolean;
}) {
  return (
    <Box
      sx={{
        p: 2,
        background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
      }}
    >
      <Box
        sx={{
          display: "grid",
           gridTemplateColumns: "minmax(0,1fr) clamp(240px, 28vw, 330px)",
          gap: 3,
        }}
      >
        {/* ====================== PHOTO ============================ */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 1,
            background: "#111827",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
            }}
          >
            <Box
              data-tutorial="photo-detective"
              component="img"
              src={content.imagePath}
              alt="Учебная фотография"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* HOTSPOTS */}
            {content.hotspots.map((hotspot) => {
              const found = foundHotspots.includes(hotspot.id);
              return (
                <Box
                  key={hotspot.id}
                  onClick={() => onHotspotClick(hotspot)}
                  sx={{
                    position: "absolute",
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                    transform: `rotate(${hotspot.rotation || 0}deg)`,
                    borderRadius: 1,
                    border: found
                      ? "3px solid #22c55e"
                      : "2px dashed rgba(255,255,255,.9)",
                    background: found
                      ? "rgba(34,197,94,.18)"
                      : "rgba(255,255,255,.03)",
                    cursor: found ? "default" : "crosshair",
                    transition: ".2s",
                    "&:hover": {
                      background: found ? undefined : "rgba(59,130,246,.2)",
                      transform: `rotate(${
                        hotspot.rotation || 0
                      }deg) scale(1.04)`,
                    },
                  }}
                >
                  {found && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -12,
                        right: -12,
                        width: 25,
                        height: 25,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#22c55e",
                        color: "#fff",
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </Box>
              );
            })}

            {/* INSTRUCTION */}
            <Box
              sx={{
                position: "absolute",
                left: 15,
                bottom: 15,
                px: 1.5,
                py: 0.8,
                borderRadius: 2,
                background: "rgba(0,0,0,.7)",
                color: "#fff",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography fontSize={12}>
                🔎 Нажимай на подозрительные детали
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ==================================================
            NOTEBOOK
        ================================================== */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Notebook clues={clues} />
          <Button
            data-tutorial="tool-image_search+submit"
            fullWidth
            variant="contained"
            disabled={!complete}
            endIcon={complete ? <ArrowForwardRoundedIcon /> : undefined}
            onClick={onContinue}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 900,
            }}
          >
            {complete
              ? "Перейти к инструментам"
              : `Найди ещё ${
                  content.hotspots.length - foundHotspots.length
                } улик`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

/* =========================================================
   FINAL QUESTION
========================================================= */

function FinalQuestion({
  question,
  placeholder,
  value,
  onChange,
  onSubmit,
}: {
  question: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        p: 4,
        background: "linear-gradient(transparent 20%,rgba(15,23,42,.78))",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "min(700px, 95%)",
          p: 3,
          borderRadius: 2,
          background: "rgba(255,255,255,.98)",
          boxShadow: "0 25px 80px rgba(0,0,0,.35)",
        }}
      >
        <Typography fontSize={23} fontWeight={900}>
          💭 {question}
        </Typography>
        <Typography
          fontSize={13}
          color="text.secondary"
          sx={{
            mt: 0.7,
            mb: 2,
          }}
        >
          Подумай, какие детали лучше не публиковать открыто.
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={onSubmit}
          disabled={value.trim().length < 10}
          sx={{
            mt: 2,
            py: 1.4,
            borderRadius: 2.5,
            fontWeight: 800,
          }}
        >
          Завершить задание
        </Button>
      </Paper>
    </Box>
  );
}

/* =========================================================
   COMPLETE
========================================================= */

function CompletedScreen({
  answer,
  explainer,
}: {
  answer: string;
  explainer?: string;
}) {
  return (
    <Box
      sx={{
         minHeight: "clamp(520px, calc(100vh - 260px), 650px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        background: "radial-gradient(circle at 50% 30%,#334155,#0f172a)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 650,
          width: "100%",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography fontSize={60}>🕵️</Typography>
        <Typography
          fontSize={28}
          fontWeight={900}
          sx={{
            mt: 1,
          }}
        >
          Расследование завершено
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          Ты увидел, сколько информации может раскрыть одна фотография.
        </Typography>
        {explainer && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 1,
              background: "#f1f5f9",
              textAlign: "left",
            }}
          >
            <Typography fontSize={13} lineHeight={1.7}>
              {explainer}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: "#eff6ff",
          }}
        >
          <Typography fontSize={11} color="text.secondary">
            Твой ответ
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={600}
            sx={{
              mt: 0.5,
            }}
          >
            {answer}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
