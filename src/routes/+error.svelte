<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@sxxov/sv/button';
	import { Spacer } from '@sxxov/sv/layout';
	import { Svg } from '@sxxov/sv/svg';
	import { ic_arrow_back } from 'maic/two_tone';
	import { clamp } from 'three/src/math/MathUtils.js';
	import Meta from '../lib/meta/Meta.svelte';

	const emojiSet = [
		'😵‍💫',
		'😓',
		'😔',
		'😖',
		'😞',
		'😩',
		'🤧',
		'🤮',
		'🤕',
		'💀',
		'👻',
	];
	let emojiI = 0;
</script>

<Meta
	title="{$page.status} — XRIO"
	description={$page.error?.message ?? String($page.status)}
	keywords={[]}
	src=""
/>
<div class="error">
	<div class="content">
		<h1
			role="presentation"
			on:click={() => {
				emojiI = clamp(emojiI + 1, 0, emojiSet.length - 1);
			}}
		>
			{emojiSet[emojiI]}
		</h1>
		<h5>{$page.status}</h5>
		{#if $page.error}
			<p>{$page.error.message}</p>
		{/if}
		<Spacer height={56} />
		<Button
			on:click={() => {
				history.back();
			}}
			><svelte:fragment slot="left">
				<Svg svg={ic_arrow_back} />
			</svelte:fragment>Go back</Button
		>
	</div>
</div>

<style>
	.error {
		padding: 0 20vw;
		box-sizing: border-box;
		display: grid;
		height: 100vh;
		height: 100lvh;
		justify-items: center;
		align-items: center;

		& > .content {
			text-align: center;

			& > h1 {
				font-size: 4rem;
				line-height: 2;

				cursor: crosshair;

				transform: scale(1);
				filter: invert(0);
				transition:
					transform 0.3s var(----ease-fast-slow),
					filter 0.3s var(----ease-fast-slow);

				user-select: none;

				&:hover {
					transform: scale(1.05);
				}

				&:active {
					transform: scale(0.9);
					filter: invert(1);
				}
			}
		}
	}
</style>
