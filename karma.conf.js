module.exports = function (config) {
    config.set({
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage-istanbul-reporter'),  // Asegúrate de que esta línea esté incluida
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      reporters: ['progress', 'coverage-istanbul'],  // Incluye coverage-istanbul o coverage aquí
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, './coverage'),  // Esta es la carpeta donde se guardarán los archivos
        reports: ['html', 'lcovonly', 'text-summary'],  // Los reportes que quieres generar
        fixWebpackSourcePaths: true
      },
      browsers: ['ChromeHeadless'],
      singleRun: false,
      restartOnFileChange: true
    });
  };