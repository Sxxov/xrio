<script lang="ts">
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import { ic_arrow_forward } from 'maic/two_tone';
</script>

<div class="home">
	<section class="in">
		<a href="/in">
			<Button
				width="100%"
				height="100%"
				{...ButtonVariants.Transparent}
				{...ButtonVariants.Shadow.Sm}
			>
				<div
					class="content"
					slot="content"
				>
					<Svg svg={ic_arrow_forward} />
					<div class="heading">
						<h6>In</h6>
						<h2>Controller Input</h2>
					</div>
					<p>
						This is for the WebXR capable headset, that will control
						the render output.
					</p>
				</div>
			</Button></a
		>
	</section>
	<section class="out">
		<a href="/out">
			<Button
				width="100%"
				height="100%"
				{...ButtonVariants.Transparent}
				{...ButtonVariants.Shadow.Sm}
			>
				<div
					class="content"
					slot="content"
				>
					<Svg svg={ic_arrow_forward} />
					<div class="heading">
						<h6>Out</h6>
						<h2>Render Output</h2>
					</div>
					<p>
						This is for the displaying device, & consists of the 3D
						scene controlled by the controller input.
					</p>
				</div>
			</Button></a
		>
	</section>
</div>

<style lang="postcss">
	.home {
		display: flex;
		flex-wrap: wrap;
		height: 100vh;
		height: 100lvh;

		& > section {
			width: 320px;
			flex-grow: 1;

			&:hover {
				z-index: 1;
			}

			& .content {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
				width: 100%;
				padding: 14px;
				box-sizing: border-box;

				& > .heading {
					display: flex;
					flex-direction: column;
					gap: 28px;

					& > h6 {
						text-align: start;
						font-size: 1rem;
						font-weight: 900;
						font-family: var(----font-family-mono);
						margin: 0;
						color: var(----colour-text-secondary);
						text-transform: uppercase;
					}

					& > h2 {
						text-align: start;
						font-size: clamp(4rem, 8vw, 8rem);
						font-weight: 100;
						margin: 0;
						color: var(----colour-text-primary);
					}
				}

				& > p {
					text-align: start;
					font-size: 1rem;
					margin: 0;
					max-width: 300px;
				}
			}
		}
	}
</style>
