# Pre-push check: build + lint on changed app files
# Run from repo root: .\scripts\pre-push-check.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
Set-Location $root

$lintFiles = @(
  "src/App.tsx",
  "src/components/AudioPlayer.tsx",
  "src/components/FloatingAudioButton.tsx",
  "src/components/OfflineIndicator.tsx",
  "src/contexts/AudioContext.tsx",
  "src/pages/AudioLessonsFull.tsx",
  "src/pages/AudioLessonsIndex.tsx",
  "src/pages/AudioLessonsLite.tsx",
  "src/services/audioService.ts",
  "src/services/audioCapture.ts",
  "src/services/blobPlayback.ts",
  "src/services/flashcardGenerator.ts",
  "src/types/flashcardTypes.ts"
)

Write-Host "Pre-push check: build + lint (changed files only)" -ForegroundColor Cyan
Write-Host ""

# 1. Build
Write-Host "[1/2] Running build..." -ForegroundColor Yellow
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build FAILED" -ForegroundColor Red
  exit 1
}
Write-Host "Build OK" -ForegroundColor Green
Write-Host ""

# 2. Lint only the listed files (no "." so we don't lint the whole repo)
Write-Host "[2/2] Linting changed files..." -ForegroundColor Yellow
$fileList = $lintFiles -join " "
cmd /c "npx eslint --max-warnings 999 $fileList"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Lint reported issues in listed files (see above)." -ForegroundColor Yellow
  exit 1
}
Write-Host "Lint OK (no errors in listed files)" -ForegroundColor Green
Write-Host ""
Write-Host "Pre-push check passed. Safe to push." -ForegroundColor Green
