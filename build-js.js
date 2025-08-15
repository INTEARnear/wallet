import * as esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

const buildOptions = {
    entryPoints: ['web/src/js/index.tsx'],
    bundle: true,
    outdir: 'web/public/js',
    format: 'esm',
    splitting: true,
    plugins: [
        polyfillNode({
            polyfills: {
                events: true,
                _events: true,
            },
        }),
    ],
    define: {
        global: 'globalThis',
    },
    ...(isWatch ? {
        sourcemap: true
    } : {
        minify: true
    })
};

async function build() {
    try {
        if (isWatch) {
            console.log('Starting watch mode...');
            const ctx = await esbuild.context(buildOptions);
            await ctx.watch();
            console.log('Watching for changes...');

            process.on('SIGINT', async () => {
                await ctx.dispose();
                process.exit(0);
            });
        } else {
            console.log('Building...');
            await esbuild.build(buildOptions);
            console.log('Build completed successfully');
        }
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();
