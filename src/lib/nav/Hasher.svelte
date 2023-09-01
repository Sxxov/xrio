<script
	lang="ts"
	context="module"
>
	export const hashPlaceholder: Readonly<IHash> = {
		id: '',
		name: '',
		top: -Infinity,
		offset: 0,
	};
	export const hashes = new ArrayStore<IHash>();
	export const hash = new Store<IHash>(hashPlaceholder);
</script>

<script lang="ts">
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import { dropIn, dropOut } from '@sxxov/sv/ut/transition';
	import { Store } from '@sxxov/ut/store';
	import { ArrayStore } from '@sxxov/ut/store/stores';
	import { ic_expand_less, ic_expand_more } from 'maic/two_tone';
	import type { IHash } from './IHash';
	import { Tween } from '@sxxov/ut/animation';
	import { bezierQuintInOut } from '@sxxov/ut/bezier/beziers';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';

	export let expanded = false;

	let scrollY = NaN;
	let scrolling = false;
	let effect = true;

	const getScrolling = () => scrolling;
	const getHashFromUrl = () => {
		if (typeof window === 'undefined') return;

		const id = window.location.hash.slice(1);
		return $hashes.find((h) => h.id === id);
	};
	const getHashFromScroll = (pos: number) =>
		$hashes
			.sort((a, b) => (a.top + a.offset > b.top + b.offset ? 1 : -1))
			.reduce(
				(prev, curr) => (pos >= curr.top + curr.offset ? curr : prev),
				$hashes[0],
			);
	$: if (!getScrolling()) {
		const h = Number.isNaN(scrollY)
			? getHashFromUrl() ?? hashes.get()[0]
			: getHashFromScroll(scrollY + 1);

		if (h)
			(async () => {
				effect = false;
				if (h !== hash.get()) hash.set(h);
				await tick();
				effect = true;
			})();
	}

	const getEffect = () => effect;
	const getScrollY = () => scrollY;
	let tween: Tween | undefined;
	$: if (browser && getEffect() && $hash !== hashPlaceholder) {
		const { id, top, offset } = $hash;

		void goto(`#${id}`, { noScroll: true });

		tween?.stop();
		tween = new Tween(getScrollY(), top + offset, 1000, bezierQuintInOut);
		(async () => {
			scrolling = true;
			await tween.play();
			scrolling = false;
		})();
	}
	$: if (tween) scrollTo(0, $tween!);
</script>

<svelte:window bind:scrollY />
<div class="hasher">
	<div class="spacer" />
	<div class="content">
		{#if $hashes.length > 0}
			<!-- <Dropdown
		width="max(100%, 200px)"
		name="hash"
		bind:selectedItemId={$selected.id}
		items={hashItems}
		heightMaxItems={$inner.height || 999}
		inputProps={{
			colourBackground: '----colour-background-primary',
			placeholder: $strings.common.loading,
		}}
	/> -->
			{#if expanded}
				<div
					class="overlay"
					role="presentation"
					on:click={() => {
						expanded = false;
					}}
				/>
			{/if}
			<div class="expander">
				<Button
					{...ButtonVariants.Transparent}
					width="min(100%, max-content)"
					on:click={() => (expanded = !expanded)}
					on:keydown={(e) => e.key === 'Escape' && (expanded = false)}
				>
					<div slot="left" />
					<div class="content">
						<h3>
							{#key $hashes}
								{$hash.name}
							{/key}
						</h3>
						<div class="spacer" />
					</div>
					<svelte:fragment slot="right">
						<Svg
							svg={expanded ? ic_expand_less : ic_expand_more}
							colour="----colour-accent-primary"
						/>
					</svelte:fragment>
				</Button>
			</div>
			<div class="expanded">
				{#each $hashes.sort( (a, b) => (a.top + a.offset > b.top + b.offset ? 1 : -1), ) as h, i}
					{#if expanded}
						<div
							class="hash"
							in:dropIn={{ delay: i * 100 }}
							out:dropOut={{
								delay: ($hashes.length - 1 - i) * 50,
								duration: 70,
							}}
						>
							<Button
								width="100%"
								{...$hash === h
									? ButtonVariants.Primary
									: ButtonVariants.Secondary}
								{...ButtonVariants.Shadow.Sm}
								on:click={() => {
									$hash = h;
									expanded = false;
								}}
							>
								<div class="text">
									<h3>{h.name}</h3>
								</div>
							</Button>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.hasher {
		max-width: 400px;
		width: min-content;

		display: flex;

		& > .spacer {
			width: 31px;
			flex-shrink: 1;
		}

		& h3 {
			margin: 0;
			font-size: 1rem;
			font-weight: 900;
			letter-spacing: 0;
			text-transform: uppercase;
			text-stroke: unset;
			-webkit-text-stroke: unset;
			color: var(----colour-accent-primary);
		}

		& > .content {
			width: 100%;

			& > .overlay {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			& > .expander {
				width: min-content;

				& .content {
					display: flex;

					& > h3 {
						white-space: nowrap;
						text-shadow:
							0 3.5px 7px var(----colour-background-primary),
							0 7px 14px var(----colour-background-primary);
					}

					& > .spacer {
						width: 7px;
					}
				}
			}

			& > .expanded {
				width: 100%;
				height: 0;
				display: flex;
				flex-direction: column;

				& > .hash {
					background: var(----colour-background-primary);
					flex-grow: 99999;
					flex-shrink: 0;

					& .text {
						width: 100%;
						text-align: left;
						padding: 0 7px;
					}
				}
			}
		}
	}
</style>
