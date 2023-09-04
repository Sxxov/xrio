<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		CameraFrameChunk,
		ControllerFrameChunk,
		Frame,
		type FrameValue,
	} from '../../lib/io/frame';
	import { Transform } from '../../lib/transform/Transform';
	import { V3 } from '../../lib/transform/V3';

	const dispatch = createEventDispatcher();

	const { renderer, scene, camera } = useThrelte();
	renderer.xr.enabled = true;

	const [controllerLeft, controllerRight] = [
		renderer.xr.getController(1),
		renderer.xr.getController(0),
	];
	scene.add(controllerLeft, controllerRight);

	const [handLeft, handRight] = [
		renderer.xr.getHand(1),
		renderer.xr.getHand(0),
	];
	scene.add(handLeft, handRight);

	let gamepadLeft: Gamepad | undefined;
	let gamepadRight: Gamepad | undefined;
	controllerLeft.addEventListener('connected', ({ data }) => {
		({ gamepad: gamepadLeft } = data);
	});
	controllerLeft.addEventListener('disconnected', () => {
		gamepadLeft = undefined;
	});
	controllerRight.addEventListener('connected', ({ data }) => {
		({ gamepad: gamepadRight } = data);
	});
	controllerRight.addEventListener('disconnected', () => {
		gamepadRight = undefined;
	});

	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const ws = new WebSocket(
		`${protocol}//${window.location.host}/api/v1/ws/in`,
	);
	ws.addEventListener('close', () => {
		// eslint-disable-next-line no-alert
		confirm('📴 WebSocket connection closed. Press OK to Reload') &&
			window.location.reload();
	});
	ws.addEventListener('error', () => {
		// eslint-disable-next-line no-alert
		confirm('❌ WebSocket connection error. Press OK to Reload') &&
			window.location.reload();
	});

	renderer.setAnimationLoop((t) => {
		renderer.render(scene, $camera);

		if (ws.readyState === ws.OPEN) {
			const frame = new Frame(
				t,
				[
					new ControllerFrameChunk(
						new Transform(
							new V3(
								controllerLeft.position.x,
								controllerLeft.position.y,
								controllerLeft.position.z,
							),
							new V3(
								controllerLeft.rotation.x,
								controllerLeft.rotation.y,
								controllerLeft.rotation.z,
							),
							new V3(
								controllerLeft.scale.x,
								controllerLeft.scale.y,
								controllerLeft.scale.z,
							),
						),
						(gamepadLeft?.axes ?? []) as number[],
						gamepadLeft?.buttons.map(
							({ pressed, touched, value }) => ({
								pressed,
								touched,
								value,
							}),
						) ?? [],
					),
					new ControllerFrameChunk(
						new Transform(
							new V3(
								controllerRight.position.x,
								controllerRight.position.y,
								controllerRight.position.z,
							),
							new V3(
								controllerRight.rotation.x,
								controllerRight.rotation.y,
								controllerRight.rotation.z,
							),
							new V3(
								controllerRight.scale.x,
								controllerRight.scale.y,
								controllerRight.scale.z,
							),
						),
						(gamepadRight?.axes ?? []) as number[],
						gamepadRight?.buttons.map(
							({ pressed, touched, value }) => ({
								pressed,
								touched,
								value,
							}),
						) ?? [],
					),
				],
				new CameraFrameChunk(
					new Transform(
						new V3(
							$camera.position.x,
							$camera.position.y,
							$camera.position.z,
						),
						new V3(
							$camera.rotation.x,
							$camera.rotation.y,
							$camera.rotation.z,
						),
						new V3(
							$camera.scale.x,
							$camera.scale.y,
							$camera.scale.z,
						),
					),
				),
			).unbox() satisfies FrameValue;

			console.log(frame);

			ws.send(JSON.stringify(frame));
		}
	});

	onMount(async () => {
		dispatch('loaded', {
			button: (
				await import('three/addons/webxr/VRButton.js')
			).VRButton.createButton(renderer),
		});
	});
</script>
