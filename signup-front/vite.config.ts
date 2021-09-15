import { defineConfig, loadEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import fs from 'fs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
  const envWithProcessPrefix = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        ['process.env.' + key]: `"${val}"`,
      };
    },
    {}
  );
  return {
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    esbuild: {
      loader: 'tsx',
      include: /src\/.*\.[tj]sx?$/,
      exclude: [],
      jsxInject: `import React from 'react'`,
    },
    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
      },
    },
    define: envWithProcessPrefix,
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: 'load-js-files-as-jsx',
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: 'jsx',
                contents: await fs.promises.readFile(args.path, 'utf8'),
              }));
            },
          },
        ],
      },
    },
    server: {
      port: 4000,
    },
    plugins: [reactRefresh()],
  };
});
