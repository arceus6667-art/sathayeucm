@echo off
echo ==============================================
echo Pushing Smart Canteen & Meal Tokens to GitHub
echo ==============================================
git add .
git commit -m "feat(canteen): implement end-to-end Smart Canteen and Meal Token workflow with double-scan protection"
git push origin main
echo ==============================================
echo Completed!
echo ==============================================
pause
