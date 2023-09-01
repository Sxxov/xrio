import 'dotenv/config';

import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import resolve from '@rollup/plugin-node-resolve';
import { imagetools } from 'vite-imagetools';
import maicHelper from 'maic/helper';
import { isoImport } from 'vite-plugin-iso-import';
import inspect from 'vite-plugin-inspect';
import { vitePluginRemoteModuleLoader } from './tools/vite/plugins/vitePluginRemoteModuleLoader';
import { vitePluginRemoteAssetLoader } from './tools/vite/plugins/vitePluginRemoteAssetLoader';
import { vitePluginFileDirPathConstants } from './tools/vite/plugins/vitePluginFileDirPathConstants';
import { vitePluginIntegratedWsServer } from './tools/vite/plugins/vitePluginIntegratedWsServer';

const production = process.env['NODE_ENV'] === 'production';

export default {
	assetsInclude: ['**/*.glb', '**/*.gltf'],
	ssr: {
		noExternal: ['postprocessing', 'three', 'three/examples/jsm/**/*'],
	},
	plugins: [
		maicHelper({
			enabled: !production,
		}),
		vitePluginRemoteModuleLoader(),
		vitePluginRemoteAssetLoader(),
		vitePluginFileDirPathConstants(),
		vitePluginIntegratedWsServer(),
		imagetools(),
		isoImport(),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		sveltekit(),
		basicSsl(),
		inspect({
			build: true,
			outputDir: '.vite-inspect',
		}),
	],
	resolve: {
		alias: [
			{
				// default all image imports to be converted to webp
				find: /(\.(png|jpg|jpeg|gif))$/,
				replacement: production ? '$1?webp' : '$1',
			},
		],
	},
};
