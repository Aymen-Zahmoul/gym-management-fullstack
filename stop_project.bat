@echo off
title HADID GYM CLUB - Arret des Services
echo ========================================================
echo   Arret des services HADID GYM CLUB
echo ========================================================
echo.

taskkill /F /IM java.exe 2>NUL
echo [OK] Serveur Java arrete.

taskkill /F /IM node.exe 2>NUL
echo [OK] Serveur Frontend React arrete.

echo.
echo Tous les serveurs applicatifs ont ete arretes.
pause
