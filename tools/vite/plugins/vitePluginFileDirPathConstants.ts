import type { Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const vitePluginFileDirPathConstants = () =>
	({
		name: 'file/dir path constants',
		transform(code, id) {
			const result = code
				.replace(/__filename/g, `'${id}'`)
				.replace(/__dirname/g, `'${path.dirname(id)}'`)
				.replace(
					/__rootname/g,
					`'${path.join('../', dirname.replace(/\\/g, '\\\\'))}'`,
				);

			if (code !== result) return { code: result };
		},
	}) satisfies Plugin;
