export interface Q4Value {
	0: number;
	1: number;
	2: number;
	3: number;
}

export namespace Q4Value {
	export const array = (q: Q4Value): [number, number, number, number] => [
		q[0],
		q[1],
		q[2],
		q[3],
	];
}
