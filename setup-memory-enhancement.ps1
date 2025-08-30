# Progressive Framework V5 - Memory Enhancement Integration Script (FIXED)
# Option 3: Conversation Persistence Enhancement Implementation

Write-Host "🧠 Progressive Framework V5 - Memory Enhancement Setup" -ForegroundColor Magenta
Write-Host ("=" * 60) -ForegroundColor Gray

# Check if we're in the correct directory
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found. Please run this script from your project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Green

# Step 1: Create memory directory structure
Write-Host "`n🏗️ Step 1: Creating Memory System Directories..." -ForegroundColor Yellow
$directories = @(
    "src\memory",
    "data\conversations", 
    "data\profiles",
    "data\indexes",
    "data\backup"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    } else {
        Write-Host "📁 Directory exists: $dir" -ForegroundColor Cyan
    }
}

# Step 2: Install additional dependencies
Write-Host "`n📦 Step 2: Installing Additional Dependencies..." -ForegroundColor Yellow

$dependencies = @(
    "natural",
    "stopword", 
    "stemmer",
    "leven"
)

foreach ($dep in $dependencies) {
    Write-Host "Installing $dep..." -ForegroundColor Cyan
    try {
        npm install $dep --save 2>&1 | Out-Null
        Write-Host "✅ $dep installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ $dep installation had issues, continuing..." -ForegroundColor Yellow
    }
}

# Step 3: Create backup of existing files
Write-Host "`n💾 Step 3: Creating Backups..." -ForegroundColor Yellow
$backupDir = "data\backup\$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$filesToBackup = @("server.js")
foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        Copy-Item $file "$backupDir\$file.bak"
        Write-Host "✅ Backed up: $file" -ForegroundColor Green
    }
}

# Step 4: Create Memory Configuration File
Write-Host "`n⚙️ Step 4: Creating Memory Configuration..." -ForegroundColor Yellow

$memoryConfigContent = @'
{
  "memorySystem": {
    "enabled": true,
    "maxConversationsInMemory": 1000,
    "conversationTimeoutMs": 86400000,
    "semanticSimilarityThreshold": 0.7,
    "contextWindowSize": 10,
    "autoSummaryThreshold": 20,
    "learningUpdateInterval": 300000
  },
  "searchEngine": {
    "semanticSearchEnabled": true,
    "keywordSearchEnabled": true,
    "entitySearchEnabled": true,
    "maxSearchResults": 10,
    "searchTimeout": 5000
  },
  "personalityModel": {
    "enabled": true,
    "adaptiveLearning": true,
    "personalityFactors": [
      "communicationStyle",
      "learningPreference", 
      "motivationalFactors",
      "decisionMakingStyle"
    ]
  },
  "privacy": {
    "encryptSensitiveData": true,
    "anonymizeAfterDays": 90,
    "dataRetentionDays": 365
  }
}
'@

Set-Content -Path "data\memory_config.json" -Value $memoryConfigContent -Encoding UTF8
Write-Host "✅ Memory configuration created" -ForegroundColor Green

# Step 5: Create test script  
Write-Host "`n🧪 Step 5: Creating Memory Test Script..." -ForegroundColor Yellow

$testScriptContent = @'
// Simple Memory System Test
const axios = require('axios');

async function testMemorySystem() {
    const baseUrl = 'http://localhost:3000';
    
    console.log('🧪 Testing Memory System...');
    
    try {
        // Test basic chat
        const response = await axios.post(`${baseUrl}/chat`, {
            message: "I'm vegetarian and want home workouts",
            userId: "test_user",
            useMemory: true
        });
        
        console.log('✅ Chat Response:', response.data.response);
        console.log('🧠 Enhanced Mode:', response.data.enhanced_mode);
        console.log('📊 Personalization Level:', response.data.personalization_level);
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        console.log('💡 Make sure server is running: node server_memory_enhanced.js');
    }
}

testMemorySystem();
'@

Set-Content -Path "test-memory-system.js" -Value $testScriptContent -Encoding UTF8
Write-Host "✅ Memory test script created: test-memory-system.js" -ForegroundColor Green

# Step 6: Display completion instructions
Write-Host "`n🎉 MEMORY ENHANCEMENT SETUP COMPLETE!" -ForegroundColor Magenta
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "`n📋 WHAT WAS CREATED:" -ForegroundColor Yellow
Write-Host "✅ Memory system directories" -ForegroundColor Green
Write-Host "✅ Additional dependencies installed" -ForegroundColor Green  
Write-Host "✅ Configuration files created" -ForegroundColor Green
Write-Host "✅ Test script created" -ForegroundColor Green
Write-Host "✅ Backup of existing files" -ForegroundColor Green

Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Copy ConversationPersistence.js to src\memory\" -ForegroundColor White
Write-Host "2. Copy SemanticMemoryEngine.js to src\memory\" -ForegroundColor White  
Write-Host "3. Copy the enhanced server content to server_memory_enhanced.js" -ForegroundColor White
Write-Host "4. Start enhanced server: node server_memory_enhanced.js" -ForegroundColor White
Write-Host "5. Test: node demo-memory-capabilities.js" -ForegroundColor White

Write-Host "`n🧠 MEMORY SYSTEM READY FOR INTEGRATION!" -ForegroundColor Magenta
Write-Host "Your Progressive Framework V5 will now learn and remember! 🌟" -ForegroundColor Green