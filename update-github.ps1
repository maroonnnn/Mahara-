# GitHub Update Script for Mahara Project
# Double-click or run: powershell -ExecutionPolicy Bypass -File update-github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Updating GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
try {
    $null = git rev-parse --git-dir 2>$null
} catch {
    Write-Host "ERROR: Not a git repository!" -ForegroundColor Red
    Write-Host "Please run this script from your project folder." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/3] Checking status..." -ForegroundColor Yellow
git status --short
Write-Host ""

Write-Host "[2/3] Adding all changes..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add files!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Files added" -ForegroundColor Green
Write-Host ""

Write-Host "[3/3] Committing and pushing..." -ForegroundColor Yellow
$commitMsg = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Update files - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

git commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to commit!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Changes committed" -ForegroundColor Green
Write-Host ""

git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push to GitHub!" -ForegroundColor Red
    Write-Host "You may need to authenticate or pull first." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Pushed to GitHub" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "   SUCCESS! Changes are on GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository: https://github.com/maroonnnn/Mahara-" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

