/* =========================================================
   Configuración de pruebas unitarias: Karma + Jasmine
   - Karma abre Chrome (sin ventana) y ejecuta las pruebas.
   - Jasmine es el framework con el que se escriben (describe / it / expect).
   - Webpack + Babel compilan el JSX de React para el navegador.
   - babel-plugin-istanbul instrumenta el código para medir cobertura.
   Uso:  npm test          → corre una vez y genera coverage/
         npm run test:watch → queda escuchando cambios
   ========================================================= */
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine-html-reporter',
    ],
    files: [
      'src/test/entorno.js',
      { pattern: 'src/__tests__/**/*.spec.jsx', watched: false },
    ],
    preprocessors: {
      'src/__tests__/**/*.spec.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            resolve: { fullySpecified: false },
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: 'last 2 Chrome versions' }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: [
                  ['istanbul', { exclude: ['src/__tests__/**', 'src/test/**', 'node_modules/**'] }],
                ],
              },
            },
          },
        ],
      },
      resolve: { extensions: ['.js', '.jsx'] },
      stats: 'errors-only',
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
        { type: 'text', file: 'resumen.txt' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
      ],
    },
    client: { clearContext: false, jasmine: { random: false } },
    browsers: ['ChromeHeadless'],
    singleRun: false,
    browserNoActivityTimeout: 60000,
  });
};
