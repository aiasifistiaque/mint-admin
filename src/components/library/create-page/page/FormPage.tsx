'use client';

import React, { FC, useState } from 'react';

import {
	FormDivision,
	FormItem,
	FormInput,
	useCustomToast,
	useRedirect,
	FormSection,
	CreateNav,
	CreateBody,
	handleChange,
	handleImage,
	handleSwitch,
	getFieldValue,
} from '../../';

type FormPageType = {
	formData: any;
	setFormData: any;
	trigger: any;
	result: any;
	path: string;
	data: any[];
	title: string;
	type?: 'add' | 'update';
	id?: string;
	useCommonApi?: boolean;
};

const FormPage: FC<FormPageType> = ({
	formData,
	setFormData,
	trigger,
	result,
	path,
	data,
	title,
	type,
	id,
	useCommonApi,
}) => {
	const { isSuccess, isLoading, isError, error } = result;
	const [changedData, setChangedData] = useState({});

	const sections = React.useMemo(() => {
		let section: any[] = [];
		let sections: any[][] = [];

		data.forEach((field: any, i: number) => {
			section.push(field);

			if (field.endOfSection || i === data.length - 1) {
				sections.push(section);
				section = [];
			}
		});

		return sections;
	}, [data]);

	useRedirect({ isSuccess, isLoading, path: `/${path}` });
	useCustomToast({
		successText: type == 'update' ? 'Information Updated Successfully' : 'Item added successfully',
		isSuccess,
		isError,
		isLoading: isLoading,
		error: error,
	});

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (type === 'update') {
			trigger({ path, id, body: changedData });
			return;
		} else {
			if (useCommonApi) {
				trigger({ path, body: formData });
			} else {
				trigger(formData);
			}
		}
	};

	const getOnChangeHandler = (type: string, key?: string) => {
		const params = { formData, setFormData, setChangedData };

		switch (type) {
			case 'image':
				return (e: any) => handleImage({ e, dataKey: key || 'image', ...params });
			case 'switch':
			case 'checkbox':
				return (e: any) => handleSwitch({ e, ...params });
			default:
				return (e: any) => handleChange({ e, ...params });
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<CreateNav
				isLoading={isLoading}
				title={`${title}`}
				path={path}
			/>
			<CreateBody>
				<FormSection>
					{sections.map((section: any, i: number) => (
						<FormDivision key={i}>
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
					))}
				</FormSection>
			</CreateBody>
		</form>
	);
};

export default FormPage;
