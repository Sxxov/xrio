<script
	lang="ts"
	context="module"
>
	export const navVacated = new Store(false);
</script>

<script lang="ts">
	import { Store } from '@sxxov/ut/store';
	import { ic_lightbulb } from 'maic/two_tone';
	import { theme } from '../theme/theme';
	import Hamburger from './Hamburger.svelte';
	import Hasher from './Hasher.svelte';
	import Logo from './Logo.svelte';
	import Topping from './Topping.svelte';
</script>

<div
	class="nav"
	class:vacated={$navVacated}
>
	<div class="left">
		<Logo />
	</div>
	<div class="centre">
		<div class="spacer" />
		<Hasher />
	</div>
	<div class="right">
		<slot name="cta" />
		<Hamburger>
			<svelte:fragment
				slot="toppings"
				let:ctx
			>
				<Topping
					{ctx}
					icon={ic_lightbulb}
					name={$theme === 'light'
						? 'Turn off lights'
						: 'Turn on lights'}
					on:click={() => {
						$theme = $theme === 'light' ? 'dark' : 'light';
					}}
				/>
				<slot name="toppings" />
			</svelte:fragment>
		</Hamburger>
	</div>
</div>

<style lang="postcss">
	.nav {
		position: fixed;
		top: 0;
		height: 84px;
		width: 100%;
		gap: 14px;

		display: flex;
		align-items: center;
		justify-content: space-between;

		/* background: var(----colour-background-primary); */
		z-index: 99;

		/* border-bottom: 1px solid var(----colour-background-secondary); */

		pointer-events: none;

		padding: 14px;
		box-sizing: border-box;

		& > .left {
			float: left;

			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 14px;

			pointer-events: auto;
		}

		& > .centre {
			pointer-events: auto;
			flex-grow: 1;
			width: 0;

			display: flex;
			align-items: center;
			justify-content: center;

			.vacated& {
				margin-top: -168px;
				opacity: 0;
			}

			& > .spacer {
				width: 56px;
				flex-shrink: 1;

				transition: width 0.3s var(----ease-slow-slow);

				.vacated& {
					width: 0;
				}

				@media (max-width: 768px) {
					width: 0;
				}
			}
		}

		& > .right {
			float: right;

			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 14px;

			pointer-events: auto;

			& > .locale {
				width: 56px;
				opacity: 1;

				transition:
					width 0.3s var(----ease-slow-slow),
					opacity 0.3s var(----ease-slow-slow);

				.vacated& {
					width: 0;
					opacity: 0;
				}

				@media (max-width: 768px) {
					width: 0;
					opacity: 0;
				}
			}
		}
	}
</style>
