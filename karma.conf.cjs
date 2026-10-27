/* =========================================================
   Configuración de pruebas unitarias: Karma + Jasmine
   - Karma abre Chrome (sin ventana) y ejecuta las pruebas.
   - Jasmine es el framework con el que se escriben (describe / it / expect).
   - Webpack + Babel compilan el JSX de React para el navegador.
   - next/navigation y next/link se reemplazan por MOCKS (__tests__/apoyo),
     porque fuera del servidor de Next.js no existe su router.
   - babel-plugin-istanbul instrumenta el código para medir cobertura.
   Uso:  npm test           → corre una vez y genera coverage/
         npm run test:watch → queda escuchando cambios
   ========================================================= */
const path = require('path');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    plugins: ['karma-jasmine', 'karma-webpack', 'karma-chrome-launcher', 'karma-coverage', 'karma-jasmine-html-reporter', 'karma-spec-reporter'],
    files: [
      '__tests__/apoyo/entorno.js',
      { pattern: '__tests__/**/*.spec.tsx', watched: false },
      { pattern: 'public/img/**/*', watched: false, included: false, served: true },
    ],
    // Las imágenes (/img/...) se sirven desde public/, igual que en Next.js
    proxies: { '/img/': '/base/public/img/' },
    preprocessors: { '__tests__/**/*.spec.tsx': ['webpack'] },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  ['@babel/preset-env', { targets: 'last 2 Chrome versions' }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: [['istanbul', { exclude: ['__tests__/**', 'node_modules/**', '.next/**'] }]],
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
          '@': path.resolve(__dirname),
          'next/navigation$': path.resolve(__dirname, '__tests__/apoyo/mock-next-navigation.js'),
          'next/link$': path.resolve(__dirname, '__tests__/apoyo/mock-next-link.jsx'),
        },
      },
      stats: 'errors-only',
    },
    // spec: muestra cada prueba con su nombre (✓ / ✗), agrupada por describe
    reporters: ['spec', 'kjhtml', 'coverage'],
    specReporter: { suppressSkipped: true, showSpecTiming: false },
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
