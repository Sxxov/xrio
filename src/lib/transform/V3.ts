import type { V3Value } from './V3Value';

export class V3 implements V3Value {
	public static readonly zero = new V3(0);
	public static readonly one = new V3(1);

	/* eslint-disable @typescript-eslint/naming-convention */
	get 0(): number {
		return this.x;
	}

	get 1(): number {
		return this.y;
	}

	get 2(): number {
		return this.z;
	}
	/* eslint-enable */

	/* eslint-disable @typescript-eslint/parameter-properties */
	public x: number;
	public y: number;
	public z: number;
	/* eslint-enable */

	constructor(n: number);
	constructor(x: number, y: number);
	constructor(x: number, y: number, z: number);
	constructor(x: number, y?: number, z?: number) {
		this.x = x;
		this.y = y ?? x;
		this.z = z ?? (y ? 0 : x);
	}

	public static box(vec: V3Value) {
		if (vec instanceof V3) return vec;
		return new V3(vec[0], vec[1], vec[2]);
	}

	public unbox(): V3Value {
		return [this.x, this.y, this.z];
	}

	public array(): [number, number, number] {
		return [this.x, this.y, this.z];
	}

	public mul(w: V3Value) {
		return new V3(this.x * w[0], this.y * w[1], this.z * w[2]);
	}

	public add(w: V3Value) {
		return new V3(this.x + w[0], this.y + w[1], this.z + w[2]);
	}

	public sub(w: V3Value) {
		return new V3(this.x - w[0], this.y - w[1], this.z - w[2]);
	}

	public div(w: V3Value) {
		return new V3(this.x / w[0], this.y / w[1], this.z / w[2]);
	}

	public *[Symbol.iterator]() {
		yield this.x;
		yield this.y;
		yield this.z;
	}
}
