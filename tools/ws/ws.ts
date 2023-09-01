import type WebSocket from 'ws';
import { wsSockets } from './wsSockets.js';

export const ws = (url: string, callback: (ws: WebSocket) => void) => {
	wsSockets.get().set(url, undefined);
	wsSockets.trigger();

	wsSockets.subscribeLazy((sockets) => {
		const ws = sockets.get(url);

		if (ws) callback(ws);
	});
};
