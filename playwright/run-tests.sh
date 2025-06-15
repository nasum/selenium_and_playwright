#!/bin/bash

echo "=== Playwright E2E Test Runner ==="
echo ""

# Function to check if Playwright is installed
check_playwright() {
    if [ ! -d "node_modules/@playwright" ]; then
        echo "❌ Playwright not found. Please run 'npm install' first."
        return 1
    fi
    echo "✅ Playwright found"
    return 0
}

# Function to check if browsers are installed
check_browsers() {
    echo "Checking browser installations..."
    npx playwright install --dry-run > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "❌ Browsers not installed. Run 'npm run install-browsers' first."
        return 1
    fi
    echo "✅ Browsers are installed"
    return 0
}

# Function to install dependencies
install_deps() {
    echo "Installing dependencies..."
    npm install
    
    echo "Installing Playwright browsers..."
    npm run install-browsers
    
    echo "Installing system dependencies..."
    npm run install-deps
}

# Function to run tests
run_tests() {
    local project=$1
    local headed=$2
    
    if [ -n "$project" ]; then
        echo "Running tests for $project..."
        if [ "$headed" = "true" ]; then
            npm run test -- --project=$project --headed
        else
            npm run test -- --project=$project
        fi
    else
        echo "Running tests for all browsers..."
        if [ "$headed" = "true" ]; then
            npm run test:headed
        else
            npm run test:all
        fi
    fi
}

# Function to show report
show_report() {
    echo "Opening test report..."
    npm run test:report
}

# Function to run specific test file
run_specific_test() {
    local testFile=$1
    local project=$2
    
    if [ -n "$project" ]; then
        echo "Running $testFile with $project..."
        npm run test -- --project=$project "$testFile"
    else
        echo "Running $testFile with all browsers..."
        npm run test -- "$testFile"
    fi
}

# Main script
case "$1" in
    "install")
        install_deps
        ;;
    "test")
        if ! check_playwright || ! check_browsers; then
            echo "Please run '$0 install' first."
            exit 1
        fi
        run_tests "$2" "$3"
        ;;
    "test-headed")
        if ! check_playwright || ! check_browsers; then
            echo "Please run '$0 install' first."
            exit 1
        fi
        run_tests "$2" "true"
        ;;
    "test-file")
        if ! check_playwright || ! check_browsers; then
            echo "Please run '$0 install' first."
            exit 1
        fi
        run_specific_test "$2" "$3"
        ;;
    "report")
        show_report
        ;;
    "debug")
        if ! check_playwright || ! check_browsers; then
            echo "Please run '$0 install' first."
            exit 1
        fi
        echo "Running tests in debug mode..."
        npm run test:debug
        ;;
    *)
        echo "Usage: $0 {install|test|test-headed|test-file|report|debug} [options]"
        echo ""
        echo "Commands:"
        echo "  install              - Install Playwright and browsers"
        echo "  test [browser]       - Run tests (optional: chrome|firefox|edge)"
        echo "  test-headed [browser] - Run tests in headed mode"
        echo "  test-file <file> [browser] - Run specific test file"
        echo "  report               - Show test report"
        echo "  debug                - Run tests in debug mode"
        echo ""
        echo "Examples:"
        echo "  $0 install"
        echo "  $0 test"
        echo "  $0 test chrome"
        echo "  $0 test-headed firefox"
        echo "  $0 test-file tests/example.spec.js edge"
        echo "  $0 report"
        echo ""
        exit 1
        ;;
esac
