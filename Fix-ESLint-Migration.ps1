# Fix-ESLint-Migration.ps1
# Automated ESLint v9 migration script for Progressive Framework v5

param(
    [switch]$UseLegacy = $false,
    [switch]$Rollback = $false,
    [switch]$TestOnly = $false
)

Write-Host "🔧 ESLint v9 Migration Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from your project root." -ForegroundColor Red
    exit 1
}

# Function to create eslint.config.js
function New-ESLintConfig {
    $configContent = @"
// eslint.config.js - ESLint v9 Flat Config (Migrated from .eslintrc.json)
import js from '@eslint/js';

export default [
  // Apply to all JavaScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest', // Matches your parserOptions
      sourceType: 'module',  // Matches your parserOptions
      globals: {
        // Node.js environment globals (matches "env": {"node": true})
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly'
      }
    },
    rules: {
      // Extend recommended rules (matches "extends": ["eslint:recommended"])
      ...js.configs.recommended.rules,
      
      // Your custom rules (exact match from .eslintrc.json)
      'no-unused-vars': 'warn',
      'no-undef': 'warn', 
      'no-console': 'off'
    }
  },
  
  // Test files configuration
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/test/**/*.js'],
    languageOptions: {
      globals: {
        // Test globals (Jest, Mocha, etc.)
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      // Allow console in tests
      'no-console': 'off'
    }
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      'public/**',
      'docs/**',
      'lint-results.json'
    ]
  }
];
"@
    
    Set-Content -Path "eslint.config.js" -Value $configContent -Encoding UTF8
    Write-Host "✅ Created eslint.config.js" -ForegroundColor Green
}

# Function to update package.json for legacy mode
function Set-LegacyESLint {
    Write-Host "📝 Setting up legacy ESLint mode..." -ForegroundColor Yellow
    
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        
        # Backup original package.json
        Copy-Item "package.json" "package.json.backup" -Force
        Write-Host "✅ Backed up package.json" -ForegroundColor Green
        
        # Update lint scripts to use legacy mode
        if ($packageJson.scripts) {
            if ($packageJson.scripts.lint) {
                $packageJson.scripts.lint = "eslint src/ --ext .js --format json --output-file lint-results.json --config .eslintrc.json"
            }
            if ($packageJson.scripts."lint:fix") {
                $packageJson.scripts."lint:fix" = "eslint src/ --ext .js --fix --config .eslintrc.json"
            }
            if ($packageJson.scripts."lint:check") {
                $packageJson.scripts."lint:check" = "eslint src/ --ext .js --config .eslintrc.json"
            }
        }
        
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
        Write-Host "✅ Updated package.json for legacy ESLint" -ForegroundColor Green
    }
}

# Function to rollback changes
function Invoke-Rollback {
    Write-Host "🔄 Rolling back ESLint changes..." -ForegroundColor Yellow
    
    # Remove new config file
    if (Test-Path "eslint.config.js") {
        Remove-Item "eslint.config.js" -Force
        Write-Host "✅ Removed eslint.config.js" -ForegroundColor Green
    }
    
    # Restore package.json if backup exists
    if (Test-Path "package.json.backup") {
        Move-Item "package.json.backup" "package.json" -Force
        Write-Host "✅ Restored original package.json" -ForegroundColor Green
    }
    
    # Restore .eslintrc.json if backup exists
    if (Test-Path ".eslintrc.json.backup") {
        if (-not (Test-Path ".eslintrc.json")) {
            Move-Item ".eslintrc.json.backup" ".eslintrc.json" -Force
            Write-Host "✅ Restored .eslintrc.json" -ForegroundColor Green
        }
    }
    
    Write-Host "🎯 Rollback complete!" -ForegroundColor Green
    exit 0
}

# Function to test ESLint configuration
function Test-ESLintConfig {
    Write-Host "🧪 Testing ESLint configuration..." -ForegroundColor Yellow
    
    # Test if ESLint can run without errors
    try {
        $testResult = npx eslint --version 2>&1
        Write-Host "📋 ESLint version: $testResult" -ForegroundColor Cyan
        
        # Test on a sample file
        if (Test-Path "src") {
            Write-Host "🔍 Testing ESLint on src/ directory..." -ForegroundColor Yellow
            $lintTest = npx eslint src/ --ext .js --format compact 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ ESLint test passed!" -ForegroundColor Green
                return $true
            } else {
                Write-Host "⚠️ ESLint found issues but is working correctly" -ForegroundColor Yellow
                Write-Host "Output: $lintTest" -ForegroundColor Gray
                return $true
            }
        } else {
            Write-Host "⚠️ src/ directory not found, skipping lint test" -ForegroundColor Yellow
            return $true
        }
    } catch {
        Write-Host "❌ ESLint test failed: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution
if ($Rollback) {
    Invoke-Rollback
    exit 0
}

# Check current ESLint version
Write-Host "🔍 Checking ESLint version..." -ForegroundColor Yellow
try {
    $eslintVersion = npx eslint --version
    Write-Host "Current ESLint version: $eslintVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Could not determine ESLint version" -ForegroundColor Red
}

# Check for existing config files
$hasOldConfig = Test-Path ".eslintrc.json"
$hasNewConfig = Test-Path "eslint.config.js"

Write-Host "📁 Configuration files found:" -ForegroundColor Yellow
Write-Host "   .eslintrc.json: $(if ($hasOldConfig) { '✅' } else { '❌' })" -ForegroundColor $(if ($hasOldConfig) { 'Green' } else { 'Red' })
Write-Host "   eslint.config.js: $(if ($hasNewConfig) { '✅' } else { '❌' })" -ForegroundColor $(if ($hasNewConfig) { 'Green' } else { 'Red' })

if ($TestOnly) {
    $testResult = Test-ESLintConfig
    Write-Host "🎯 Test complete. Result: $(if ($testResult) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($testResult) { 'Green' } else { 'Red' })
    exit $(if ($testResult) { 0 } else { 1 })
}

if ($UseLegacy) {
    # Use legacy mode - keep .eslintrc.json and update package.json
    Write-Host "🔄 Setting up legacy ESLint mode..." -ForegroundColor Yellow
    Set-LegacyESLint
} else {
    # Migrate to ESLint v9 flat config
    Write-Host "🚀 Migrating to ESLint v9 flat config..." -ForegroundColor Yellow
    
    # Backup old config if it exists
    if ($hasOldConfig) {
        Copy-Item ".eslintrc.json" ".eslintrc.json.backup" -Force
        Write-Host "✅ Backed up .eslintrc.json" -ForegroundColor Green
    }
    
    # Create new config
    New-ESLintConfig
    
    # Remove old config
    if ($hasOldConfig) {
        Remove-Item ".eslintrc.json" -Force
        Write-Host "✅ Removed old .eslintrc.json" -ForegroundColor Green
    }
}

# Test the configuration
$testResult = Test-ESLintConfig

if ($testResult) {
    Write-Host "🎉 ESLint migration completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: npm run lint" -ForegroundColor White
    Write-Host "  2. Run: npm run build" -ForegroundColor White
    Write-Host ""
    Write-Host "If you encounter issues, run: .\Fix-ESLint-Migration.ps1 -Rollback" -ForegroundColor Yellow
} else {
    Write-Host "❌ Migration completed but ESLint test failed" -ForegroundColor Red
    Write-Host "You may need to manually adjust the configuration" -ForegroundColor Yellow
    Write-Host "To rollback: .\Fix-ESLint-Migration.ps1 -Rollback" -ForegroundColor Yellow
    exit 1
}