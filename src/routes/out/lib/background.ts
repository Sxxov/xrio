import { browser } from '$app/environment';
import { Store } from '@sxxov/ut/store';

export const backgroundIndexedDbInfo = {
	name: 'background',
	version: 1,

	objectStoreName: 'images',
	objectStoreKeyPathName: 'id',
	objectStoreIndexName: 'cache',
	objectStoreRowName: 'cache',
} as const;

const {
	name,
	version,
	objectStoreName,
	objectStoreKeyPathName,
	objectStoreIndexName,
	objectStoreRowName,
} = backgroundIndexedDbInfo;

const getDb = async () =>
	new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(name, version);

		request.addEventListener('upgradeneeded', () => {
			const { result: db } = request;

			const objectStore = db.createObjectStore(objectStoreName, {
				keyPath: objectStoreKeyPathName,
				autoIncrement: true,
			});

			objectStore.createIndex(
				objectStoreIndexName,
				objectStoreIndexName,
				{ unique: false },
			);
		});

		request.addEventListener('success', () => {
			const { result: db } = request;

			resolve(db);
		});

		request.addEventListener('error', () => {
			const { error } = request;

			reject(error);
		});
	});

const getCache = async (db: IDBDatabase) => {
	return new Promise<string | undefined>((resolve, reject) => {
		const transaction = db.transaction([objectStoreName], 'readonly');
		const objectStore = transaction.objectStore(objectStoreName);

		// Assuming you want to retrieve the latest added image
		const request = objectStore.openCursor(null, 'prev');

		request.addEventListener('success', () => {
			const { result: cursor } = request;

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			resolve(cursor?.value.data);
		});

		request.addEventListener('error', () => {
			const { error } = request;

			reject(error);
		});
	});
};

const setCache = async (db: IDBDatabase, data: string | undefined) => {
	return new Promise<void>((resolve, reject) => {
		const transaction = db.transaction([objectStoreName], 'readwrite');
		const objectStore = transaction.objectStore(objectStoreName);
		const request = data
			? objectStore.put({ name: objectStoreRowName, data })
			: objectStore.clear();

		request.addEventListener('success', () => {
			resolve();
		});

		request.addEventListener('error', () => {
			const { error } = request;

			reject(error);
		});
	});
};

export const background = new Store<string | undefined>(undefined);

if (browser)
	(async () => {
		const db = await getDb();
		const cache = await getCache(db);

		if (cache) background.set(cache);

		background.subscribeLazy(async (data) => {
			await setCache(db, data);
		});
	})();
