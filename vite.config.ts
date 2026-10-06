// vite.config.ts — library-mode build for ESM + CJS + types
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		dts({ include: ['src'], exclude: ['src/__tests__/**'], rollupTypes: true }),
	],
	build: {
		lib: {
			// index: the full package (Node, Pyodide). naming: pure helpers that are safe to bundle for browsers.
			entry: { index: 'src/index.ts', naming: 'src/naming.ts' },
			formats: ['es', 'cjs'],
			fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: ['@web-alchemy/fonttools', /^node:/],
		},
	},
})
