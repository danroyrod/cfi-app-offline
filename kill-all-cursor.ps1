# Forcefully kill ALL Cursor processes
# Run this when Cursor crashes and won't close properly

Write-Host "Searching for Cursor processes..." -ForegroundColor Yellow

$processes = Get-Process | Where-Object { 
    $_.ProcessName -like '*cursor*' -or 
    $_.ProcessName -like '*Cursor*' 
}

if ($processes) {
    $count = $processes.Count
    Write-Host ""
    Write-Host "Found $count Cursor process(es). Killing them all..." -ForegroundColor Red
    Write-Host ""
    
    $totalMemory = 0
    foreach ($proc in $processes) {
        $memoryMB = [math]::Round($proc.WorkingSet64 / 1MB, 2)
        $totalMemory += $memoryMB
        Write-Host "  Killing: $($proc.ProcessName) (ID: $($proc.Id)) - $memoryMB MB" -ForegroundColor Cyan
        
        try {
            Stop-Process -Id $proc.Id -Force -ErrorAction Stop
            Write-Host "    Killed" -ForegroundColor Green
        } catch {
            Write-Host "    Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Total memory freed: $([math]::Round($totalMemory, 2)) MB" -ForegroundColor Green
    Write-Host ""
    Write-Host "Waiting 5 seconds to ensure processes are terminated..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Verify they're gone
    $remaining = Get-Process | Where-Object { 
        $_.ProcessName -like '*cursor*' -or 
        $_.ProcessName -like '*Cursor*' 
    }
    
    if ($remaining) {
        Write-Host "WARNING: $($remaining.Count) process(es) still running!" -ForegroundColor Red
        Write-Host "You may need to kill them manually in Task Manager." -ForegroundColor Yellow
    } else {
        Write-Host "All Cursor processes killed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now you can:" -ForegroundColor Yellow
        Write-Host "1. Clear Cursor cache: %APPDATA%\Cursor\Cache" -ForegroundColor White
        Write-Host "2. Wait 30 seconds" -ForegroundColor White
        Write-Host "3. Reopen Cursor (only ONE window!)" -ForegroundColor White
    }
} else {
    Write-Host "No Cursor processes found." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
