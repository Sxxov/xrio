/** Remote asset, downloaded at build time */
declare module 'remote|asset:http://*' {
	const src: string;
	export default src;
}

/** Remote asset, downloaded at build time */
declare module 'remote|asset:https://*' {
	const src: string;
	export default src;
}
