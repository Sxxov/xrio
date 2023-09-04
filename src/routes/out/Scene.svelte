<script lang="ts">
	import { Frame, type FrameValue } from '../../lib/io/frame';
	import * as THREE from 'three';
	import { T, useLoader, useThrelte } from '@threlte/core';
	import { GLTF } from '@threlte/extras';
	import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
	import glb_amogus from '../../assets/3d/model/amogus.glb?url';
	import glb_zeer0 from '../../assets/3d/model/zeer0.glb?url';
	import exr_cloudy from '../../assets/3d/hdri/kloofendal_48d_partly_cloudy_puresky_2k.exr?url';
	import exr_sunny from '../../assets/3d/hdri/kloppenheim_01_puresky_2k.exr?url';
	import exr_indoor from '../../assets/3d/hdri/studio_small_08_4k.exr?url';
	import { createEventDispatcher, onMount } from 'svelte';
	import { degToRad } from 'three/src/math/MathUtils.js';
	import { V3 } from '../../lib/transform/V3';

	const dispatch = createEventDispatcher();

	let frame: Frame | undefined;

	let [loadedEnv, loadedAmogus, loadedZeer0] = [false, false, false];
	$: loaded = loadedEnv && loadedAmogus && loadedZeer0;
	$: if (loaded) dispatch('loaded');

	const worldMultiplier = new V3(30);
	const { scene } = useThrelte();

	const exrLoader = useLoader(EXRLoader);
	onMount(async () => {
		const hdri = await exrLoader.load(exr_indoor);
		hdri.mapping = THREE.EquirectangularReflectionMapping;

		scene.environment = hdri;
		loadedEnv = true;
	});

	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const ws = new WebSocket(
		`${protocol}//${window.location.host}/api/v1/ws/out`,
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
	ws.addEventListener('message', ({ data }) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			frame = Frame.box(JSON.parse(data) as FrameValue);
		} catch (err) {
			console.error(err);
		}
	});
</script>

{#if frame}
	<T.PerspectiveCamera
		makeDefault
		fov={60}
		position={frame.camera.transform.position.mul(worldMultiplier).array()}
		rotation={frame.camera.transform.rotation.array()}
		scale={frame.camera.transform.scale.array()}
	/>

	<GLTF
		url={glb_zeer0}
		useDraco
		castShadow
		receiveShadow
		position={frame.controllers[0].transform.position
			.mul(worldMultiplier)
			.array()}
		rotation={frame.controllers[0].transform.rotation
			.add([0, degToRad(180), 0])
			.mul([1, 1, -1])
			.array()}
		scale={frame.controllers[0].transform.scale.array()}
		on:create={() => {
			loadedZeer0 = true;
		}}
	/>

	<GLTF
		url={glb_amogus}
		useDraco
		castShadow
		receiveShadow
		position={frame.controllers[1].transform.position
			.mul(worldMultiplier)
			.array()}
		rotation={frame.controllers[1].transform.rotation
			.add([0, degToRad(180), 0])
			.mul([1, 1, -1])
			.array()}
		scale={frame.controllers[1].transform.scale.array()}
		on:create={() => {
			loadedAmogus = true;
		}}
	/>
{/if}
