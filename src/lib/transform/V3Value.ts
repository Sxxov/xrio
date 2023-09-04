export interface V3Value {
	readonly 0: number;
	readonly 1: number;
	readonly 2: number;
}

export namespace V3Value {
	export const zero: V3Value = [0, 0, 0];
	export const one: V3Value = [1, 1, 1];

	export const mul = (v: V3Value, w: V3Value): V3Value => [
		v[0] * w[0],
		v[1] * w[1],
		v[2] * w[2],
	];

	export const add = (v: V3Value, w: V3Value): V3Value => [
		v[0] + w[0],
		v[1] + w[1],
		v[2] + w[2],
	];

	export const sub = (v: V3Value, w: V3Value): V3Value => [
		v[0] - w[0],
		v[1] - w[1],
		v[2] - w[2],
	];

	export const div = (v: V3Value, w: V3Value): V3Value => [
		v[0] / w[0],
		v[1] / w[1],
		v[2] / w[2],
	];
}
