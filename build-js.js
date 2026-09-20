import * as esbuild from 'esbuild';
import { copyFile } from 'node:fs/promises';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { rollup, watch as watchRollup } from 'rollup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

const indexBuildOptions = {
    entryPoints: ['web/src/js/index.ts'],
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

const connectorInputOptions = {
    input: 'intearwallet-connect/src/index.ts',
    plugins: [
        replace({
            values: {
                __NEARCONNECT__: 'false',
            },
            preventAssignment: true,
        }),
        typescript({
            tsconfig: 'intearwallet-connect/tsconfig.json',
        }),
    ],
    treeshake: true,
};

const connectorOutputOptions = {
    file: 'intearwallet-connect/build/index.js',
    format: 'esm',
};

async function copyConnectorExample() {
    await copyFile(
        'intearwallet-connect/build/index.js',
        'intearwallet-connect/examples/index.js',
    );
}

async function buildConnectorExample() {
    const bundle = await rollup(connectorInputOptions);
    try {
        await bundle.write(connectorOutputOptions);
    } finally {
        await bundle.close();
    }
    await copyConnectorExample();
}

function watchConnectorExample() {
    const watcher = watchRollup({
        ...connectorInputOptions,
        output: connectorOutputOptions,
    });
    watcher.on('event', async (event) => {
        if (event.code === 'BUNDLE_END') {
            await event.result.close();
            await copyConnectorExample();
        } else if (event.code === 'ERROR') {
            console.error('intearwallet-connect build failed:', event.error);
        }
    });
    return watcher;
}

const bundledNearSelectorOptions = {
    entryPoints: ['web/src/js/near-selector.js'],
    bundle: true,
    outfile: 'web/public/near-selector.js',
    format: 'esm',
    splitting: false,
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
        __NEARCONNECT__: 'true',
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
            const connectorExampleWatcher = watchConnectorExample();
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
                    connectorExampleWatcher.close(),
                    bundleCtx.dispose()
                ]);
                process.exit(0);
            });
        } else {
            console.log('Building original configuration...');
            await esbuild.build(indexBuildOptions);
            console.log('Building intearwallet-connect example...');
            await buildConnectorExample();
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
