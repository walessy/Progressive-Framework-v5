# Progressive Framework V5 - Real Integrations Setup Script
Write-Host "🌐 Progressive Framework V5 - Real-World Integrations Setup" -ForegroundColor Green
Write-Host "============================================================"

$ProjectPath = "C:\Projects\Progressive-Framework-v5"

# Change to project directory
Set-Location $ProjectPath
Write-Host "✅ Project directory: $ProjectPath" -ForegroundColor Green

# Step 1: Install additional dependencies
Write-Host "`n📦 Step 1: Installing Integration Dependencies..." -ForegroundColor Yellow
try {
    npm install googleapis axios
    Write-Host "✅ Dependencies installed: googleapis, axios" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not install dependencies - please run manually: npm install googleapis axios" -ForegroundColor Yellow
}

# Step 2: Create directory structure
Write-Host "`n📁 Step 2: Creating Integration Directory Structure..." -ForegroundColor Yellow

if (!(Test-Path "src\integrations")) {
    New-Item -ItemType Directory -Path "src\integrations" -Force | Out-Null
    Write-Host "📁 Created: src\integrations" -ForegroundColor Green
} else {
    Write-Host "📁 Exists: src\integrations" -ForegroundColor Blue
}

if (!(Test-Path "config")) {
    New-Item -ItemType Directory -Path "config" -Force | Out-Null
    Write-Host "📁 Created: config" -ForegroundColor Green
} else {
    Write-Host "📁 Exists: config" -ForegroundColor Blue
}

# Step 3: Create sample configuration files
Write-Host "`n🔧 Step 3: Creating Sample Configuration Files..." -ForegroundColor Yellow

# Sample Google credentials template
$googleCredsSample = @'
{
  "client_id": "your_google_client_id.googleusercontent.com",
  "client_secret": "your_google_client_secret",
  "redirect_uri": "http://localhost:3000/auth/google/callback"
}
'@

$googleCredsFile = "config\sample-google-credentials.json"
Set-Content -Path $googleCredsFile -Value $googleCredsSample -Encoding UTF8
Write-Host "📄 Created: $googleCredsFile" -ForegroundColor Green

# Sample food delivery config template
$foodDeliveryConfigSample = @'
{
  "providers": {
    "ubereats": {
      "enabled": false,
      "api_key": "your_uber_eats_api_key_here",
      "api_url": "https://api.ubereats.com/v1",
      "merchant_id": "your_merchant_id"
    },
    "local_meal_prep": {
      "enabled": false,
      "api_key": "your_local_service_api_key",
      "api_url": "https://api.localmealprep.com/v1"
    }
  },
  "default_settings": {
    "delivery_address": "Update with your address",
    "payment_method": "default_card"
  }
}
'@

$foodConfigFile = "config\sample-food-delivery-config.json"
Set-Content -Path $foodConfigFile -Value $foodDeliveryConfigSample -Encoding UTF8
Write-Host "📄 Created: $foodConfigFile" -ForegroundColor Green

# Sample fitness tracker config template
$fitnessTrackerConfigSample = @'
{
  "providers": {
    "myfitnesspal": {
      "enabled": false,
      "api_url": "https://api.myfitnesspal.com/v1",
      "access_token": "user_authorized_token_here",
      "auth_type": "Bearer"
    },
    "strava": {
      "enabled": false,
      "api_url": "https://www.strava.com/api/v3",
      "access_token": "user_authorized_token_here",
      "auth_type": "Bearer"
    }
  }
}
'@

$fitnessConfigFile = "config\sample-fitness-tracker-config.json"
Set-Content -Path $fitnessConfigFile -Value $fitnessTrackerConfigSample -Encoding UTF8
Write-Host "📄 Created: $fitnessConfigFile" -ForegroundColor Green

# Step 4: Create .gitignore for security
Write-Host "`n🔐 Step 4: Creating Security Configuration..." -ForegroundColor Yellow

$gitignoreContent = @'
# Progressive Framework V5 - Security
config/*.json
!config/sample-*.json
*.env
.env.*

# API Keys and Tokens
google-credentials.json
food-delivery-config.json
fitness-tracker-config.json

# User data
data/userMemory.json
data/actionHistory.json

# Node modules
node_modules/
npm-debug.log*

# Logs
logs/
*.log
'@

if (Test-Path ".gitignore") {
    Add-Content -Path ".gitignore" -Value "`n# Real Integrations Security" -Encoding UTF8
    Add-Content -Path ".gitignore" -Value "config/*.json" -Encoding UTF8
    Add-Content -Path ".gitignore" -Value "!config/sample-*.json" -Encoding UTF8
    Write-Host "✅ Updated: .gitignore with security settings" -ForegroundColor Green
} else {
    Set-Content -Path ".gitignore" -Value $gitignoreContent -Encoding UTF8
    Write-Host "✅ Created: .gitignore with security settings" -ForegroundColor Green
}

# Step 5: Summary and next steps
Write-Host "`n🎉 Real Integrations Setup Complete!" -ForegroundColor Green
Write-Host "============================================================"

Write-Host "`n📊 SETUP SUMMARY:" -ForegroundColor Cyan
Write-Host "✅ Dependencies installed: googleapis, axios" -ForegroundColor Green
Write-Host "✅ Directory structure created: src/integrations, config/" -ForegroundColor Green
Write-Host "✅ Sample configuration files created" -ForegroundColor Green
Write-Host "✅ Security configuration added (.gitignore)" -ForegroundColor Green

Write-Host "`n📋 FILES TO COPY (from artifacts above):" -ForegroundColor Yellow
Write-Host "1. src\integrations\googleCalendar.js" -ForegroundColor White
Write-Host "2. src\integrations\foodDelivery.js" -ForegroundColor White
Write-Host "3. src\integrations\fitnessTracker.js" -ForegroundColor White
Write-Host "4. Replace src\actionEngine.js with enhanced version" -ForegroundColor White

Write-Host "`n⚙️ CONFIGURATION NEEDED:" -ForegroundColor Yellow
Write-Host "1. Copy sample-google-credentials.json → google-credentials.json" -ForegroundColor White
Write-Host "2. Copy sample-food-delivery-config.json → food-delivery-config.json" -ForegroundColor White
Write-Host "3. Copy sample-fitness-tracker-config.json → fitness-tracker-config.json" -ForegroundColor White
Write-Host "4. Add your real API keys to these files" -ForegroundColor White

Write-Host "`n🧪 TEST PROGRESSION:" -ForegroundColor Yellow
Write-Host "Phase 1: File setup (copy integration files)" -ForegroundColor White
Write-Host "Phase 2: Test with simulations (default behavior)" -ForegroundColor White  
Write-Host "Phase 3: Configure one API (e.g., Google Calendar)" -ForegroundColor White
Write-Host "Phase 4: Test real integration" -ForegroundColor White
Write-Host "Phase 5: Add more APIs as needed" -ForegroundColor White

Write-Host "`n🚀 NEXT COMMANDS:" -ForegroundColor Magenta
Write-Host "1. Copy the 4 integration files from artifacts above" -ForegroundColor White
Write-Host "2. node server.js (test in simulation mode first)" -ForegroundColor White
Write-Host "3. Configure APIs when ready for real integrations" -ForegroundColor White

Write-Host "`n💡 TIP: Your system works in simulation mode by default!" -ForegroundColor Green
Write-Host "No API setup required to test - real integrations are optional enhancements." -ForegroundColor Green

Write-Host "`n🌟 Your Progressive Framework V5 is ready for real-world actions!" -ForegroundColor Cyan