import type { V3Value } from './V3Value';
import type { TransformValue } from './TransformValue';
import { V3 } from './V3';

export class Transform implements TransformValue {
	/* eslint-disable @typescript-eslint/naming-convention */
	public get 0(): V3Value {
		return this.position;
	}

	public get 1(): V3Value {
		return this.rotation;
	}

	public get 2(): V3Value {
		return this.scale;
	}
	/* eslint-enable */

	constructor(
		public position: V3,
		public rotation: V3,
		public scale: V3,
	) {}

	public static box(trans: TransformValue) {
		if (trans instanceof Transform) return trans;
		return new Transform(
			V3.box(trans[0]),
			V3.box(trans[1]),
			V3.box(trans[2]),
		);
	}

	public unbox(): TransformValue {
		return [
			this.position.unbox(),
			this.rotation.unbox(),
			this.scale.unbox(),
		];
	}
}
