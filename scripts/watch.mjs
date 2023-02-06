/* eslint-disable tsdoc/syntax */
/* eslint-disable no-unused-expressions */
import { spawn } from 'child_process';
import { createServer, build } from 'vite';
import electron from 'electron';

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchMain(server) {
	/**
	 * @type {import('child_process').ChildProcessWithoutNullStreams | null}
	 */
	let electronProcess = null;
	const address = server.httpServer.address();
	const env = Object.assign(process.env, {
		VITE_DEV_SERVER_HOST: address.address,
		VITE_DEV_SERVER_PORT: address.port,
	});

	return build({
		configFile: 'src/main/vite.config.ts',
		mode: 'development',
		plugins: [
			{
				name: 'electron-main-watcher',
				writeBundle() {
					electronProcess && electronProcess.kill();
					electronProcess = spawn(electron, ['.'], {
						stdio: 'inherit',
						env,
					});
				},
			},
		],
		build: {
			watch: true,
		},
	});
}

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchPreload(server) {
	return build({
		configFile: 'src/preload/vite.config.ts',
		mode: 'development',
		plugins: [
			{
				name: 'electron-preload-watcher',
				writeBundle() {
					server.ws.send({ type: 'full-reload' });
				},
			},
		],
		build: {
			watch: true,
		},
	});
}

// bootstrap
const server = await createServer({
	configFile: 'src/renderer/vite.config.ts',
});

await server.listen();
await watchPreload(server);
await watchMain(server);
