<script
	lang="ts"
	context="module"
>
	export interface HashAnchor {
		id: string;
		name: string;
		top: number;
		offset: number;
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { hashPlaceholder, hashes } from './Hasher.svelte';
	import { inner } from '@sxxov/ut/viewport';
	import { browser } from '$app/environment';

	export let id: string;
	export let name: string;
	export let offset = 0;

	const hash: HashAnchor = { ...hashPlaceholder };
	$: {
		hash.id = id;
		hash.name = name;
		hash.offset = offset;
	}
	let div: HTMLDivElement | undefined;
	let scrollY = 0;
	let scrolling = false;
	let scrollingHandle: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => {
		$hashes = hashes.filter((h) => h !== hash);
	});

	$: if (browser) {
		scrollY;

		scrolling = true;
		if (scrollingHandle) clearTimeout(scrollingHandle);
		scrollingHandle = setTimeout(() => {
			scrolling = false;
		}, 100);
	}

	$: if (scrolling && div) {
		$inner;

		hash.top =
			div.getBoundingClientRect().top +
			document.documentElement.scrollTop -
			document.documentElement.clientTop;
	}

	$: if (!Number.isNaN(hash.top) && !hashes.includes(hash)) hashes.push(hash);

	$: {
		hash.id;
		hash.name;
		hash.offset;
		hash.top;

		hashes.trigger();
	}
</script>

<svelte:window bind:scrollY />
<div
	class="hash"
	{id}
	bind:this={div}
/>

<style lang="postcss">
</style>
