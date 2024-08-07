import {ArrayBuffers, IArrayBufferView} from './types.ts';
import {dataAsDataViewReadonly, dataAsDataView} from './util.ts';

/**
 * Get NT header offset.
 *
 * @param view Data view.
 * @returns The offset.
 */
function offsetNtHeader(view: Readonly<DataView>) {
	return view.getUint32(60, true);
}

/**
 * Get NT header offset.
 *
 * @param view Data view.
 * @returns The offset.
 */
function offsetOptionalHeader(view: Readonly<DataView>) {
	return offsetNtHeader(view) + 24;
}

/**
 * Get the checksum offset.
 *
 * @param view Data view.
 * @returns The offset.
 */
function offsetChecksum(view: Readonly<DataView>) {
	return offsetOptionalHeader(view) + 64;
}

/**
 * Checksum getter.
 *
 * @param data PE data.
 * @returns Checksum value.
 */
export function checksumGet(data: Readonly<ArrayBuffers | IArrayBufferView>) {
	const view = dataAsDataViewReadonly(data);
	return view.getUint32(offsetChecksum(view), true);
}

/**
 * Checksum setter.
 *
 * @param data PE data.
 * @param value Checksum value.
 */
export function checksumSet(
	data: ArrayBuffers | IArrayBufferView,
	value: number
) {
	const view = dataAsDataView(data);
	view.setUint32(offsetChecksum(view), value, true);
}

/**
 * Checksum creater.
 *
 * @param data PE data.
 * @returns Checksum value.
 */
export function checksumCreate(
	data: Readonly<ArrayBuffers | IArrayBufferView>
) {
	const view = dataAsDataViewReadonly(data);
	const offset = offsetChecksum(view);

	let result = 0;
	const limit = 0x100000000;

	/**
	 * Update checksum.
	 *
	 * @param dword Next DWORD.
	 */
	const update = (dword: number) => {
		result += dword;
		if (result >= limit) {
			// eslint-disable-next-line no-bitwise, unicorn/prefer-math-trunc
			result = (result % limit) + ((result / limit) | 0);
		}
	};

	const len = view.byteLength;
	const lenExtra = len % 4;
	const lenAlign = len - lenExtra;
	for (let i = 0; i < lenAlign; i += 4) {
		if (i !== offset) {
			update(view.getUint32(i, true));
		}
	}
	if (lenExtra) {
		let extra = 0;
		for (let i = 0; i < lenExtra; i++) {
			// eslint-disable-next-line no-bitwise
			extra |= view.getUint8(lenAlign + i) << ((3 - i) * 8);
		}
		update(extra);
	}

	// eslint-disable-next-line no-bitwise
	result = (result & 0xffff) + (result >>> 16);

	// eslint-disable-next-line no-bitwise
	result += result >>> 16;

	// eslint-disable-next-line no-bitwise
	return (result & 0xffff) + len;
}

/**
 * Checksum updater.
 *
 * @param data PE data.
 * @param preserveNull Preserve a null checksum.
 */
export function checksumUpdate(
	data: ArrayBuffers | IArrayBufferView,
	preserveNull: boolean
) {
	const view = dataAsDataView(data);
	const value = checksumGet(data);
	if (value || !preserveNull) {
		checksumSet(view, checksumCreate(view));
	}
}
