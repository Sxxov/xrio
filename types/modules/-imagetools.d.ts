/**
 * Image that is being piped through to `vite-imagetools`
 *
 * @see https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md
 */
declare module '*&imagetools' {
	const src: string;
	export default src;
}
