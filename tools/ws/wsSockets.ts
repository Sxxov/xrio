/* eslint-disable no-multi-assign */
/* eslint-disable no-var */
import { Store } from '@sxxov/ut/store';
import type { WebSocket } from 'ws';

declare global {
	var wsSockets: Store<Map<string, WebSocket | undefined>> | undefined;
}

export const wsSockets = (globalThis.wsSockets ??= new Store(
	new Map<string, WebSocket | undefined>(),
));
