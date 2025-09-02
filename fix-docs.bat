@echo off
REM ====================================
REM Simple Documentation Organization Fix
REM File: fix-docs.bat
REM ====================================

echo.
echo 🔧 Progressive Framework V5 - Quick Organization Fix
echo ====================================================

set "DOCS_PATH=C:\Projects\Progressive-Framework-v5\docs"

if not exist "%DOCS_PATH%" (
    echo ❌ Documentation path not found: %DOCS_PATH%
    echo Please check your path and try again.
    pause
    exit /b 1
)

echo 📁 Working in: %DOCS_PATH%
echo.

REM ====================================
REM ISSUE 1: Move Network-Architecture-Security.md
REM ====================================
echo 🔄 ISSUE 1: Moving Network-Architecture-Security.md
echo -----------------------------------------------

set "SOURCE_FILE=%DOCS_PATH%\05-DevOps\Network-Architecture-Security.md"
set "TARGET_DIR=%DOCS_PATH%\06-Infrastructure"

if exist "%SOURCE_FILE%" (
    if not exist "%TARGET_DIR%" (
        mkdir "%TARGET_DIR%"
        echo ✅ Created directory: 06-Infrastructure
    )
    
    move "%SOURCE_FILE%" "%TARGET_DIR%\"
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Moved Network-Architecture-Security.md
        echo    From: 05-DevOps\
        echo    To:   06-Infrastructure\
    ) else (
        echo ❌ Failed to move file
    )
) else (
    echo ℹ️  File not found ^(may already be moved^): Network-Architecture-Security.md
)

echo.

REM ====================================
REM ISSUE 2: Handle Duplicate API Documentation
REM ====================================
echo 🔄 ISSUE 2: Renaming Duplicate API Documentation
echo -----------------------------------------------

set "API_DOC_OLD=%DOCS_PATH%\07-Architecture\api_documentation.md"
set "API_DOC_NEW=%DOCS_PATH%\07-Architecture\API-Architecture-Documentation.md"

if exist "%API_DOC_OLD%" (
    ren "%API_DOC_OLD%" "API-Architecture-Documentation.md"
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Renamed duplicate API documentation:
        echo    api_documentation.md
        echo    → API-Architecture-Documentation.md
        echo.
        echo 📋 Now you have:
        echo    • 03-Communication-Protocols\API-Documentation.md ^(protocols focus^)
        echo    • 07-Architecture\API-Architecture-Documentation.md ^(architecture focus^)
    ) else (
        echo ❌ Failed to rename file
    )
) else (
    echo ℹ️  File not found ^(may already be renamed^): api_documentation.md
)

echo.

REM ====================================
REM ISSUE 3: Handle 06-Testing Folder
REM ====================================
echo 🔄 ISSUE 3: Handling 06-Testing Folder
echo -------------------------------------

set "TESTING_FOLDER=%DOCS_PATH%\06-Testing"

if exist "%TESTING_FOLDER%" (
    REM Check if folder has files
    dir /b "%TESTING_FOLDER%" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ⚠️  06-Testing folder contains files
        echo 💡 Consider manually moving important files to archive folder
        echo    Then delete the folder manually
    ) else (
        rmdir "%TESTING_FOLDER%" 2>nul
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Removed empty 06-Testing folder
        ) else (
            echo ❌ Failed to remove 06-Testing folder
        )
    )
) else (
    echo ℹ️  06-Testing folder not found ^(may already be removed^)
)

echo.

REM ====================================
REM SUMMARY
REM ====================================
echo 📊 ORGANIZATION FIX SUMMARY
echo ============================
echo ✅ Organization fixes attempted!
echo.
echo 🎯 NEXT STEPS:
echo 1. Review the moved/renamed files
echo 2. Check your backup folder for content to recover  
echo 3. Continue with missing documentation categories
echo.
echo 📋 EXPECTED 13-FOLDER STRUCTURE:
echo ✅ 01-Core-System
echo ✅ 02-Agent-Management  
echo ✅ 03-Communication-Protocols
echo ✅ 04-Security
echo ✅ 05-DevOps
echo ✅ 06-Infrastructure
echo ✅ 07-Architecture
echo ✅ 08-User-Guides
echo ❌ 09-Admin-Guides ^(missing^)
echo ❌ 10-Troubleshooting ^(missing^)
echo ❌ 11-Integration ^(missing^)
echo ❌ 12-Compliance ^(missing^)
echo ❌ 13-Development ^(missing^)
echo.
echo 🚀 Ready for next phase of documentation!
echo.
pause