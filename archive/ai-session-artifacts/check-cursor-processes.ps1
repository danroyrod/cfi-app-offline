# Script to check for multiple Cursor processes
# This is often the cause of crashes!

Write-Host "Checking for Cursor processes..." -ForegroundColor Yellow
Write-Host ""

$processes = Get-Process | Where-Object { 
    $_.ProcessName -like '*cursor*' -or 
    $_.ProcessName -like '*Cursor*' 
}

if ($processes) {
    Write-Host "Found $($processes.Count) Cursor process(es):" -ForegroundColor Red
    Write-Host ""
    
    $processes | ForEach-Object {
        $memoryMB = [math]::Round($_.WorkingSet64 / 1MB, 2)
        Write-Host "  Process: $($_.ProcessName) (ID: $($_.Id))" -ForegroundColor Cyan
        Write-Host "  Memory: $memoryMB MB" -ForegroundColor $(if ($memoryMB -gt 4000) { "Red" } else { "Green" })
        Write-Host ""
    }
    
    $totalMemory = ($processes | Measure-Object -Property WorkingSet64 -Sum).Sum / 1MB
    Write-Host "Total Memory Used: $([math]::Round($totalMemory, 2)) MB" -ForegroundColor $(if ($totalMemory -gt 8000) { "Red" } else { "Yellow" })
    Write-Host ""
    
    if ($processes.Count -gt 1) {
        Write-Host "⚠️  WARNING: Multiple Cursor processes detected!" -ForegroundColor Red
        Write-Host "This is likely causing your crashes!" -ForegroundColor Red
        Write-Host ""
        Write-Host "To fix:" -ForegroundColor Yellow
        Write-Host "1. Close ALL Cursor windows" -ForegroundColor White
        Write-Host "2. Open Task Manager (Ctrl+Shift+Esc)" -ForegroundColor White
        Write-Host "3. End ALL 'Cursor' processes" -ForegroundColor White
        Write-Host "4. Wait 30 seconds" -ForegroundColor White
        Write-Host "5. Reopen Cursor" -ForegroundColor White
    }
} else {
    Write-Host "No Cursor processes found." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")















