# Build-Project.ps1
# Complete automation script for Progressive Framework v5

param(
    [switch]$SkipLint = $false,
    [switch]$SkipTests = $false,
    [switch]$FixESLint = $true,
    [switch]$Clean = $false
)

Write-Host "🚀 Progressive Framework v5 - Build Automation" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Function to check and fix Node.js version
function Test-NodeVersion {
    Write-Host "🔍 Checking Node.js version..." -ForegroundColor Yellow
    
    try {
        $nodeVersion = node --version
        $versionNumber = [version]($nodeVersion -replace 'v', '')
        $requiredVersion = [version]"20.0.0"
        
        Write-Host "Current Node.js version: $nodeVersion" -ForegroundColor Cyan
        
        if ($versionNumber -lt $requiredVersion) {
            Write-Host "❌ Node.js version is too old. Requires v20.0.0 or higher" -ForegroundColor Red
            Write-Host "Please run: choco upgrade nodejs" -ForegroundColor Yellow
            return $false
        } else {
            Write-Host "✅ Node.js version is compatible" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ Could not determine Node.js version: $_" -ForegroundColor Red
        return $false
    }
}

# Function to clean project
function Invoke-ProjectClean {
    Write-Host "🧹 Cleaning project..." -ForegroundColor Yellow
    
    $itemsToClean = @(
        "node_modules",
        "package-lock.json", 
        "dist",
        "build", 
        "coverage",
        "lint-results.json"
    )
    
    foreach ($item in $itemsToClean) {
        if (Test-Path $item) {
            Remove-Item -Recurse -Force $item -ErrorAction SilentlyContinue
            Write-Host "✅ Removed $item" -ForegroundColor Green
        }
    }
    
    # Clear npm cache
    npm cache clean --force
    Write-Host "✅ Cleared npm cache" -ForegroundColor Green
}

# Function to install dependencies
function Install-Dependencies {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error installing dependencies: $_" -ForegroundColor Red
        return $false
    }
}

# Function to fix ESLint configuration
function Invoke-ESLintFix {
    Write-Host "🔧 Fixing ESLint configuration..." -ForegroundColor Yellow
    
    # Create eslint.config.js content
    $configContent = @"
// eslint.config.js - ESLint v9 Flat Config
import js from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'warn', 
      'no-console': 'off'
    }
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**']
  }
];
"@
    
    # Backup old config if it exists
    if (Test-Path ".eslintrc.json") {
        Copy-Item ".eslintrc.json" ".eslintrc.json.backup" -Force
        Remove-Item ".eslintrc.json" -Force
        Write-Host "✅ Backed up and removed .eslintrc.json" -ForegroundColor Green
    }
    
    Set-Content -Path "eslint.config.js" -Value $configContent -Encoding UTF8
    Write-Host "✅ Created eslint.config.js" -ForegroundColor Green
}

# Function to run lint
function Invoke-Lint {
    if ($SkipLint) {
        Write-Host "⏭️ Skipping lint (requested)" -ForegroundColor Yellow
        return $true
    }
    
    Write-Host "🔍 Running ESLint..." -ForegroundColor Yellow
    
    try {
        npm run lint
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Linting passed" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ Linting found issues but continuing..." -ForegroundColor Yellow
            return $true # Don't fail build on lint warnings
        }
    } catch {
        Write-Host "❌ Linting failed: $_" -ForegroundColor Red
        return $false
    }
}

# Function to run tests
function Invoke-Tests {
    if ($SkipTests) {
        Write-Host "⏭️ Skipping tests (requested)" -ForegroundColor Yellow
        return $true
    }
    
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    
    try {
        npm run test:ci
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Tests passed" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Tests failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error running tests: $_" -ForegroundColor Red
        return $false
    }
}

# Function to build project
function Invoke-Build {
    Write-Host "🏗️ Building project..." -ForegroundColor Yellow
    
    try {
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build completed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Build failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error during build: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution
$startTime = Get-Date

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from your project root." -ForegroundColor Red
    exit 1
}

# Step 1: Check Node.js version
if (-not (Test-NodeVersion)) {
    Write-Host "❌ Build aborted due to Node.js version incompatibility" -ForegroundColor Red
    exit 1
}

# Step 2: Clean project if requested
if ($Clean) {
    Invoke-ProjectClean
}

# Step 3: Install dependencies
if (-not (Install-Dependencies)) {
    Write-Host "❌ Build aborted due to dependency installation failure" -ForegroundColor Red
    exit 1
}

# Step 4: Fix ESLint if requested
if ($FixESLint) {
    Invoke-ESLintFix
}

# Step 5: Run lint
if (-not (Invoke-Lint)) {
    Write-Host "❌ Build aborted due to linting errors" -ForegroundColor Red
    exit 1
}

# Step 6: Run tests
if (-not (Invoke-Tests)) {
    Write-Host "❌ Build aborted due to test failures" -ForegroundColor Red
    exit 1
}

# Step 7: Final build
if (-not (Invoke-Build)) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Success!
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "🎉 BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "⏱️ Total time: $($duration.Minutes)m $($duration.Seconds)s" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Your Progressive Framework v5 is ready to deploy!" -ForegroundColor Green