/* eslint-disable no-var */
/* eslint-disable no-multi-assign */
import { LazyStore } from '@sxxov/ut/store/stores';
import { WebSocketServer } from 'ws';

declare global {
	var wsServer: LazyStore<WebSocketServer> | undefined;
}

export const wsServer = (globalThis.wsServer ??= new LazyStore(
	() => new WebSocketServer({ noServer: true }),
));
