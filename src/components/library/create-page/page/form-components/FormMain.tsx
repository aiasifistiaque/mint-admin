import React, { FC } from 'react';
import {
	FormDivision,
	FormItem,
	FormInput,
	getFieldValue,
	handleChange,
	handleImage,
	handleSwitch,
	handleImageArray,
} from '../../../';

type FormMainType = {
	fields: any;
	formData: any;
	setFormData: any;
	setChangedData: any;
	isModal?: boolean;
};

const FormMain: FC<FormMainType> = ({
	fields,
	formData,
	setFormData,
	setChangedData,
	isModal = false,
}) => {
	const sections = React.useMemo(() => {
		let section: any[] = [];
		let sections: any[][] = [];

		fields.forEach((field: any, i: number) => {
			section.push(field);
			if (field.endOfSection || i === fields.length - 1) {
				sections.push(section);
				section = [];
			}
		});

		return sections;
	}, [fields]);

	const getOnChangeHandler = (type: string, key?: string) => {
		const params = { formData, setFormData, setChangedData };

		switch (type) {
			case 'image':
				return (e: any) => handleImage({ e, dataKey: key || 'image', ...params });
			case 'switch':
			case 'image-array':
				return (e: any, type?: string) =>
					handleImageArray({ e, dataKey: key || 'image', type, ...params });
			case 'checkbox':
				return (e: any) => handleSwitch({ e, ...params });
			default:
				return (e: any) => handleChange({ e, ...params });
		}
	};

	return sections.map((section: any, i: number) => (
		<FormDivision
			key={i}
			isModal={isModal}>
			{section?.map((item: any, i: number) => (
				<FormItem
					item={item}
					key={i}>
					{(!item?.renderCondition || item?.renderCondition(formData)) && (
						<FormInput
							isRequired={item?.isRequired || false}
							name={item?.name}
							label={item?.label}
							type={item?.type}
							value={getFieldValue({ name: item?.name, formData })}
							onChange={getOnChangeHandler(item?.type, item?.name)}
							model={item?.model}
							placeholder={item?.placeholder}
							options={item?.options}
							dataModel={item?.dataModel}
						/>
					)}
				</FormItem>
			))}
		</FormDivision>
	));
};

export default FormMain;