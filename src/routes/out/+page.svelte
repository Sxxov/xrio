<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { inner } from '@sxxov/ut/viewport';
	import { LoaderCircle } from '@sxxov/sv/loaders';

	let loaded = false;
</script>

<div class="out">
	<div class="content">
		{#if !loaded}
			<LoaderCircle
				height={56}
				width={56}
			/>
		{/if}
	</div>
	<Canvas
		size={{
			width: $inner.width || 1,
			height: $inner.height || 1,
		}}
		rendererParameters={{
			antialias: true,
			alpha: true,
			premultipliedAlpha: false,
		}}
	>
		<Scene
			on:loaded={() => {
				loaded = true;
			}}
		/>
	</Canvas>
</div>

<style lang="postcss">
	.out {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;

		& > .content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
