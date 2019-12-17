import {
	ArrayBuffers,
	IArrayBufferView
} from './types';
import {
	dataAsDataViewReadonly
} from './util';
import {
	checksumUpdate
} from './checksum';

/**
 * Get data view slice, using same underlying buffer.
 *
 * @param dv Data view.
 * @param offset View offset.
 * @param size View size.
 * @returns Data view.
 */
function dataViewSlice(dv: Readonly<DataView>, offset: number, size: number) {
	return new DataView(
		dv.buffer,
		dv.byteOffset + offset,
		size
	) as Readonly<DataView>;
}

/**
 * Copy data view slice, copying the underlying buffer.
 *
 * @param dv Data view.
 * @param offset Copy offset.
 * @param size Copy size.
 * @returns Data view.
 */
function dataViewCopy(dv: Readonly<DataView>, offset: number, size: number) {
	const start = dv.byteOffset + offset;
	return dv.buffer.slice(start, start + size);
}

/**
 * Concatenate data view list.
 *
 * @param dvs Data views.
 * @param total Total size, optional, otherwise computed from the list.
 * @returns Array buffer.
 */
function dataViewConcat(
	dvs: Readonly<DataView>[],
	total: number | null = null
) {
	// Calculate size if necessary.
	const size = total === null ?
		dvs.reduce((a, b) => a + b.byteLength, 0) :
		total;

	// Write all the data to one array buffer.
	const concat = new ArrayBuffer(size);
	let offset = 0;
	for (const {buffer, byteOffset, byteLength} of dvs) {
		(new Uint8Array(concat, offset, byteLength)).set(
			new Uint8Array(buffer, byteOffset, byteLength),
			0
		);
		offset += byteLength;
	}
	return concat;
}

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
 * Get the secruity offset.
 *
 * @param view Data view.
 * @returns The offset.
 */
function offsetSecurity(view: Readonly<DataView>) {
	const optionalHeader = offsetOptionalHeader(view);
	const magic = view.getUint16(optionalHeader, true);
	let bits = 0;
	switch (magic) {
		case 0x10B: {
			bits = 32;
			break;
		}
		case 0x20B: {
			bits = 64;
			break;
		}
		default: {
			throw new Error(
				`Unknown optional header magic: ${magic.toString(16)}`
			);
		}
	}

	const rvaCountOffset = optionalHeader + (bits === 64 ? 108 : 92);
	const rvaCount = view.getUint32(rvaCountOffset, true);
	if (rvaCount < 5) {
		throw new Error('No PE security field');
	}
	return (rvaCountOffset + 4) + (4 * 8);
}

/**
 * PE signature getter.
 *
 * @param data PE data.
 * @returns Signature data, or null.
 */
export function signatureGet(
	data: Readonly<ArrayBuffers | IArrayBufferView>
) {
	const view = dataAsDataViewReadonly(data);
	const security = offsetSecurity(view);

	const offset = view.getUint32(security, true);
	if (!offset) {
		return null;
	}

	const size = view.getUint32(security + 4, true);
	return dataViewCopy(view, offset, size);
}

/**
 * PE signature setter, removes signature if null.
 *
 * @param data PE data.
 * @param signature Signature data or null to remove.
 * @param updateChecksum Update checksum.
 * @param preserveNullChecksum Preserve a null checksum.
 * @returns Updated PE.
 */
export function signatureSet(
	data: Readonly<ArrayBuffers | IArrayBufferView>,
	signature: Readonly<ArrayBuffers | IArrayBufferView> | null,
	updateChecksum = true,
	preserveNullChecksum = false
) {
	const view = dataAsDataViewReadonly(data);
	const sig = signature ? dataAsDataViewReadonly(signature) : null;

	const security = offsetSecurity(view);

	const offset = view.getUint32(security, true);
	const size = view.getUint32(security + 4, true);
	if (offset) {
		if ((offset + size) !== data.byteLength) {
			throw new Error('Expected signature to be at end of file');
		}
	}

	const end = offset || view.byteLength;
	const result = new DataView(
		sig ?
			dataViewConcat([
				dataViewSlice(view, 0, end), sig
			], end + sig.byteLength) :
			dataViewCopy(view, 0, end)
	);

	result.setUint32(security, sig ? end : 0, true);
	result.setUint32(security + 4, sig ? sig.byteLength : 0, true);

	if (updateChecksum) {
		checksumUpdate(result, preserveNullChecksum);
	}
	return result.buffer;
}
