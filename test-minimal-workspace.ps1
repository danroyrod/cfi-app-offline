# Create minimal test workspace to isolate crash cause
# If Cursor works in minimal workspace, your project is the issue

Write-Host "Creating minimal test workspace..." -ForegroundColor Yellow
Write-Host ""

$testDir = ".\cursor-test-minimal"

# Create test directory
if (Test-Path $testDir) {
    Write-Host "Test directory already exists. Removing..." -ForegroundColor Yellow
    Remove-Item $testDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $testDir | Out-Null
Write-Host "Created: $testDir" -ForegroundColor Green

# Create minimal TypeScript file
@"
// Minimal test file
function test() {
    console.log('Hello, Cursor!');
    return true;
}

test();
"@ | Out-File -FilePath "$testDir\test.ts" -Encoding utf8
Write-Host "Created: test.ts" -ForegroundColor Green

# Create minimal package.json
@"
{
  "name": "cursor-test-minimal",
  "version": "1.0.0",
  "type": "module"
}
"@ | Out-File -FilePath "$testDir\package.json" -Encoding utf8
Write-Host "Created: package.json" -ForegroundColor Green

# Create minimal tsconfig.json
@"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
"@ | Out-File -FilePath "$testDir\tsconfig.json" -Encoding utf8
Write-Host "Created: tsconfig.json" -ForegroundColor Green

# Create .vscode/settings.json with minimal config
$vscodeDir = "$testDir\.vscode"
New-Item -ItemType Directory -Force -Path $vscodeDir | Out-Null

@"
{
  "typescript.tsserver.maxTsServerMemory": 2048,
  "files.maxMemoryForLargeFilesMB": 2048,
  "window.restoreWindows": "none"
}
"@ | Out-File -FilePath "$vscodeDir\settings.json" -Encoding utf8
Write-Host "Created: .vscode/settings.json" -ForegroundColor Green

Write-Host ""
Write-Host "Minimal test workspace created!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open this folder in Cursor: $testDir" -ForegroundColor White
Write-Host "2. Open test.ts" -ForegroundColor White
Write-Host "3. Test if Cursor crashes" -ForegroundColor White
Write-Host ""
Write-Host "If Cursor works fine here:" -ForegroundColor Cyan
Write-Host "  → Your main project is causing crashes" -ForegroundColor White
Write-Host "  → Try splitting your project or reducing file count" -ForegroundColor White
Write-Host ""
Write-Host "If Cursor still crashes:" -ForegroundColor Cyan
Write-Host "  → Cursor installation is corrupted" -ForegroundColor White
Write-Host "  → Try reinstalling Cursor" -ForegroundColor White
Write-Host ""




