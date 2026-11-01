@echo off
title Campus Placement & Internship Management Portal
color 0A
echo ======================================================================
echo    PlaceIQ - Engineering Campus Placement & Internship Portal
echo ======================================================================
echo.
echo [1/2] Checking Python environment...
py --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python was not found via 'py'. Please ensure Python is installed.
    pause
    exit /b
)

echo [2/2] Starting Flask Backend Server with SQLite database...
echo.
echo  - Web Application URL: http://127.0.0.1:5000
echo  - REST API Health URL: http://127.0.0.1:5000/api/health
echo.
echo Press Ctrl+C in this terminal window to stop the server anytime.
echo.
start http://127.0.0.1:5000
py app.py
pause
