import { ws } from '../../../../../tools/ws/ws';
import { frame, type FrameValue } from '../../../../lib/io/frame';

ws('/api/v1/ws/in', (ws) => {
	ws.on('message', (raw) => {
		let data: FrameValue;
		try {
			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			data = JSON.parse(raw.toString('utf8')) as FrameValue;
		} catch (err) {
			console.error(err);
			return;
		}

		const curr = frame.get();
		if (curr && curr[0] > data[0]) return;

		frame.set(data);
	});

	ws.on('close', () => {
		frame.set(undefined);
	});
});

ws('/api/v1/ws/out', (ws) => {
	const unsubscribe = frame.subscribe((data) => {
		if (!data) return;

		ws.send(JSON.stringify(data));
	});

	ws.on('close', () => {
		unsubscribe();
	});
});
