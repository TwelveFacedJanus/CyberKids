@echo off
setlocal

set BACKEND=C:\Users\%USERNAME%\Desktop\CyberKids\Services\Backend
set FRONTEND=C:\Users\%USERNAME%\Desktop\CyberKids\Services\Frontend

if not exist "%BACKEND%" (
    echo [ERROR] Backend not found: %BACKEND%
    pause
    exit /b 1
)
if not exist "%FRONTEND%" (
    echo [ERROR] Frontend not found: %FRONTEND%
    pause
    exit /b 1
)

REM ─── Бэкенд ───
start "CyberKids Backend" cmd /k "cd /d %BACKEND% && call venv\Scripts\activate.bat && python -m app.scripts.reseed && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

REM ─── Фронтенд ───
start "CyberKids Frontend" cmd /k "cd /d %FRONTEND% && npm run dev -- --host 0.0.0.0"

echo.
echo [OK] Two windows opened: Backend and Frontend.
echo      Backend: http://localhost:8000/docs
echo      Frontend: see the Frontend window for URL.