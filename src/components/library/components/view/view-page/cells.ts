/** A related record's cell as text: a populated reference shows its name, not an id. */
export const cellText = (value: any): string => {
	if (value === null || value === undefined || value === '') return '—';
	if (Array.isArray(value)) return value.map(cellText).join(', ');
	if (typeof value === 'object') return value.name || value.title || value.code || value._id || '—';
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (typeof value === 'number') return value.toLocaleString();
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleDateString();
	return String(value);
};
