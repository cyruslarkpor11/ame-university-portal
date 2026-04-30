# This script watches for file changes and automatically copies them to target directory
# Run this in a separate terminal: .\auto-sync.ps1

$srcPath = "C:\Users\cyrus\Desktop\My First Project\src\main\resources"
$targetPath = "C:\Users\cyrus\Desktop\My First Project\target\classes"

Write-Host "🔄 Auto-Sync Started - Watching for file changes..." -ForegroundColor Green
Write-Host "Source: $srcPath" -ForegroundColor Cyan
Write-Host "Target: $targetPath" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# File watcher
$fsw = New-Object System.IO.FileSystemWatcher
$fsw.Path = $srcPath
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true
$fsw.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

# Define sync function
function Sync-Files {
    param($source, $dest)
    
    try {
        # Copy static files
        if (Test-Path "$source\static\*.html") {
            Copy-Item "$source\static\*.html" "$dest\static\" -Force -ErrorAction SilentlyContinue
            Write-Host "📄 Static HTML files synced" -ForegroundColor Green
        }
        
        # Copy templates
        if (Test-Path "$source\templates\*.html") {
            Copy-Item "$source\templates\*.html" "$dest\templates\" -Force -ErrorAction SilentlyContinue
            Write-Host "📄 Template files synced" -ForegroundColor Green
        }
        
        Write-Host "✅ Sync completed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
    } catch {
        Write-Host "❌ Sync error: $_" -ForegroundColor Red
    }
}

# Initial sync
Write-Host "🚀 Performing initial sync..." -ForegroundColor Yellow
Sync-Files -source $srcPath -dest $targetPath
Write-Host ""

# Event handlers
Register-ObjectEvent -InputObject $fsw -EventName "Changed" -Action {
    $path = $Event.SourceEventArgs.FullPath
    Write-Host "📝 File changed: $(Split-Path $path -Leaf)" -ForegroundColor Yellow
    Start-Sleep -Milliseconds 500  # Debounce
    Sync-Files -source $srcPath -dest $targetPath
} | Out-Null

Register-ObjectEvent -InputObject $fsw -EventName "Created" -Action {
    $path = $Event.SourceEventArgs.FullPath
    Write-Host "📝 File created: $(Split-Path $path -Leaf)" -ForegroundColor Yellow
    Start-Sleep -Milliseconds 500  # Debounce
    Sync-Files -source $srcPath -dest $targetPath
} | Out-Null

# Keep running
while ($true) {
    Start-Sleep -Seconds 1
}
