import type WebSocket from 'ws';
import { wsSubscribers } from './wsSubscribers.js';
import { ArrayStore } from '@sxxov/ut/store/stores';

export const ws = (url: string, callback: (ws: WebSocket) => void) => {
	const sockets = new ArrayStore<WebSocket>();

	wsSubscribers?.push({
		url,
		sockets,
	});

	const emitteds = new WeakSet<WebSocket>();
	sockets.subscribeLazy((s) => {
		for (const ws of s.filter((v) => !emitteds.has(v))) {
			callback(ws);
			emitteds.add(ws);
		}
	});
};
