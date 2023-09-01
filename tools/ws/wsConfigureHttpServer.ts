import { wsServer } from './wsServer.js';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'stream';
import { wsSockets } from './wsSockets.js';
import type { WebSocket } from 'ws';

const destroy = (ws: WebSocket) => {
	wsSockets.get().set(ws.url, undefined);
	wsSockets.trigger();
};

export const wsConfigureHttpServer = (server: {
	on(
		evt: string,
		callback: (req: IncomingMessage, sock: Duplex, head: Buffer) => void,
	): void;
}) => {
	server.on('upgrade', (req, sock, head) => {
		if (!req.url) return;

		const { url, headers } = req;

		if (headers.upgrade !== 'websocket') return;
		if (headers['sec-websocket-protocol'] === 'vite-hmr') return;

		const pending = wsSockets.get().has(url);
		// if (!pending) return;

		const existing = wsSockets.get().get(url);
		if (existing) {
			existing.close();
			destroy(existing);
		}

		const s = wsServer.get();

		console.log('upgrade', url, {
			pending,
			existing,
			sockets: Object.fromEntries(wsSockets.get()),
		});

		s.handleUpgrade(req, sock, head, (ws) => {
			wsSockets.get().set(url, ws);
			wsSockets.trigger();
			ws.on('close', () => void destroy(ws));
			s.emit('connection', ws, req);
		});
	});
};
