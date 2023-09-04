/* eslint-disable no-multi-assign */
/* eslint-disable no-var */
import { ArrayStore } from '@sxxov/ut/store/stores';
import type { WebSocket } from 'ws';

export interface WsSubscriber {
	url: string;
	sockets: ArrayStore<WebSocket>;
}

declare global {
	var wsSubscribers: ArrayStore<WsSubscriber> | undefined;
}

export const wsSubscribers = (globalThis.wsSubscribers ??= new ArrayStore());
