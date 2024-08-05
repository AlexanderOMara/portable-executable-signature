import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';
import {createHash} from 'node:crypto';

import {samples, readSample} from './util.spec.ts';
import {signatureGet, signatureSet} from './signature.ts';

function sha256(data: Buffer) {
	return createHash('sha256').update(data).digest('hex');
}

void describe('signature', () => {
	void describe('signatureGet', () => {
		for (const sample of samples) {
			void it(sample.file, async () => {
				const data = await readSample(sample.file);
				const read = signatureGet(data);

				if (sample.signed) {
					if (!read) {
						throw new Error('Internal error');
					}
					strictEqual(
						sha256(Buffer.from(read)),
						sample.signatureSha256
					);
				} else {
					strictEqual(read, null);
				}
			});
		}
	});

	void describe('signatureSet', () => {
		for (const sample of samples) {
			void it(sample.file, async () => {
				const data = await readSample(sample.file);

				const wroteDummy = signatureSet(
					data,
					Buffer.from('dummy signature')
				);
				strictEqual(
					sha256(Buffer.from(wroteDummy)),
					sample.signedDummySha256
				);

				const wroteNone = signatureSet(data, null);
				strictEqual(
					sha256(Buffer.from(wroteNone)),
					sample.signedNoneSha256
				);
			});
		}
	});
});
