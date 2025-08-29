import * as esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

const indexBuildOptions = {
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

const bundledNearSelectorOptions = {
    entryPoints: ['web/src/js/near-selector.js'],
    bundle: true,
    outfile: 'web/public/near-selector.js',
    format: 'esm',
    splitting: false,
    external: ['@fastnear/utils'],
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

            const indexCtx = await esbuild.context(indexBuildOptions);
            const bundleCtx = await esbuild.context(bundledNearSelectorOptions);

            await Promise.all([
                indexCtx.watch(),
                bundleCtx.watch()
            ]);

            console.log('Watching for changes...');

            process.on('SIGINT', async () => {
                console.log('Stopping watch mode...');
                await Promise.all([
                    indexCtx.dispose(),
                    bundleCtx.dispose()
                ]);
                process.exit(0);
            });
        } else {
            console.log('Building original configuration...');
            await esbuild.build(indexBuildOptions);
            console.log('Building bundled near-selector...');
            await esbuild.build(bundledNearSelectorOptions);
            console.log('All builds completed successfully');
        }
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();
