# Temporarily disable TypeScript server to test if it's causing crashes
# This will disable type checking but may stop crashes

Write-Host "Disabling TypeScript server temporarily..." -ForegroundColor Yellow
Write-Host "This will disable type checking but may prevent crashes." -ForegroundColor Yellow
Write-Host ""

$settingsPath = ".vscode\settings.json"

if (-not (Test-Path $settingsPath)) {
    Write-Host "Error: $settingsPath not found" -ForegroundColor Red
    exit 1
}

$content = Get-Content $settingsPath -Raw

# Check if already disabled
if ($content -match 'typescript\.tsserver\.enable.*false') {
    Write-Host "TypeScript server is already disabled." -ForegroundColor Green
    Write-Host ""
    Write-Host "To re-enable, edit .vscode/settings.json and remove:" -ForegroundColor Yellow
    Write-Host '  "typescript.tsserver.enable": false,' -ForegroundColor White
    exit 0
}

# Add TypeScript disable settings
$disableSettings = @"
  
  // TEMPORARILY DISABLED - TypeScript server causing crashes
  "typescript.tsserver.enable": false,
  "typescript.validate.enable": false,
  "javascript.validate.enable": false
"@

# Remove the closing brace and add new settings
$content = $content.TrimEnd() -replace '\s*\}\s*$', "$disableSettings`n}"

Set-Content $settingsPath -Value $content -NoNewline

Write-Host "TypeScript server disabled!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made to .vscode/settings.json:" -ForegroundColor Yellow
Write-Host "  - typescript.tsserver.enable: false" -ForegroundColor White
Write-Host "  - typescript.validate.enable: false" -ForegroundColor White
Write-Host "  - javascript.validate.enable: false" -ForegroundColor White
Write-Host ""
Write-Host "Restart Cursor for changes to take effect." -ForegroundColor Yellow
Write-Host ""
Write-Host "If crashes stop, TypeScript was the issue." -ForegroundColor Cyan
Write-Host "If crashes continue, try other options in ULTIMATE_CRASH_FIX.md" -ForegroundColor Cyan




