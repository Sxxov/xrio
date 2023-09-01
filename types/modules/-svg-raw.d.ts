declare module '*.svg?raw' {
	declare const content: `<svg${string}`;
	export default content;
}
