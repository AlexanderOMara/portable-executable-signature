import {
	createHash
} from 'crypto';

import {
	samples,
	readSample
} from './util.spec';
import {
	signatureGet,
	signatureSet
} from './signature';

function sha256(data: Buffer) {
	return createHash('sha256')
		.update(data)
		.digest('hex');
}

describe('signature', () => {
	describe('signatureGet', () => {
		for (const sample of samples) {
			it(sample.file, async () => {
				const data = await readSample(sample.file);
				const read = signatureGet(data);

				if (sample.signed) {
					if (!read) {
						throw new Error('Internal error');
					}
					expect(sha256(Buffer.from(read))).toBe(
						sample.signatureSha256
					);
				}
				else {
					expect(read).toBeNull();
				}
			});
		}
	});

	describe('signatureSet', () => {
		for (const sample of samples) {
			it(sample.file, async () => {
				const data = await readSample(sample.file);

				const wroteDummy = signatureSet(
					data,
					Buffer.from('dummy signature')
				);
				expect(sha256(Buffer.from(wroteDummy))).toBe(
					sample.signedDummySha256
				);

				const wroteNone = signatureSet(data, null);
				expect(sha256(Buffer.from(wroteNone))).toBe(
					sample.signedNoneSha256
				);
			});
		}
	});
});
