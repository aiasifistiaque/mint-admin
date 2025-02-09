type CreateType = {
	schema: any;
	layout: { sectionTitle: string; fields: any[]; description?: string }[];
	type?: 'post' | 'update';
};

const createType = ({ type, isReadOnly, fieldType }: any) => {
	if (type == 'update' && isReadOnly) {
		return 'read-only';
	}
	return fieldType;
};

const createFormFields = ({ schema, layout, type = 'post' }: CreateType): any[] => {
	const dataFields: any[] = [];

	layout.forEach((section: any) => {
		const { sectionTitle, fields, description } = section;

		fields.forEach((field: any, index: number) => {
			const lastElement = index === fields.length - 1;
			const firstIndex = index === 0;

			if (Array.isArray(field)) {
				field.forEach((subField: any, subIndex: number) => {
					const fieldConfig = schema[subField];
					const lastSubIndex = subIndex === field.length - 1;
					const firstSubIndex = subIndex === 0;
					const typeDetail = createType({
						type: type,
						isReadOnly: fieldConfig?.readOnlyOnUpdate || false,
						fieldType: fieldConfig?.type,
					});
					if (fieldConfig) {
						dataFields.push({
							...(firstIndex && firstSubIndex && { sectionTitle, description }),
							name: subField,
							label: fieldConfig.label || fieldConfig.title,
							isRequired: fieldConfig.isRequired || fieldConfig.required || false,
							type: typeDetail,
							...(fieldConfig.limit && { limit: fieldConfig.limit }),
							...(fieldConfig.section && { section: fieldConfig.section }),
							...(fieldConfig.placeholder && { placeholder: fieldConfig.placeholder }),
							...(fieldConfig?.helperText && { helper: fieldConfig.helperText }),
							...(fieldConfig.options && { options: fieldConfig.options }),
							...(fieldConfig.model && { model: fieldConfig.model }),
							...(fieldConfig.dataModel && { dataModel: fieldConfig.model }),
							...(fieldConfig.options && { dataModel: fieldConfig.options }),
							span: 1,
							endOfSection: lastElement && lastSubIndex,
							...(fieldConfig?.renderCondition && { renderCondition: fieldConfig.renderCondition }),
							...(fieldConfig?.value && { value: fieldConfig.value }),
							...(fieldConfig?.fetch && { fetch: fieldConfig.fetch }),
							...(fieldConfig?.isExcluded && { isExcluded: fieldConfig.isExcluded }),
							...(fieldConfig?.getValue && { getValue: fieldConfig.getValue }),
						});
					}
				});
			} else {
				const fieldConfig = schema[field];
				const typeDetail = createType({
					type: type,
					isReadOnly: fieldConfig?.readOnlyOnUpdate || false,
					fieldType: fieldConfig?.type,
				});
				if (fieldConfig) {
					dataFields.push({
						...(firstIndex && { sectionTitle, description }),
						name: field,
						label: fieldConfig.label || fieldConfig.title,
						isRequired: fieldConfig.isRequired || fieldConfig.required || false,
						type: typeDetail,
						...(fieldConfig.placeholder && { placeholder: fieldConfig.placeholder }),
						...(fieldConfig.options && { options: fieldConfig.options }),
						...(fieldConfig.model && { model: fieldConfig.model }),
						...(fieldConfig.dataModel && { dataModel: fieldConfig.dataModel }),
						...(fieldConfig.options && { dataModel: fieldConfig.options }),
						...(fieldConfig?.helperText && { helper: fieldConfig.helperText }),
						...(fieldConfig?.renderCondition && { renderCondition: fieldConfig.renderCondition }),
						...(fieldConfig?.value && { value: fieldConfig.value }),
						...(fieldConfig?.fetch && { fetch: fieldConfig.fetch }),
						...(fieldConfig?.isExcluded && { isExcluded: fieldConfig.isExcluded }),
						...(fieldConfig?.getValue && { getValue: fieldConfig.getValue }),
						...(fieldConfig.limit && { limit: fieldConfig.limit }),
						...(fieldConfig.section && { section: fieldConfig.section }),
						endOfSection: lastElement,
					});
				}
			}
		});
	});

	return dataFields;
};

export default createFormFields;
