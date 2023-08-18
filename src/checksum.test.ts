import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {samples, readSample} from './util.spec';
import {
	checksumGet,
	checksumSet,
	checksumCreate,
	checksumUpdate
} from './checksum';

void describe('checksum', () => {
	void describe('checksumGet', () => {
		for (const sample of samples) {
			void it(sample.file, async () => {
				const data = await readSample(sample.file);

				strictEqual(checksumGet(data), sample.checksum);
			});
		}
	});

	void describe('checksumCreate', () => {
		for (const sample of samples) {
			void it(sample.file, async () => {
				const data = await readSample(sample.file);

				strictEqual(checksumCreate(data), sample.checksumed);
			});
		}
	});

	void describe('checksumSet', () => {
		for (const sample of samples) {
			void it(sample.file, async () => {
				const data = await readSample(sample.file);

				checksumSet(data, 0);
				strictEqual(checksumGet(data), 0);

				checksumSet(data, 42);
				strictEqual(checksumGet(data), 42);

				checksumSet(data, sample.checksumed);
				strictEqual(checksumGet(data), sample.checksumed);
			});
		}
	});

	void describe('checksumUpdate', () => {
		for (const sample of samples) {
			void it(sample.file, async () => {
				const data = await readSample(sample.file);

				checksumSet(data, 0);

				checksumUpdate(data, true);
				strictEqual(checksumGet(data), 0);

				checksumUpdate(data, false);
				strictEqual(checksumGet(data), sample.checksumed);
			});
		}
	});
});
