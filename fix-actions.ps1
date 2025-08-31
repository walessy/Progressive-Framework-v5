# PowerShell script to fix deprecated GitHub Actions

Write-Host "Fixing deprecated GitHub Actions..." -ForegroundColor Green

# Get all workflow files
$workflowFiles = Get-ChildItem -Path ".github/workflows" -Filter "*.yml" -Recurse
$workflowFiles += Get-ChildItem -Path ".github/workflows" -Filter "*.yaml" -Recurse

foreach ($file in $workflowFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    
    # Replace deprecated actions
    $content = $content -replace 'actions/upload-artifact@v3', 'actions/upload-artifact@v4'
    $content = $content -replace 'actions/download-artifact@v3', 'actions/download-artifact@v4'
    $content = $content -replace 'actions/checkout@v3', 'actions/checkout@v4'
    $content = $content -replace 'actions/setup-node@v3', 'actions/setup-node@v4'
    
    Set-Content $file.FullName -Value $content
}

Write-Host "✅ All workflow files updated!" -ForegroundColor Green
Write-Host "Review the changes and commit when ready." -ForegroundColor Cyan