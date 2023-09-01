import { Store } from '@sxxov/ut/store';
import type { Transform } from '../transform/Transform';

export interface Frame {
	timestamp: number;
	controllers: readonly {
		transform: Readonly<Transform>;
		axes: readonly number[];
		buttons: readonly {
			pressed: boolean;
			touched: boolean;
			value: number;
		}[];
	}[];
	camera: {
		transform: Readonly<Transform>;
	};
}

export const frame = new Store<Frame | undefined>(undefined);
