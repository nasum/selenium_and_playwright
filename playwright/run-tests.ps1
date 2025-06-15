param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("install", "test", "test-headed", "test-file", "report", "debug")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$Browser,
    
    [Parameter(Mandatory=$false)]
    [string]$TestFile
)

Write-Host "=== Playwright E2E Test Runner ===" -ForegroundColor Green
Write-Host ""

# Function to check if Playwright is installed
function Test-PlaywrightInstalled {
    if (-not (Test-Path "node_modules/@playwright")) {
        Write-Host "❌ Playwright not found. Please run 'npm install' first." -ForegroundColor Red
        return $false
    }
    Write-Host "✅ Playwright found" -ForegroundColor Green
    return $true
}

# Function to check if browsers are installed
function Test-BrowsersInstalled {
    Write-Host "Checking browser installations..." -ForegroundColor Yellow
    & npx playwright install --dry-run 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Browsers not installed. Run './run-tests.ps1 install' first." -ForegroundColor Red
        return $false
    }
    Write-Host "✅ Browsers are installed" -ForegroundColor Green
    return $true
}

# Function to install dependencies
function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "Installing Playwright browsers..." -ForegroundColor Yellow
    npm run install-browsers
    
    Write-Host "Installing system dependencies..." -ForegroundColor Yellow
    npm run install-deps
}

# Function to run tests
function Invoke-Tests {
    param(
        [string]$Project,
        [bool]$Headed = $false
    )
    
    if ($Project) {
        Write-Host "Running tests for $Project..." -ForegroundColor Yellow
        if ($Headed) {
            npm run test -- --project=$Project --headed
        } else {
            npm run test -- --project=$Project
        }
    } else {
        Write-Host "Running tests for all browsers..." -ForegroundColor Yellow
        if ($Headed) {
            npm run test:headed
        } else {
            npm run test:all
        }
    }
}

# Function to show report
function Show-Report {
    Write-Host "Opening test report..." -ForegroundColor Yellow
    npm run test:report
}

# Function to run specific test file
function Invoke-SpecificTest {
    param(
        [string]$TestFile,
        [string]$Project
    )
    
    if ($Project) {
        Write-Host "Running $TestFile with $Project..." -ForegroundColor Yellow
        npm run test -- --project=$Project $TestFile
    } else {
        Write-Host "Running $TestFile with all browsers..." -ForegroundColor Yellow
        npm run test -- $TestFile
    }
}

# Main script logic
switch ($Action) {
    "install" {
        Install-Dependencies
    }
    "test" {
        if (-not (Test-PlaywrightInstalled) -or -not (Test-BrowsersInstalled)) {
            Write-Host "Please run '.\run-tests.ps1 install' first." -ForegroundColor Red
            exit 1
        }
        Invoke-Tests -Project $Browser
    }
    "test-headed" {
        if (-not (Test-PlaywrightInstalled) -or -not (Test-BrowsersInstalled)) {
            Write-Host "Please run '.\run-tests.ps1 install' first." -ForegroundColor Red
            exit 1
        }
        Invoke-Tests -Project $Browser -Headed $true
    }
    "test-file" {
        if (-not $TestFile) {
            Write-Host "Please specify a test file with -TestFile parameter." -ForegroundColor Red
            exit 1
        }
        if (-not (Test-PlaywrightInstalled) -or -not (Test-BrowsersInstalled)) {
            Write-Host "Please run '.\run-tests.ps1 install' first." -ForegroundColor Red
            exit 1
        }
        Invoke-SpecificTest -TestFile $TestFile -Project $Browser
    }
    "report" {
        Show-Report
    }
    "debug" {
        if (-not (Test-PlaywrightInstalled) -or -not (Test-BrowsersInstalled)) {
            Write-Host "Please run '.\run-tests.ps1 install' first." -ForegroundColor Red
            exit 1
        }
        Write-Host "Running tests in debug mode..." -ForegroundColor Yellow
        npm run test:debug
    }
    default {
        Write-Host "Usage: .\run-tests.ps1 -Action {install|test|test-headed|test-file|report|debug} [-Browser browser] [-TestFile file]" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  install              - Install Playwright and browsers" -ForegroundColor White
        Write-Host "  test                 - Run tests (optional: -Browser chrome|firefox|edge)" -ForegroundColor White
        Write-Host "  test-headed          - Run tests in headed mode" -ForegroundColor White
        Write-Host "  test-file            - Run specific test file (-TestFile required)" -ForegroundColor White
        Write-Host "  report               - Show test report" -ForegroundColor White
        Write-Host "  debug                - Run tests in debug mode" -ForegroundColor White
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Cyan
        Write-Host "  .\run-tests.ps1 -Action install" -ForegroundColor Cyan
        Write-Host "  .\run-tests.ps1 -Action test" -ForegroundColor Cyan
        Write-Host "  .\run-tests.ps1 -Action test -Browser chrome" -ForegroundColor Cyan
        Write-Host "  .\run-tests.ps1 -Action test-headed -Browser firefox" -ForegroundColor Cyan
        Write-Host "  .\run-tests.ps1 -Action test-file -TestFile tests/example.spec.js -Browser edge" -ForegroundColor Cyan
        Write-Host "  .\run-tests.ps1 -Action report" -ForegroundColor Cyan
        Write-Host ""
        exit 1
    }
}
