@echo off
echo ===========================================
echo Nettoyage de node_modules et Push sur GitHub
echo ===========================================

git rm -r --cached node_modules 2>nul
git add .
git commit -m "Fix build script and remove node_modules"
git push origin main

echo ===========================================
echo Tout est envoye ! Vercel relance le build.
echo ===========================================
pause