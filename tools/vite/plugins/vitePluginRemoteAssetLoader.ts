import type { Plugin } from 'vite';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const remoteAssetCache = new Map<string, string>();
const remoteAssetCacheOutDirnameRelative = '/static/remote/assets';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const vitePluginRemoteAssetLoader = () =>
	({
		name: 'remote asset loader',

		resolveId(/** @type {string} */ id) {
			if (
				id.startsWith('remote|asset:http:/') ||
				id.startsWith('remote|asset:https:/')
			)
				return `\0${id}`;
		},
		async load(/** @type {string} */ id) {
			if (
				!(
					id.startsWith('\0remote|asset:http:/') ||
					id.startsWith('\0remote|asset:https:/')
				)
			)
				return null;

			const outDirnameRelative = remoteAssetCacheOutDirnameRelative;
			const outDirnameAbsolute = path.join(
				'../',
				dirname,
				outDirnameRelative,
			);
			const outFilename = id
				.replace(/^.*http(s)?:\/(\/)?/, '')
				.replace(/[^\w.]+/g, '_');
			const outPath = path.join(outDirnameAbsolute, outFilename);
			let diskPath = remoteAssetCache.get(id);

			// load from disk
			if (diskPath)
				if (
					await fs
						.access(diskPath, fs.constants.F_OK)
						.then(() => true)
						.catch(() => false)
				) {
					diskPath = outPath;

					remoteAssetCache.set(id, diskPath);
				}

			// load from net
			if (!diskPath) {
				const resp = await fetch(
					id.replace(/^.*remote\|asset:http(s)?:\/\/?/, 'http$1://'),
				);
				const ab = await resp.arrayBuffer();

				diskPath = outPath;

				await fs.mkdir(outDirnameAbsolute, {
					recursive: true,
				});
				await fs.writeFile(diskPath, Buffer.from(ab));

				remoteAssetCache.set(id, diskPath);
			}

			return {
				code: `export default \`${path.posix.join(
					outDirnameRelative,
					outFilename,
				)}\``,
			};
		},
		async buildEnd() {
			const outDirnameRelative = remoteAssetCacheOutDirnameRelative;
			const outDirnameAbsolute = path.join(dirname, outDirnameRelative);

			const cacheValues = [...remoteAssetCache.values()];

			if (cacheValues.length <= 0) return;

			const filenames = await fs.readdir(outDirnameAbsolute);
			const cacheFilenames = cacheValues.map((p) => path.basename(p));

			for (const filename of filenames) {
				const diskPath = path.join(outDirnameAbsolute, filename);

				if (cacheFilenames.includes(filename)) continue;

				await fs.rm(diskPath);
			}
		},
	}) satisfies Plugin;
