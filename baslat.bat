@echo off
cd /d "%~dp0"
echo Iremin Cani Ne Istiyor uygulamasi baslatiliyor...
echo.
echo Bilgisayarda: http://127.0.0.1:5174/
echo Telefonda ayni Wi-Fi uzerinden bilgisayarin IP adresiyle acabilirsin.
echo Ornek: http://10.10.211.217:5174/
echo.
"C:\Program Files\nodejs\npm.cmd" run dev -- --host 0.0.0.0 --port 5174
pause
