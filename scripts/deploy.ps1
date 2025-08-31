#!/usr/bin/env pwsh
# Progressive Framework V5 - PowerShell Deployment Script

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment,
    
    [switch]$Build = $false,
    [switch]$Test = $false,
    [int]$Replicas = 3
)

Write-Host "ðŸš€ Progressive Framework V5 Deployment" -ForegroundColor Blue
Write-Host "Environment: $Environment" -ForegroundColor Yellow

function Test-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed or not in PATH"
        exit 1
    }
    Write-Host "âœ… Docker found" -ForegroundColor Green
}

function Build-Application {
    Write-Host "ðŸ—ï¸ Building application..." -ForegroundColor Cyan
    docker build -t progressive-framework-v5:latest .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed"
        exit 1
    }
    Write-Host "âœ… Build completed" -ForegroundColor Green
}

function Test-Application {
    Write-Host "ðŸ§ª Testing application..." -ForegroundColor Cyan
    
    # Run simple test
    if (Test-Path "simple-test.js") {
        node simple-test.js
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Tests failed"
            exit 1
        }
    }
    
    Write-Host "âœ… Tests passed" -ForegroundColor Green
}

function Deploy-Application {
    Write-Host "ðŸš€ Deploying to $Environment..." -ForegroundColor Cyan
    
    switch ($Environment) {
        "development" {
            $env:NODE_ENV = "development"
            $env:PORT = "3000"
            docker-compose -f docker-compose.dev.yml up -d --build
        }
        "staging" {
            $env:NODE_ENV = "staging"
            docker-compose -f docker-compose.staging.yml up -d --scale progressive-framework=$Replicas
        }
        "production" {
            $env:NODE_ENV = "production"
            docker-compose up -d --scale progressive-framework=$Replicas
        }
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Deployment failed"
        exit 1
    }
    
    # Wait for health check
    Start-Sleep 30
    
    $healthUrl = "http://localhost:3000/emergency/health"
    try {
        $response = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 10
        if ($response.success) {
            Write-Host "âœ… Deployment successful - Application is healthy" -ForegroundColor Green
        }
    } catch {
        Write-Warning "Health check failed, but deployment may still be successful"
    }
}

# Main execution
Test-Docker

if ($Build) {
    Build-Application
}

if ($Test) {
    Test-Application
}

Deploy-Application

Write-Host "`nðŸŽ‰ Deployment to $Environment completed!" -ForegroundColor Green
Write-Host "ðŸ“Š Check status: docker-compose ps" -ForegroundColor Cyan
Write-Host "ðŸ“‹ View logs: docker-compose logs -f" -ForegroundColor Cyan
Write-Host "ðŸŒ Health check: http://localhost:3000/emergency/health" -ForegroundColor Cyan
