<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { inner } from '@sxxov/ut/viewport';
	import { LoaderCircle } from '@sxxov/sv/loaders';
	import { background } from './lib/background';

	let loaded = false;
</script>

<svelte:window
	on:dragover|preventDefault={({ dataTransfer }) => {
		if (dataTransfer) dataTransfer.dropEffect = 'link';
	}}
	on:drop|preventDefault={async ({ dataTransfer }) => {
		const reader = new FileReader();
		const [file] = dataTransfer?.files ?? [];

		if (!file) return;

		const dataUrl = String(
			await new Promise((resolve) => {
				reader.addEventListener('load', () => {
					const { result: file } = reader;

					resolve(file);
				});

				reader.readAsDataURL(file);
			}),
		);

		$background = dataUrl;
	}}
/>
<div
	class="out"
	style="background-image: {$background ? `url(${$background})` : '#0000'}"
>
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

		background-position: center;

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
