// components/tasks/DebugTask.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  TextField,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import BugReport from '@mui/icons-material/BugReport';
import { getAnswer, setAnswer, type TaskComponentProps } from './taskUtils';
import { api } from '../../api/client'; 

export default function DebugTask({ content, answers, onChange }: TaskComponentProps) {
  const [code, setCode] = useState(content.starter_code || '');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const language = content.language || 'python';
  const languageLabels: Record<string, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    lua: 'Lua',
  };

    const handleRun = async () => {
        setIsRunning(true);
        setError(null);
        setOutput(null);

        try {
            const data = await api.post<{ output: string; success: boolean; error?: string }>(
            '/api/run/code',
            { code, language }
            );
            
            if (data.success) {
            setOutput(data.output);
            const isCorrect = data.output.trim() === content.solution?.trim();
            onChange(setAnswer(answers, 'debug_result', isCorrect));
            } else {
            setError(data.error || 'Ошибка выполнения');
            onChange(setAnswer(answers, 'debug_result', false));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка выполнения');
            onChange(setAnswer(answers, 'debug_result', false));
        } finally {
            setIsRunning(false);
        }
    };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: '16px', border: '2px solid #EF4444' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <BugReport />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              🐛 Отладка: {languageLabels[language] || language}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Найди и исправь ошибку в коде
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 0, borderRadius: '16px', overflow: 'hidden' }}>
        <Box sx={{ p: 1.5, bgcolor: '#1E1E2E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip label={languageLabels[language] || language} size="small" sx={{ bgcolor: '#EF444440', color: '#fff', fontWeight: 600 }} />
          <Button
            variant="contained"
            size="small"
            startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
            onClick={handleRun}
            disabled={isRunning}
            sx={{ bgcolor: '#22C55E', '&:hover': { bgcolor: '#16A34A' } }}
          >
            {isRunning ? 'Выполнение...' : 'Запустить'}
          </Button>
        </Box>
        <TextField
          multiline
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              bgcolor: '#282A36',
              color: '#F8F8F2',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: 14,
              lineHeight: 1.8,
              minHeight: 200,
              borderRadius: 0,
              '& textarea': { p: 2 },
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
          }}
        />
      </Paper>

      {output !== null && (
        <Paper sx={{ p: 2, borderRadius: '16px', bgcolor: '#F0FDF4', border: '1px solid #86EFAC' }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>✅ Вывод:</Typography>
          <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: '8px', fontFamily: '"JetBrains Mono", monospace', fontSize: 14, whiteSpace: 'pre-wrap' }}>
            {output}
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
      )}
    </Stack>
  );
}