import type { Q4Value } from './Q4Value';

export class Q4 implements Q4Value {
	/* eslint-disable @typescript-eslint/naming-convention */
	public get 0() {
		return this.x;
	}

	public get 1() {
		return this.y;
	}

	public get 2() {
		return this.z;
	}

	public get 3() {
		return this.w;
	}
	/* eslint-enable */

	constructor(n: number);
	constructor(x: number, y: number, z: number, w: number);
	constructor(
		public x: number,
		public y = x,
		public z = x,
		public w = x,
	) {}

	public static box(quat: Q4Value) {
		if (quat instanceof Q4) return quat;
		return new Q4(quat[0], quat[1], quat[2], quat[3]);
	}

	public unbox(): Q4Value {
		return [this.x, this.y, this.z, this.w];
	}

	public array(): [number, number, number, number] {
		return [this.x, this.y, this.z, this.w];
	}
}
