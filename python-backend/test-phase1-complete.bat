@echo off
cls
echo ==========================================
echo    PHASE 1 COMPLETE TEST SUITE
echo ==========================================
echo.

REM Check if server is running
echo [TEST 1] Checking if server is running...
curl -f -s http://localhost:8000/health >nul 2>&1
if %errorlevel% == 0 (
    echo [PASS] Server is running
) else (
    echo [FAIL] Server is NOT running!
    echo.
    echo To start server:
    echo 1. Open new Command Prompt
    echo 2. cd python-backend
    echo 3. venv\Scripts\activate.bat
    echo 4. python run.py
    echo.
    pause
    exit /b 1
)

echo.
echo [TEST 2] Testing endpoints...
echo.

echo Testing /  endpoint...
curl -s http://localhost:8000/
echo.
echo.

echo Testing /health endpoint...
curl -s http://localhost:8000/health
echo.
echo.

echo Testing /api/test endpoint...
curl -s http://localhost:8000/api/test
echo.
echo.

echo [TEST 3] Opening API documentation...
start http://localhost:8000/docs

echo.
echo ==========================================
echo    TEST RESULTS
echo ==========================================
echo.
echo If you see JSON responses above, Phase 1 is COMPLETE!
echo.
echo Available endpoints:
echo - http://localhost:8000/         (Root)
echo - http://localhost:8000/health   (Health Check)
echo - http://localhost:8000/api/test (Test Endpoint)
echo - http://localhost:8000/docs     (API Documentation)
echo.
pause