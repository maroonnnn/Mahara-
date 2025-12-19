@echo off
echo ========================================
echo    Updating GitHub Repository
echo ========================================
echo.

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Not a git repository!
    echo Please run this script from your project folder.
    pause
    exit /b 1
)

echo [1/3] Checking status...
git status --short
echo.

echo [2/3] Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files!
    pause
    exit /b 1
)
echo ✓ Files added
echo.

echo [3/3] Committing and pushing...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update files - %date% %time%

git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit!
    pause
    exit /b 1
)
echo ✓ Changes committed
echo.

git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub!
    echo You may need to authenticate or pull first.
    pause
    exit /b 1
)
echo ✓ Pushed to GitHub
echo.

echo ========================================
echo    SUCCESS! Changes are on GitHub
echo ========================================
echo.
echo Repository: https://github.com/maroonnnn/Mahara-
echo.
pause

