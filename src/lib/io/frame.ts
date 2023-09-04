import { Store } from '@sxxov/ut/store';
import type { TransformValue } from '../transform/TransformValue';
import { Transform } from '../transform/Transform';

export interface ControllerButtonFrameChunk {
	pressed: boolean;
	touched: boolean;
	value: number;
}

export interface ControllerFrameChunkValue {
	0: TransformValue;
	1: number[];
	2: ControllerButtonFrameChunk[];
}

export class ControllerFrameChunk implements ControllerFrameChunkValue {
	/* eslint-disable @typescript-eslint/naming-convention */
	public get 0() {
		return this.transform;
	}

	public get 1() {
		return this.axes;
	}

	public get 2() {
		return this.buttons;
	}
	/* eslint-enable */

	constructor(
		public transform: Transform,
		public axes: number[],
		public buttons: ControllerButtonFrameChunk[],
	) {}

	public static box(chunk: ControllerFrameChunkValue): ControllerFrameChunk {
		if (chunk instanceof ControllerFrameChunk) return chunk;
		return new ControllerFrameChunk(
			Transform.box(chunk[0]),
			chunk[1],
			chunk[2],
		);
	}

	public unbox(): ControllerFrameChunkValue {
		return [this.transform.unbox(), this.axes, this.buttons];
	}
}

export interface CameraFrameChunkValue {
	0: TransformValue;
}

export class CameraFrameChunk implements CameraFrameChunkValue {
	/* eslint-disable @typescript-eslint/naming-convention */
	public get 0() {
		return this.transform;
	}
	/* eslint-enable */

	public transform: Transform;

	constructor(transform: TransformValue) {
		this.transform = Transform.box(transform);
	}

	public static box(chunk: CameraFrameChunkValue): CameraFrameChunk {
		if (chunk instanceof CameraFrameChunk) return chunk;
		return new CameraFrameChunk(Transform.box(chunk[0]));
	}

	public unbox(): CameraFrameChunkValue {
		return [this.transform.unbox()];
	}
}

export interface FrameValue {
	0: number;
	1: [ControllerFrameChunkValue, ControllerFrameChunkValue];
	2: CameraFrameChunkValue;
}

export class Frame {
	/* eslint-disable @typescript-eslint/naming-convention */
	public get 0() {
		return this.timestamp;
	}

	public get 1() {
		return this.controllers;
	}

	public get 2() {
		return this.camera;
	}
	/* eslint-enable */

	/* eslint-disable @typescript-eslint/parameter-properties */
	public timestamp: number;
	public controllers: [ControllerFrameChunk, ControllerFrameChunk];
	public camera: CameraFrameChunk;
	/* eslint-enable */

	constructor(
		timestamp: number,
		controllers: [ControllerFrameChunkValue, ControllerFrameChunkValue],
		camera: CameraFrameChunkValue,
	) {
		this.timestamp = timestamp;
		this.controllers = [
			ControllerFrameChunk.box(controllers[0]),
			ControllerFrameChunk.box(controllers[1]),
		];
		this.camera = CameraFrameChunk.box(camera);
	}

	public static box(frame: FrameValue): Frame {
		if (frame instanceof Frame) return frame;
		return new Frame(
			frame[0],
			[
				ControllerFrameChunk.box(frame[1][0]),
				ControllerFrameChunk.box(frame[1][1]),
			],
			frame[2],
		);
	}

	public unbox(): FrameValue {
		return [
			this.timestamp,
			[this.controllers[0].unbox(), this.controllers[1].unbox()],
			this.camera.unbox(),
		];
	}
}

export const frame = new Store<FrameValue | undefined>(undefined);
