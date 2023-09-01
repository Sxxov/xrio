<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Frame } from '../../lib/io/frame';

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
			const frame = {
				timestamp: t,
				controllers: [
					{
						transform: {
							position: {
								x: controllerLeft.position.x,
								y: controllerLeft.position.y,
								z: controllerLeft.position.z,
							},
							rotation: {
								x: controllerLeft.rotation.x,
								y: controllerLeft.rotation.y,
								z: controllerLeft.rotation.z,
							},
							scale: {
								x: controllerLeft.scale.x,
								y: controllerLeft.scale.y,
								z: controllerLeft.scale.z,
							},
						},
						axes: gamepadLeft?.axes ?? [],
						buttons:
							gamepadLeft?.buttons.map(
								({ pressed, touched, value }) => ({
									pressed,
									touched,
									value,
								}),
							) ?? [],
					},
					{
						transform: {
							position: {
								x: controllerRight.position.x,
								y: controllerRight.position.y,
								z: controllerRight.position.z,
							},
							rotation: {
								x: controllerRight.rotation.x,
								y: controllerRight.rotation.y,
								z: controllerRight.rotation.z,
							},
							scale: {
								x: controllerRight.scale.x,
								y: controllerRight.scale.y,
								z: controllerRight.scale.z,
							},
						},
						axes: gamepadRight?.axes ?? [],
						buttons:
							gamepadRight?.buttons.map(
								({ pressed, touched, value }) => ({
									pressed,
									touched,
									value,
								}),
							) ?? [],
					},
				],
				camera: {
					transform: {
						position: {
							x: $camera.position.x,
							y: $camera.position.y,
							z: $camera.position.z,
						},
						rotation: {
							x: $camera.rotation.x,
							y: $camera.rotation.y,
							z: $camera.rotation.z,
						},
						scale: {
							x: $camera.scale.x,
							y: $camera.scale.y,
							z: $camera.scale.z,
						},
					},
				},
			} satisfies Frame;

			console.log(frame);

			ws.send(JSON.stringify(frame));
		}
	});

	onMount(async () => {
		dispatch(
			'vr-button',
			(
				await import('three/addons/webxr/VRButton.js')
			).VRButton.createButton(renderer),
		);
	});
</script>
