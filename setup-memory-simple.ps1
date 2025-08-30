# Progressive Framework V5 - Simple Memory Enhancement Setup
# No embedded JavaScript - PowerShell only!

Write-Host "🧠 Progressive Framework V5 - Memory Enhancement Setup" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Gray

# Check if we're in the correct directory
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found. Please run this script from your project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Green

# Step 1: Create memory directory structure
Write-Host "`n🏗️ Step 1: Creating Memory System Directories..." -ForegroundColor Yellow

New-Item -ItemType Directory -Path "src\memory" -Force | Out-Null
New-Item -ItemType Directory -Path "data\conversations" -Force | Out-Null
New-Item -ItemType Directory -Path "data\profiles" -Force | Out-Null
New-Item -ItemType Directory -Path "data\indexes" -Force | Out-Null
New-Item -ItemType Directory -Path "data\backup" -Force | Out-Null

Write-Host "✅ Created all memory directories" -ForegroundColor Green

# Step 2: Install additional dependencies
Write-Host "`n📦 Step 2: Installing Additional Dependencies..." -ForegroundColor Yellow

Write-Host "Installing natural..." -ForegroundColor Cyan
npm install natural --save

Write-Host "Installing stopword..." -ForegroundColor Cyan  
npm install stopword --save

Write-Host "Installing stemmer..." -ForegroundColor Cyan
npm install stemmer --save

Write-Host "Installing leven..." -ForegroundColor Cyan
npm install leven --save

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 3: Create backup
Write-Host "`n💾 Step 3: Creating Backup..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "data\backup\$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Copy-Item "server.js" "$backupDir\server.js.bak"
Write-Host "✅ Backed up server.js" -ForegroundColor Green

# Step 4: Create simple memory config
Write-Host "`n⚙️ Step 4: Creating Memory Configuration..." -ForegroundColor Yellow

$configContent = '{"memorySystem":{"enabled":true,"maxConversations":1000},"searchEngine":{"semanticSearchEnabled":true}}'
Set-Content -Path "data\memory_config.json" -Value $configContent -Encoding UTF8
Write-Host "✅ Memory configuration created" -ForegroundColor Green

# Step 5: Create simple test file
Write-Host "`n🧪 Step 5: Creating Simple Test..." -ForegroundColor Yellow

$simpleTest = 'console.log("Memory system test ready - run after copying memory files");'
Set-Content -Path "test-simple.js" -Value $simpleTest -Encoding UTF8
Write-Host "✅ Simple test created" -ForegroundColor Green

# Completion message
Write-Host "`n🎉 SIMPLE SETUP COMPLETE!" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Gray

Write-Host "`n📋 DIRECTORIES CREATED:" -ForegroundColor Yellow
Write-Host "✅ src\memory (ready for memory files)" -ForegroundColor Green
Write-Host "✅ data\conversations (for storing chats)" -ForegroundColor Green
Write-Host "✅ data\profiles (for user profiles)" -ForegroundColor Green
Write-Host "✅ data\indexes (for search indexes)" -ForegroundColor Green

Write-Host "`n📦 DEPENDENCIES INSTALLED:" -ForegroundColor Yellow
Write-Host "✅ natural (NLP processing)" -ForegroundColor Green
Write-Host "✅ stopword (text filtering)" -ForegroundColor Green
Write-Host "✅ stemmer (word stemming)" -ForegroundColor Green  
Write-Host "✅ leven (text similarity)" -ForegroundColor Green

Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Copy ConversationPersistence.js to src\memory\" -ForegroundColor White
Write-Host "2. Copy SemanticMemoryEngine.js to src\memory\" -ForegroundColor White
Write-Host "3. Create server_memory_enhanced.js" -ForegroundColor White
Write-Host "4. Start server: node server_memory_enhanced.js" -ForegroundColor White

Write-Host "`n🌟 MEMORY SYSTEM FOUNDATION READY!" -ForegroundColor Magenta