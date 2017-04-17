module.exports = function (config) {
  config.set({

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],

    // list of files / patterns to load in the browser
    files: [
      // Required by PhantomJS. Otherwise strange errors will be thrown.
      'node_modules/traceur/bin/traceur-runtime.js',

      { pattern: "base.spec.ts" },
      // { pattern: "src/app/**/*.+(ts|html)" }
      { pattern: 'src/**/*.ts' }
    ],

    // list of files to exclude
    exclude: ['src/**/*.d.ts', 'src/**/*.ngfactory.ts'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'karma-typescript'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // TODO: Create another config file with all browsers.
    // TODO: IE and Edge
    browsers: process.env.TRAVIS ? ['PhantomJS', 'Chrome_travis_ci'] : [
      'PhantomJS',
      // 'Chrome',
      // 'ChromeCanary',
      // 'Chrome_small'
      // 'Firefox',
      // 'FirefoxDeveloper',
      // 'Safari',
      // 'Opera',
      // 'IE'
    ],

    customLaunchers: {
      Chrome_small: {
        base: 'ChromeCanary',
        flags: [
          '--window-size=400,400',
          '--window-position=-400,0'
        ]
      },
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    karmaTypescriptConfig: {
      reports: {
        "html": "coverage",
        "text": "",
        "lcovonly": ""
      }
    }
  })
};
