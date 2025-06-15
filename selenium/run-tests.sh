#!/bin/bash

echo "=== Selenium Hub E2E Test Runner ==="
echo ""

# Function to check if Selenium Hub is running
check_hub_status() {
    echo "Checking Selenium Hub status..."
    curl -s http://localhost:4444/status > /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Selenium Hub is running"
        return 0
    else
        echo "❌ Selenium Hub is not running"
        return 1
    fi
}

# Function to start Selenium Hub
start_hub() {
    echo "Starting Selenium Hub and nodes..."
    docker-compose up -d
    
    # Wait for hub to be ready
    echo "Waiting for Selenium Hub to be ready..."
    for i in {1..30}; do
        if check_hub_status; then
            break
        fi
        echo "Waiting... ($i/30)"
        sleep 2
    done
    
    if ! check_hub_status; then
        echo "❌ Failed to start Selenium Hub"
        exit 1
    fi
    
    # Show hub status
    echo ""
    echo "Selenium Hub Console: http://localhost:4444"
    echo ""
}

# Function to stop Selenium Hub
stop_hub() {
    echo "Stopping Selenium Hub and nodes..."
    docker-compose down
}

# Function to run tests
run_tests() {
    echo "Running E2E tests..."
    npm run test -- --conf wdio.hub.conf.js
}

# Main script
case "$1" in
    "start")
        start_hub
        ;;
    "stop")
        stop_hub
        ;;
    "test")
        if ! check_hub_status; then
            echo "Starting Selenium Hub first..."
            start_hub
        fi
        run_tests
        ;;
    "test-only")
        run_tests
        ;;
    "status")
        check_hub_status
        if [ $? -eq 0 ]; then
            echo "Hub console: http://localhost:4444"
            echo "Grid status: http://localhost:4444/status"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|test|test-only|status}"
        echo ""
        echo "Commands:"
        echo "  start     - Start Selenium Hub and browser nodes"
        echo "  stop      - Stop Selenium Hub and browser nodes"
        echo "  test      - Start hub (if needed) and run tests"
        echo "  test-only - Run tests (assuming hub is already running)"
        echo "  status    - Check if Selenium Hub is running"
        echo ""
        exit 1
        ;;
esac
