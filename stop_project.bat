@echo off
title Carthage Fitness Club - Arret des Services
echo ========================================================
echo   Arret des services Carthage Fitness Club
echo ========================================================
echo.

taskkill /F /IM java.exe 2>NUL
echo [OK] Serveur Java arrete.

taskkill /F /IM node.exe 2>NUL
echo [OK] Serveur Frontend React arrete.

echo.
echo Tous les serveurs applicatifs ont ete arretes.
pause
