module.exports = function (config) {
    config.set({
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      reporters: ['progress', 'coverage-istanbul'],
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, './coverage'),
        reports: ['html', 'lcovonly', 'text-summary'],
        fixWebpackSourcePaths: true
      },
      browsers: ['ChromeHeadless'],
      singleRun: false,
      restartOnFileChange: true
    });
  };