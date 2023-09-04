import { wsServer } from './wsServer.js';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'stream';
import type { WebSocket } from 'ws';
import { wsSubscribers } from './wsSubscribers.js';

export const wsConfigureHttpServer = (server: {
	on(
		evt: string,
		callback: (req: IncomingMessage, sock: Duplex, head: Buffer) => void,
	): void;
}) => {
	server.on('upgrade', (req, sock, head) => {
		const { url, headers } = req;

		if (!url) return;
		if (headers.upgrade !== 'websocket') return;
		if (headers['sec-websocket-protocol'] === 'vite-hmr') return;

		const s = wsServer.get();

		s.handleUpgrade(req, sock, head, (ws) => {
			const subscriber = wsSubscribers.find((v) => v.url === url);

			if (subscriber) subscriber.sockets.push(ws);
			else
				console.warn(
					`Handled upgrade for url(${url}) with no subscribers. This is probably a bug & a memory leak.`,
				);

			ws.on('close', () => {
				subscriber?.sockets.remove(ws);
			});
			s.emit('connection', ws, req);
		});
	});
};
