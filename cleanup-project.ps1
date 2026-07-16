# ==========================================
# E-Ambassade Project Cleanup Script
# Removes unnecessary Next.js files/folders
# ==========================================


Write-Host "Starting project cleanup..." -ForegroundColor Cyan


# Folders generated automatically
$folders = @(
    ".next",
    "node_modules",
    ".turbo",
    ".vercel",
    "out",
    "coverage",
    ".cache"
)


foreach ($folder in $folders) {

    if (Test-Path $folder) {

        Write-Host "Removing $folder" -ForegroundColor Yellow

        Remove-Item `
            -Recurse `
            -Force `
            $folder

    }

}


# Development files not needed
$files = @(
    ".DS_Store",
    "Thumbs.db",
    "*.log",
    "npm-debug.log",
    "yarn-debug.log",
    "yarn-error.log",
    "pnpm-debug.log"
)


foreach ($file in $files){

    Get-ChildItem `
        -Path . `
        -Filter $file `
        -Recurse `
        -Force |
    Remove-Item `
        -Force

}



# Remove empty folders
Get-ChildItem `
    -Path . `
    -Directory `
    -Recurse |
Where-Object {
    $_.GetFiles().Count -eq 0 -and
    $_.GetDirectories().Count -eq 0
} |
Remove-Item



Write-Host ""
Write-Host "Cleanup completed!" -ForegroundColor Green