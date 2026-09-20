import type { FieldTypeDescriptor, FieldTypeId } from './types';

// WO-09: the registry itself. Empty until WO-10 populates one descriptor per
// entry in inputDataOptions — importing this file must never throw and must
// never assume a given id has a descriptor yet (see getFieldTypeDescriptor).
const descriptors = new Map<FieldTypeId, FieldTypeDescriptor>();

/**
 * Register a descriptor. Called once per type from fields/registry/descriptors/*.ts
 * (WO-10). Throws on a duplicate id — that's always a bug, never intentional.
 */
export const registerFieldType = (descriptor: FieldTypeDescriptor): void => {
	if (descriptors.has(descriptor.id)) {
		throw new Error(`[fieldTypeRegistry] duplicate descriptor registered for type "${descriptor.id}"`);
	}
	descriptors.set(descriptor.id, descriptor);
};

export const getFieldTypeDescriptor = (id: FieldTypeId | string): FieldTypeDescriptor | undefined => {
	return descriptors.get(id as FieldTypeId);
};

export const getAllFieldTypeDescriptors = (): FieldTypeDescriptor[] => {
	return Array.from(descriptors.values());
};

export const hasFieldTypeDescriptor = (id: FieldTypeId | string): boolean => {
	return descriptors.has(id as FieldTypeId);
};
