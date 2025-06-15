export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/specs/**/*.js'
    ],
    
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    
    //
    // ============
    // Capabilities
    // ============
    capabilities: [
        {
            browserName: 'chrome',
            acceptInsecureCerts: true,
            'goog:chromeOptions': {
                args: ['--no-sandbox', '--disable-infobars', '--headless', '--disable-gpu', '--window-size=1280,800']
            }
        },
        {
            browserName: 'firefox',
            acceptInsecureCerts: true,
            'moz:firefoxOptions': {
                args: ['--headless']
            }
        },
        {
            browserName: 'MicrosoftEdge',
            acceptInsecureCerts: true,
            'ms:edgeOptions': {
                args: ['--headless', '--disable-gpu', '--window-size=1280,800']
            }
        }
    ],
    
    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    
    bail: 0,
    
    baseUrl: 'http://localhost',
    
    waitforTimeout: 10000,
    
    connectionRetryTimeout: 120000,
    
    connectionRetryCount: 3,

    //
    // Framework
    //
    framework: 'mocha',
    
    reporters: ['spec'],

    //
    // Options to be passed to Mocha.
    //
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    //
    // =====
    // Hooks
    // =====
    onPrepare: function (config, capabilities) {
        console.log('Starting tests...');
    },
    
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('All tests completed!');
    }
}

// Remote Selenium Hub configuration

config.hostname = 'localhost';
config.port = 4444;
config.path = '/wd/hub';
//config.services = []; // Remove selenium-standalone service when using remote hub
