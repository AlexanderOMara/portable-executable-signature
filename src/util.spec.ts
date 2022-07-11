import {readFile} from 'fs';
import {promisify} from 'util';

const readFileP = promisify(readFile);

export const samples = [
	{
		file: 'firefox_1.0pr_win32_notsigned_checksum.exe',
		signed: false,
		checksum: 0x65da4e,
		checksumed: 0x65da4e,
		signatureSha256: '',
		signedNoneSha256:
			'eef032773058dd1cff0089369f285af9e68bb6c9e9b1629664372caf67081250',
		signedDummySha256:
			'833ebd223f7b383f11e3cf2195f5d115178c6b9b57347917373717909eb5cf06'
	},
	{
		file: 'firefox_1.0pr_win32_notsigned.exe',
		signed: false,
		checksum: 0,
		checksumed: 0x65da4e,
		signatureSha256: '',
		signedNoneSha256:
			'eef032773058dd1cff0089369f285af9e68bb6c9e9b1629664372caf67081250',
		signedDummySha256:
			'833ebd223f7b383f11e3cf2195f5d115178c6b9b57347917373717909eb5cf06'
	},
	{
		file: 'firefox_2.0_win32_notsigned_checksum.exe',
		signed: false,
		checksum: 0x5e81f,
		checksumed: 0x5e81f,
		signatureSha256: '',
		signedNoneSha256:
			'cbeeb24662b3013b67b413d2b5bc733c58e1fb57ff0cc09bf30235d7743c93d2',
		signedDummySha256:
			'057dd558399e4689dc88e9251a0b17246cf42c5f1ca1ee18e2cb299e48a177d3'
	},
	{
		file: 'firefox_2.0_win32_notsigned.exe',
		signed: false,
		checksum: 0,
		checksumed: 0x5e81f,
		signatureSha256: '',
		signedNoneSha256:
			'cbeeb24662b3013b67b413d2b5bc733c58e1fb57ff0cc09bf30235d7743c93d2',
		signedDummySha256:
			'057dd558399e4689dc88e9251a0b17246cf42c5f1ca1ee18e2cb299e48a177d3'
	},
	{
		file: 'firefox_68.0esr_win32_signed.exe',
		signed: true,
		checksum: 0x83c31,
		checksumed: 0x83c31,
		signatureSha256:
			'1247d51f68afb31954da1cc7301ea224883a0f0a922a40c58d65036a1082c948',
		signedNoneSha256:
			'77251c9e8f81ce78642feebf89adab1b72f59e448469bd6b900f223bb8dd1861',
		signedDummySha256:
			'db4180b3cd0f1aa198127dd01965ead5565b2c9f5029de1c4d1d217a6d1b4c0c'
	},
	{
		file: 'firefox_68.0esr_win32_unsigned.exe',
		signed: false,
		checksum: 0x7cd82,
		checksumed: 0x7cd82,
		signatureSha256: '',
		signedNoneSha256:
			'77251c9e8f81ce78642feebf89adab1b72f59e448469bd6b900f223bb8dd1861',
		signedDummySha256:
			'db4180b3cd0f1aa198127dd01965ead5565b2c9f5029de1c4d1d217a6d1b4c0c'
	},
	{
		file: 'firefox_68.0esr_win64_signed.exe',
		signed: true,
		checksum: 0x9aee7,
		checksumed: 0x9aee7,
		signatureSha256:
			'89b6f5db43c97146a5bb2eb836c1bdc5725ff9d593a45b918282dbb6b08e7792',
		signedNoneSha256:
			'19e415f408bfaf7fdd907aecc8720652a333ef8eb5c74b7556822d1c6d9644d1',
		signedDummySha256:
			'4f368ac27b2036bedce3fa0f6cfe7d1642873ed04348a0923cb3fa6e92cc197c'
	},
	{
		file: 'firefox_68.0esr_win64_unsigned.exe',
		signed: false,
		checksum: 0x97e72,
		checksumed: 0x97e72,
		signatureSha256: '',
		signedNoneSha256:
			'19e415f408bfaf7fdd907aecc8720652a333ef8eb5c74b7556822d1c6d9644d1',
		signedDummySha256:
			'4f368ac27b2036bedce3fa0f6cfe7d1642873ed04348a0923cb3fa6e92cc197c'
	}
];

export async function readSample(file: string) {
	return readFileP(`spec/fixtures/pe/${file}`);
}
