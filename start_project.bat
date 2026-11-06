@echo off
title HADID GYM CLUB - Lanceur Full Stack
echo ========================================================
echo   HADID GYM CLUB - PROJET FEDERATEUR ENICARTHAGE
echo   React + Java Standard HttpServer + JDBC + MySQL
echo ========================================================
echo.

:: 1. Verification de MySQL
echo [1/3] Verification de MySQL / MariaDB...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL est deja en cours d'execution.
) else if exist "C:\xampp\mysql\bin\mysqld.exe" (
    echo [INFO] Demarrage de MySQL depuis XAMPP...
    start /B "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file=C:\xampp\mysql\bin\my.ini --standalone
    timeout /t 3 /nobreak >nul
) else (
    echo [INFO] Assurez-vous que MySQL est actif sur le port 3306.
)

:: 2. Demarrage du Backend Java
echo.
echo [2/3] Demarrage du Serveur Java Backend (Port 8080 / 8081)...
cd /d "%~dp0backend"
where java >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    start "Java Backend Server" java -jar "target\gym-management-1.0-SNAPSHOT.jar"
) else if exist "C:\Program Files\Java\jdk-21.0.12.1\bin\java.exe" (
    start "Java Backend Server" "C:\Program Files\Java\jdk-21.0.12.1\bin\java.exe" -jar "target\gym-management-1.0-SNAPSHOT.jar"
) else (
    echo [ATTENTION] Java introuvable dans le PATH. Veuillez installer Java 21 ou ajouter java au PATH.
)
timeout /t 2 /nobreak >nul

:: 3. Demarrage du Frontend React
echo.
echo [3/3] Demarrage du Frontend React (Port 3000)...
cd /d "%~dp0frontend"
start "React Frontend" cmd /c "npm run dev"
timeout /t 3 /nobreak >nul

:: 4. Ouverture dans le navigateur
echo.
echo ========================================================
echo Application lancee avec succes !
echo - Frontend : http://localhost:3000
echo - API Java : http://localhost:8080/api (ou 8081)
echo ========================================================
start http://localhost:3000
pause
