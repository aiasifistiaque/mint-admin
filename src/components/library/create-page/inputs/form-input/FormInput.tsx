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
					{...props}
				/>
			);
		case 'nested-image':
			return (
				<VImage
					isRequired={isRequired}
					onChange={props.onChange}
					{...props}
				/>
			);
		case 'image-array':
			return (
				<VImageArray
					isRequired={isRequired}
					onChange={props.onChange}
					{...props}
				/>
			);

		case 'select':
			return (
				<VSelect
					isRequired={isRequired}
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
					{...props}
				/>
			);
		case 'textarea':
			return (
				<VTextarea
					isRequired={isRequired}
					{...props}
				/>
			);
		case 'nested-textarea':
			return (
				<VTextarea
					isRequired={isRequired}
					{...props}
				/>
			);
		case 'data-select':
			return (
				<VDataSelect
					isRequired={isRequired}
					model={props?.model || ''}
					{...props}
				/>
			);
		case 'checkbox':
			return (
				<VCheckbox
					isRequired={isRequired}
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
					{...props}
				/>
			);

		case 'category-collection-array':
			return <VCatCollectionList {...props} />;

		case 'permissions':
			return (
				<VPermissions
					dataModel={dataModel}
					isRequired={isRequired}
					options={options}
					{...props}
				/>
			);
		case 'view-only':
			return <ViewOnly {...props} />;
		case 'tag':
			return (
				<VTags
					type={type}
					isRequired={isRequired}
					{...props}
				/>
			);
		case 'custom-attribute':
			return (
				<VCustomAttributes
					type={type}
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
					{...props}
				/>
			);
		case 'custom-section':
			return (
				<VCustom
					onChange={props.onChange}
					isRequired={isRequired}
					name={props.name}
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
					{...props}
				/>
			);
		case 'slug':
			return (
				<VSlug
					type={type}
					isRequired={isRequired}
					onChange={props.onChange}
					{...props}
				/>
			);
		case 'read-only':
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					// isDisabled={true}
					isReadOnly={true}
					{...props}
				/>
			);
		case 'password':
			return (
				<VInput
					type='password'
					isRequired={isRequired}
					{...props}
				/>
			);
		case 'string':
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					isDisabled={true}
					{...props}
				/>
			);
		case 'nested-string':
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					{...props}
				/>
			);
		default:
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					{...props}
				/>
			);
	}
};

export default FormInput;
