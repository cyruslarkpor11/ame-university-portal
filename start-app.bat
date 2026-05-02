@echo off
echo ==========================================
echo   AME Zion University Portal - Launcher
echo ==========================================
echo.

:: Check if Java is running
tasklist | findstr "java.exe" >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] Spring Boot is already running!
    echo [INFO] Access the portal at: http://localhost:8081
    echo.
    goto :menu
) else (
    echo [INFO] Starting Spring Boot Application...
    echo.
    start "" /B cmd /c "cd /d "%~dp0" && tools\apache-maven-3.9.15\bin\mvn spring-boot:run"
    timeout /t 15 /nobreak >nul
    echo [INFO] Application started!
    echo.
)

:menu
echo ==========================================
echo   PORTAL URLS:
echo ==========================================
echo   Online:  http://localhost:8081/login
echo   Offline: https://phobia-vagrancy-kerosene.ngrok-free.dev/offline-login.html
echo.
echo   Default Login:
echo   Username: admin
echo   Password: admin123
echo ==========================================
echo.
echo Press any key to open the portal in browser...
pause >nul

:: Open browser
start http://localhost:8081/login

echo.
echo [INFO] Browser opened!
echo [INFO] Press Ctrl+C in the other window to stop the server.
echo.
pause
