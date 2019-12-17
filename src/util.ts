import {
	ArrayBuffers,
	IArrayBufferView
} from './types';

/**
 * Convert buffer-like object to DataView.
 *
 * @param data Data view.
 * @returns Data view.
 */
export function dataAsDataViewReadonly(
	data: Readonly<ArrayBuffers | IArrayBufferView>
) {
	let size;
	let offset;
	const bufferView = data as IArrayBufferView;
	let {buffer} = bufferView;
	if (buffer) {
		size = bufferView.byteLength;
		offset = bufferView.byteOffset;
	}
	else {
		buffer = data as ArrayBuffers;
		size = buffer.byteLength;
		offset = 0;
	}
	return (
		new DataView(buffer as ArrayBuffers, offset, size)
	) as Readonly<DataView>;
}

/**
 * Convert buffer-like object to DataView.
 *
 * @param data Data view.
 * @returns Data view.
 */
export function dataAsDataView(
	data: ArrayBuffers | IArrayBufferView
) {
	return dataAsDataViewReadonly(data) as DataView;
}
