<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { inner } from '@sxxov/ut/viewport';
	import { LoaderCircle } from '@sxxov/sv/loaders';
	import { background } from './lib/background';

	let loaded = false;

	let shift = false;
	let obs = 'obsstudio' in globalThis;
	$: clickable = shift || obs;

	let fileInput: HTMLInputElement | undefined;
	const setFileAsBackground = async (file: File) => {
		const reader = new FileReader();

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
	};
</script>

<svelte:window
	on:dragover|preventDefault={({ dataTransfer }) => {
		if (dataTransfer) dataTransfer.dropEffect = 'link';
	}}
	on:drop|preventDefault={async ({ dataTransfer }) => {
		const [file] = dataTransfer?.files ?? [];

		if (!file) return;

		await setFileAsBackground(file);
	}}
	on:keydown={(e) => {
		shift = e.shiftKey;
	}}
	on:keyup={(e) => {
		shift = e.shiftKey;
	}}
/>
<div
	class="out"
	class:clickable
	style="--image: {$background ? `url(${$background})` : '#0000'}"
	role="presentation"
	on:click={() => {
		if (!clickable) return;

		fileInput?.click();
	}}
	on:contextmenu={(e) => {
		if (!clickable) return;

		e.preventDefault();
		e.stopPropagation();

		$background = undefined;
	}}
>
	<input
		type="file"
		class="file"
		accept="image/*"
		bind:this={fileInput}
		on:change={async ({ currentTarget }) => {
			const [file] = currentTarget.files ?? [];

			if (!file) return;

			await setFileAsBackground(file);
		}}
	/>
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

		background-image: var(--image);
		background-size: cover;
		background-position: center;

		&.clickable {
			cursor: pointer;
		}

		& > input.file {
			display: none;
		}

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
