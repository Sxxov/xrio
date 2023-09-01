<script lang="ts">
	import { page } from '$app/stores';

	export let title: string;
	export let description: string;
	export let keywords: string[];
	export let src: string;
</script>

<svelte:head>
	<title>{title}</title>

	<meta
		name="title"
		content={title}
	/>
	<meta
		name="description"
		content={description}
	/>
	<meta
		name="keywords"
		content={keywords.join(',')}
	/>

	<meta
		property="og:type"
		content="website"
	/>
	<meta
		property="og:url"
		content={`${$page.url.hostname}${$page.url.pathname}`}
	/>
	<meta
		property="og:title"
		content={title}
	/>
	<meta
		property="og:description"
		content={description}
	/>
	<meta
		property="og:image"
		content={src}
	/>
</svelte:head>
