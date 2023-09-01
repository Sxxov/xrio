import type { Plugin } from 'vite';
import { wsConfigureHttpServer } from '../../ws/wsConfigureHttpServer.js';

// https://github.com/suhaildawood/SvelteKit-integrated-WebSocket/blob/main/vite.config.ts
export const vitePluginIntegratedWsServer = () =>
	({
		name: 'integrated ws server',
		configureServer(server) {
			if (server.httpServer) wsConfigureHttpServer(server.httpServer);
		},
		configurePreviewServer(server) {
			if (server.httpServer) wsConfigureHttpServer(server.httpServer);
		},
	}) satisfies Plugin;
