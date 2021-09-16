const CracoEsbuildPlugin = require('craco-esbuild');

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        esbuildLoaderOptions: {
          // Optional. Defaults to auto-detect loader.
          loader: 'tsx', // Set the value to 'tsx' if you use typescript
          target: 'es2015',
        },
        esbuildMinimizerOptions: {
          // Optional. Defaults to:
          target: 'es2015',
          css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
        },
        skipEsbuildJest: true, // Optional. Set to true if you want to use babel for jest tests,
        esbuildJestOptions: {
          loaders: {
            '.js': 'ts',
            '.jsx': 'tsx',
            '.ts': 'ts',
            '.tsx': 'tsx',
          },
        },
      },
    },
  ],
};
