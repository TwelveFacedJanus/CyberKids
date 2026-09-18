// components/tasks/CodeTask.tsx
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextareaAutosize,
} from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import CodeIcon from "@mui/icons-material/Code";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { getAnswer, setAnswer, type TaskComponentProps } from "./taskUtils";
import { api } from "../../api/client";

interface CodeContent {
  language: "python" | "javascript" | "lua";
  starter_code: string;
  solution: string;
  hint?: string;
  is_theory?: boolean;
  theory?: {
    title: string;
    sections: Array<{ title: string; text: string }>;
  };
  tests: Array<{ input: string; expected: string }>;
}

export default function CodeTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const [code, setCode] = useState(content.starter_code || "");
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const language = content.language || "python";
  const isTheory = content.is_theory || false;

  const languageLabels: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    lua: "Lua",
  };

  const languageColors: Record<string, string> = {
    python: "#3776AB",
    javascript: "#F7DF1E",
    lua: "#000080",
  };

  const color = languageColors[language] || "#7C4DFF";

  // Подсчёт строк
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from(
    { length: Math.max(lineCount, 10) },
    (_, i) => i + 1,
  );

  // Синхронизация скролла
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("scroll", handleScroll);
      return () => textarea.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = target.value;

    if (e.key === "Enter") {
      e.preventDefault();

      const beforeCursor = value.substring(0, start);
      const lines = beforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : "";

      const extraIndent = currentLine.trim().endsWith(":") ? "    " : "";

      const newValue =
        value.substring(0, start) +
        "\n" +
        indent +
        extraIndent +
        value.substring(end);
      setCode(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd =
          start + 1 + indent.length + extraIndent.length;
      }, 0);
    }

    if (e.key === "Tab") {
      e.preventDefault();

      if (start !== end) {
        const lines = value.split("\n");
        let currentPos = 0;
        let newStart = start;
        let newEnd = end;

        const newLines = lines.map((line, index) => {
          const lineStart = currentPos;
          const lineEnd = currentPos + line.length;
          currentPos = lineEnd + 1;

          if (lineStart < end && lineEnd > start) {
            if (e.shiftKey) {
              const currentIndent = line.match(/^(\s*)/)?.[1] || "";
              const newIndent = currentIndent.slice(4);
              const diff = currentIndent.length - newIndent.length;
              if (index === 0) newStart = Math.max(0, newStart - diff);
              newEnd = Math.max(0, newEnd - diff);
              return newIndent + line.slice(currentIndent.length);
            } else {
              if (index === 0) newStart += 4;
              newEnd += 4;
              return "    " + line;
            }
          }
          return line;
        });

        setCode(newLines.join("\n"));
        setTimeout(() => {
          target.selectionStart = newStart;
          target.selectionEnd = newEnd;
        }, 0);
      } else {
        const newValue =
          value.substring(0, start) + "    " + value.substring(end);
        setCode(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 4;
        }, 0);
      }
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);

    try {
      const data = await api.post<{
        output: string;
        success: boolean;
        error?: string;
      }>("/api/run/code", { code, language });

      if (data.success) {
        setOutput(data.output);
        if (content.solution) {
          const isCorrect = data.output.trim() === content.solution.trim();
          onChange(setAnswer(answers, "code_result", isCorrect));
        } else {
          onChange(setAnswer(answers, "code_result", true));
        }
      } else {
        setError(data.error || "Ошибка выполнения");
        onChange(setAnswer(answers, "code_result", false));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка выполнения");
      onChange(setAnswer(answers, "code_result", false));
    } finally {
      setIsRunning(false);
    }
  };

  // Рендер редактора с нумерацией
  const renderEditor = () => (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#282A36",
        borderRadius: "0 0 12px 12px",
        overflow: "hidden",
      }}
    >
      {/* Нумерация строк */}
      <Box
        ref={lineNumbersRef}
        sx={{
          minWidth: 44,
          bgcolor: "#1E1E2E",
          color: "#6272A4",
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: 14,
          lineHeight: 1.8,
          padding: "16px 8px",
          textAlign: "right",
          userSelect: "none",
          overflow: "hidden",
          borderRight: "1px solid #3D3D4A",
          flexShrink: 0,
        }}
      >
        {lineNumbers.map((num) => (
          <div key={num}>{num}</div>
        ))}
      </Box>

      {/* Редактор кода */}
      <TextareaAutosize
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Напиши свой код здесь..."
        minRows={10}
        maxRows={20}
        style={{
          width: "100%",
          backgroundColor: "#282A36",
          color: "#F8F8F2",
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: 14,
          lineHeight: 1.8,
          padding: "16px",
          border: "none",
          outline: "none",
          resize: "vertical",
          // minHeight: "240px",
          tabSize: 4,
        }}
      />
    </Box>
  );

  // Если это теоретическое занятие
  if (isTheory && content.theory) {
    return (
      <Stack spacing={3}>
        <Paper
          sx={{ p: 4, borderRadius: "16px", border: `2px solid ${color}` }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                bgcolor: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 28,
              }}
            >
              📖
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                {content.theory.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Вводный урок по {languageLabels[language] || language}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={2}>
            {content.theory.sections.map((section, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  backgroundColor: "#F8F9FA",
                  border: "1px solid #F1F1F1",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 1, color: color }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                >
                  {section.text}
                </Typography>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            💻 Попробуй в интерпретаторе
          </Typography>

          <Paper sx={{ p: 0, borderRadius: "12px", overflow: "hidden" }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#1E1E2E",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip
                label={`${languageLabels[language] || language} — практика`}
                size="small"
                sx={{ bgcolor: `${color}40`, color: "#fff", fontWeight: 600 }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={
                  isRunning ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PlayArrow />
                  )
                }
                onClick={handleRun}
                disabled={isRunning}
                sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
              >
                {isRunning ? "Выполнение..." : "Запустить"}
              </Button>
            </Box>
            {renderEditor()}
          </Paper>

          {output !== null && (
            <Paper
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "#F0FDF4",
                border: "1px solid #86EFAC",
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                ✅ Вывод:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#FFFFFF",
                  borderRadius: "8px",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 14,
                  whiteSpace: "pre-wrap",
                }}
              >
                {output}
              </Box>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ borderRadius: "12px" }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Stack>
    );
  }

  // Обычное задание
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: "16px", border: `2px solid ${color}` }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              bgcolor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <CodeIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {languageLabels[language] || language}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Выполняется в безопасном Docker-контейнере
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {content.hint && (
        <Accordion sx={{ borderRadius: "12px", border: "1px solid #F1EBFF" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LightbulbIcon sx={{ color: "#F9A825" }} />
              <Typography fontWeight={600}>💡 Подсказка</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {content.hint}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      <Paper sx={{ p: 0, borderRadius: "16px", overflow: "hidden" }}>
        <Box
          sx={{
            p: 1.5,
            bgcolor: "#1E1E2E",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={languageLabels[language] || language}
            size="small"
            sx={{ bgcolor: `${color}40`, color: "#fff", fontWeight: 600 }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={
              isRunning ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <PlayArrow />
              )
            }
            onClick={handleRun}
            disabled={isRunning}
            sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
          >
            {isRunning ? "Выполнение..." : "Запустить"}
          </Button>
        </Box>
        {renderEditor()}
      </Paper>

      {output !== null && (
        <Paper
          sx={{
            p: 2,
            borderRadius: "16px",
            bgcolor: "#F0FDF4",
            border: "1px solid #86EFAC",
          }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            ✅ Вывод:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "#FFFFFF",
              borderRadius: "8px",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              whiteSpace: "pre-wrap",
            }}
          >
            {output}
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      )}
    </Stack>
  );
}
