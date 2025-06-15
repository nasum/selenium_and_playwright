param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "test", "test-only", "status")]
    [string]$Action
)

Write-Host "=== Selenium Hub E2E Test Runner ===" -ForegroundColor Green
Write-Host ""

# Function to check if Selenium Hub is running
function Test-HubStatus {
    Write-Host "Checking Selenium Hub status..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4444/status" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Selenium Hub is running" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ Selenium Hub is not running" -ForegroundColor Red
        return $false
    }
    return $false
}

# Function to start Selenium Hub
function Start-Hub {
    Write-Host "Starting Selenium Hub and nodes..." -ForegroundColor Yellow
    docker-compose up -d
    
    # Wait for hub to be ready
    Write-Host "Waiting for Selenium Hub to be ready..." -ForegroundColor Yellow
    $maxAttempts = 30
    for ($i = 1; $i -le $maxAttempts; $i++) {
        if (Test-HubStatus) {
            break
        }
        Write-Host "Waiting... ($i/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
    
    if (-not (Test-HubStatus)) {
        Write-Host "❌ Failed to start Selenium Hub" -ForegroundColor Red
        exit 1
    }
    
    # Show hub status
    Write-Host ""
    Write-Host "Selenium Hub Console: http://localhost:4444" -ForegroundColor Cyan
    Write-Host ""
}

# Function to stop Selenium Hub
function Stop-Hub {
    Write-Host "Stopping Selenium Hub and nodes..." -ForegroundColor Yellow
    docker-compose down
}

# Function to run tests
function Invoke-Tests {
    Write-Host "Running E2E tests..." -ForegroundColor Yellow
    npm run test -- --conf wdio.hub.conf.js
}

# Main script logic
switch ($Action) {
    "start" {
        Start-Hub
    }
    "stop" {
        Stop-Hub
    }
    "test" {
        if (-not (Test-HubStatus)) {
            Write-Host "Starting Selenium Hub first..." -ForegroundColor Yellow
            Start-Hub
        }
        Invoke-Tests
    }
    "test-only" {
        Invoke-Tests
    }
    "status" {
        if (Test-HubStatus) {
            Write-Host "Hub console: http://localhost:4444" -ForegroundColor Cyan
            Write-Host "Grid status: http://localhost:4444/status" -ForegroundColor Cyan
        }
    }
    default {
        Write-Host "Usage: .\run-tests.ps1 -Action {start|stop|test|test-only|status}" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  start     - Start Selenium Hub and browser nodes" -ForegroundColor White
        Write-Host "  stop      - Stop Selenium Hub and browser nodes" -ForegroundColor White
        Write-Host "  test      - Start hub (if needed) and run tests" -ForegroundColor White
        Write-Host "  test-only - Run tests (assuming hub is already running)" -ForegroundColor White
        Write-Host "  status    - Check if Selenium Hub is running" -ForegroundColor White
        Write-Host ""
        exit 1
    }
}
