<script lang="ts">
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import { ic_arrow_upward } from 'maic/two_tone';
	import Logo from '../nav/Logo.svelte';
	import { Tween } from '@sxxov/ut/animation';
	import { bezierQuintInOut } from '@sxxov/ut/bezier/beziers';
</script>

<footer>
	<!-- <Logo hasBackNav={false} /> -->
	<div class="explainer">
		<div class="logo">
			<!-- <h1>Mew<br />Chang<br />Tsing</h1> -->
			<Logo
				height="100%"
				width="100%"
				colour="var(----colour-accent-primary)"
			/>
		</div>
	</div>
	<div class="centre">
		<p></p>
		<div class="icons"></div>
	</div>
	<p>©&nbsp; XRIO<br />{new Date().getFullYear()}</p>
	<div class="bottom">
		<Button
			{...ButtonVariants.Secondary}
			width="min(336px, calc(100vw - 56px))"
			on:click={async () => {
				const tween = new Tween(
					window.scrollY,
					0,
					1000,
					bezierQuintInOut,
				);

				tween.subscribe((value) => {
					window.scrollTo(0, value);
				});

				await tween.play();
			}}
			><svelte:fragment slot="left"
				><Svg svg={ic_arrow_upward} /></svelte:fragment
			>Back to Top</Button
		>
	</div>
</footer>

<style lang="postcss">
	footer {
		/* display: grid;
				grid-template-columns: auto 1fr auto; */
		display: flex;
		flex-wrap: wrap;
		gap: max(1rem, 5vw);

		position: relative;
		/* height: 400px; */
		background: var(----colour-background-secondary);
		/* z-index: 9; */

		padding: var(----padding);
		box-sizing: border-box;

		& > .explainer {
			& > .logo {
				display: flex;
				align-items: center;
				gap: 14px;

				color: var(----colour-text-primary);

				& > h1 {
					margin: 0;
					font-size: min(10rem, 20vw);
				}
			}
		}

		& > .centre {
			flex-grow: 1;

			display: flex;
			flex-direction: column;
			gap: 28px;

			& > p {
				margin: 0;
				line-height: 1.6;
			}

			& > .icons {
				display: flex;
			}
		}

		& > .bottom {
			width: 100%;
		}

		& > p {
			margin: 0;
			color: var(----colour-text-primary);
		}
	}
</style>
