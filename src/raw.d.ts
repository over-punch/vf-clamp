// src/raw.d.ts — lets TypeScript import a file's text with Vite's ?raw suffix (the shared Python naming module).
declare module '*?raw' {
	/** The file's contents as a string. */
	const content: string
	export default content
}
