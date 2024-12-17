import { InputProps, MenuProps, SelectProps, SwitchProps, TextareaProps } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';

import {
	VInput,
	VSelect,
	VSwitch,
	VImage,
	VTextarea,
	VDataSelect,
	VCheckbox,
	ViewOnly,
	VTags,
	VDataTags,
	VDataMenu,
	InputDataType,
	VImageArray,
	VCustomAttributes,
	VSection,
	VSlug,
	VPermissions,
	VCatCollectionList,
	VCustom,
	useGetByIdQuery,
	VArrayString,
} from '../../../';

type Option = {
	label: string;
	value: string | number | boolean | readonly string[] | undefined;
};

type FormInputProps = InputProps &
	TextareaProps &
	SelectProps &
	SwitchProps & {
		label: string;
		value: any;
		isRequired: boolean;
		type: InputDataType;
		options?: Option[];
		model?: string;
		dataModel?: any;
		item?: any;
		formData?: any;
		setFormData?: any;
		setChangedData?: any;
		helper?: string;
	};

const FormInput: FC<FormInputProps> = ({
	isRequired,
	type = 'text',
	formData,
	setFormData,
	setChangedData,
	options,
	dataModel,
	item,
	helper,
	...props
}) => {
	const {
		path: fetchPath = null,
		id: fetchId = null,
		fields: fetchFields = null,
	} = item?.fetch ? item.fetch(formData) : {};

	const { data, isFetching, isSuccess } = useGetByIdQuery(
		{ path: fetchPath, id: fetchId },
		{ skip: !item?.fetch || !fetchPath || !fetchId }
	);

	useEffect(() => {
		if (isSuccess && !isFetching) {
			let newData: any = {};
			fetchFields.forEach((field: any) => {
				newData[field?.as] = data[field?.key];
			}, data);
			setFormData((prev: any) => ({ ...formData, ...newData }));
		}
	}, [isFetching]);

	switch (type) {
		case 'image':
			return (
				<VImage
					isRequired={isRequired}
					onChange={props.onChange}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'nested-image':
			return (
				<VImage
					isRequired={isRequired}
					onChange={props.onChange}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'image-array':
			return (
				<VImageArray
					isRequired={isRequired}
					onChange={props.onChange}
					helper={item?.helper}
					{...props}
				/>
			);

		case 'select':
			return (
				<VSelect
					isRequired={isRequired}
					helper={item?.helper}
					{...props}>
					<option
						value=''
						disabled
						selected>
						Select option
					</option>
					{options?.map((option: any, i: number) => (
						<option
							key={i}
							value={option?.value}>
							{option?.label}
						</option>
					))}
				</VSelect>
			);
		case 'switch':
			return (
				<VSwitch
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'textarea':
			return (
				<VTextarea
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'nested-textarea':
			return (
				<VTextarea
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'data-select':
			return (
				<VDataSelect
					isRequired={isRequired}
					model={props?.model || ''}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'checkbox':
			return (
				<VCheckbox
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'data-menu':
			return (
				<VDataMenu
					dataModel={dataModel}
					isRequired={isRequired}
					model={props?.model || ''}
					field={item?.menuField || 'name'}
					helper={item?.helper}
					{...props}
				/>
			);

		case 'category-collection-array':
			return (
				<VCatCollectionList
					{...props}
					helper={item?.helper}
				/>
			);

		case 'permissions':
			return (
				<VPermissions
					dataModel={dataModel}
					isRequired={isRequired}
					options={options}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'view-only':
			return (
				<ViewOnly
					helper={item?.helper}
					{...props}
				/>
			);
		case 'tag':
			return (
				<VTags
					type={type}
					helper={item?.helper}
					isRequired={isRequired}
					{...props}
				/>
			);
		case 'custom-attribute':
			return (
				<VCustomAttributes
					type={type}
					helper={item?.helper}
					isRequired={isRequired}
					{...props}
				/>
			);
		case 'custom-section-array':
			return (
				<VSection
					onChange={props.onChange}
					isRequired={isRequired}
					name={props.name}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'array-string':
			return (
				<VArrayString
					onChange={props.onChange}
					isRequired={isRequired}
					name={props.name}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'custom-section':
			return (
				<VCustom
					onChange={props.onChange}
					isRequired={isRequired}
					name={props.name}
					helper={item?.helper}
					dataModel={dataModel}
					{...props}
				/>
			);

		case 'data-tag':
			return (
				<VDataTags
					type={type}
					model={props?.model || ''}
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'slug':
			return (
				<VSlug
					type={type}
					isRequired={isRequired}
					onChange={props.onChange}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'read-only':
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					// isDisabled={true}
					helper={item?.helper}
					isReadOnly={true}
					{...props}
				/>
			);
		case 'password':
			return (
				<VInput
					type='password'
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'string':
			return (
				<>
					<VInput
						type={type}
						isRequired={isRequired}
						helper={item?.helper}
						{...props}
					/>
				</>
			);
		case 'nested-string':
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		default:
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
	}
};

export default FormInput;
