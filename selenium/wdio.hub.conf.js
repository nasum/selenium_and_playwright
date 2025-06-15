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
                args: ['--no-sandbox', '--disable-infobars', '--disable-gpu', '--window-size=1280,800']
            }
        },
        {
            browserName: 'firefox',
            acceptInsecureCerts: true,
            'moz:firefoxOptions': {
                args: []
            }
        },
        {
            browserName: 'MicrosoftEdge',
            acceptInsecureCerts: true,
            'ms:edgeOptions': {
                args: ['--disable-gpu', '--window-size=1280,800']
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
    // Test runner services
    // Services take over a specific job you don't want to take care of.
    //
    hostname: 'localhost',
    port: 4444,
    path: '/wd/hub',

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
        console.log('Starting tests with Selenium Hub...');
    },
    
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('All tests completed!');
    }
}
