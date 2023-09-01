<script lang="ts">
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import ic_logo from '../../assets/brand/logo.svg?raw';
	import { css, type TCss } from '@sxxov/ut/css';

	export let width: TCss = 35;
	export let height: TCss = 35;
	export let padding: TCss = '10.5px';
	export let colour: TCss = 'var(----colour-text-primary)';
</script>

<div class="logo">
	<a href="/">
		<Button
			{...ButtonVariants.Fab.Md}
			{...ButtonVariants.Transparent}
			{...ButtonVariants.Shadow.Sm}
			width="max(56px, 100%)"
			height="max(56px, 100%)"
			colourBackground="var(----colour-background-primary)"
			{padding}
		>
			<Svg
				height={css(height)}
				width={css(width)}
				svg={ic_logo}
				firm
				{colour}
			/>
		</Button>
	</a>
</div>

<style lang="postcss">
</style>
