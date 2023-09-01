<script
	lang="ts"
	context="module"
>
	export interface HamburgerCtx {
		expanded: Store<boolean>;
	}
</script>

<script lang="ts">
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import { Store } from '@sxxov/ut/store';
	import { ic_menu } from 'maic/two_tone';

	export let expanded = false;

	const expandedStore = new Store<boolean>(expanded);
	const ctx: HamburgerCtx = {
		expanded: expandedStore,
	};

	$: expandedStore.set(expanded);
	$: expanded = $expandedStore;
</script>

<div
	class="hamburger"
	class:expanded
>
	{#if expanded}
		<div
			class="overlay"
			role="presentation"
			on:click={() => {
				expanded = false;
			}}
		/>
	{/if}
	<Button
		{...ButtonVariants.Fab.Md}
		{...ButtonVariants.Secondary}
		{...ButtonVariants.Shadow.Sm}
		colourBackground="var(----colour-background-primary)"
		on:click={() => (expanded = !expanded)}
		on:keydown={(e) => e.key === 'Escape' && (expanded = false)}
		><Svg svg={ic_menu} /></Button
	>
	<div class="container">
		<div class="toppings">
			<slot
				name="toppings"
				{ctx}
			/>
		</div>
	</div>
</div>

<style lang="postcss">
	.hamburger {
		& > .overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		& > .container {
			position: absolute;
			/* top: 100%; */
			margin-top: 7px;
			right: 14px;

			min-width: 200px;

			opacity: 1;

			transition: margin-top 0.2s var(----ease-fast-slow),
				opacity 0.2s var(----ease-fast-slow);

			& > .toppings {
				display: flex;
				flex-direction: column;
				gap: 7px;

				transition: gap 0.2s var(----ease-fast-slow);
			}
		}

		&:not(.expanded) {
			& > .container {
				margin-top: 0;
				pointer-events: none;

				visibility: hidden;
				opacity: 0;

				transition: margin-top 0.2s var(----ease-fast-slow),
					opacity 0.1s 0s var(----ease-fast-slow), visibility 0s 0.2s;

				& > .toppings {
					gap: 0;
				}
			}
		}
	}
</style>
