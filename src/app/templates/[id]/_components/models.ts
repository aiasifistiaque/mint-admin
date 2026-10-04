/**
 * The template's saved models, named as the server names them (a step may
 * carry only a title — the validator's whatsInside has the name it gets), with
 * their fields. What the Sidebar, Dashboard, Sample data and Setup guide tabs
 * pick from.
 */

export type TemplateModel = { name: string; title: string; route: string; displayField: string; fields: any[] };

export const templateModels = (doc: any): TemplateModel[] => {
	const named = doc.whatsInside?.models || [];
	const planned = doc.validation?.models || [];
	return (doc.draft?.models?.steps || [])
		.filter((s: any) => s?.action !== 'update')
		.map((s: any, i: number) => {
			const name = named[i]?.name || s.name || '';
			return {
				name,
				title: s.title || named[i]?.title || name,
				route: planned.find((m: any) => m.name === name)?.route || named[i]?.route || '',
				displayField: s.displayField || '',
				fields: Array.isArray(s.fields) ? s.fields : [],
			};
		})
		.filter((m: TemplateModel) => m.name);
};

/** Field kinds a widget can add up, break down by, or date by. */
export const NUMBER_KINDS = ['number', 'formula'];
export const GROUP_KINDS = ['select', 'boolean', 'reference'];
export const DATE_KINDS = ['date'];
