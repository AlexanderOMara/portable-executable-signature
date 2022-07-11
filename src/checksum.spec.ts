import {samples, readSample} from './util.spec';
import {
	checksumGet,
	checksumSet,
	checksumCreate,
	checksumUpdate
} from './checksum';

describe('checksum', () => {
	describe('checksumGet', () => {
		for (const sample of samples) {
			// eslint-disable-next-line no-loop-func
			it(sample.file, async () => {
				const data = await readSample(sample.file);

				expect(checksumGet(data)).toBe(sample.checksum);
			});
		}
	});

	describe('checksumCreate', () => {
		for (const sample of samples) {
			// eslint-disable-next-line no-loop-func
			it(sample.file, async () => {
				const data = await readSample(sample.file);

				expect(checksumCreate(data)).toBe(sample.checksumed);
			});
		}
	});

	describe('checksumSet', () => {
		for (const sample of samples) {
			// eslint-disable-next-line no-loop-func
			it(sample.file, async () => {
				const data = await readSample(sample.file);

				checksumSet(data, 0);
				expect(checksumGet(data)).toBe(0);

				checksumSet(data, 42);
				expect(checksumGet(data)).toBe(42);

				checksumSet(data, sample.checksumed);
				expect(checksumGet(data)).toBe(sample.checksumed);
			});
		}
	});

	describe('checksumUpdate', () => {
		for (const sample of samples) {
			// eslint-disable-next-line no-loop-func
			it(sample.file, async () => {
				const data = await readSample(sample.file);

				checksumSet(data, 0);

				checksumUpdate(data, true);
				expect(checksumGet(data)).toBe(0);

				checksumUpdate(data, false);
				expect(checksumGet(data)).toBe(sample.checksumed);
			});
		}
	});
});
