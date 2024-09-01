import { InputProps, MenuProps, SelectProps, SwitchProps, TextareaProps } from '@chakra-ui/react';
import React, { FC } from 'react';

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
	};

const FormInput: FC<FormInputProps> = ({
	isRequired,
	type = 'text',
	options,
	dataModel,
	...props
}) => {
	switch (type) {
		case 'image':
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
		case 'textarea' || 'nested-textarea':
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
					isDisabled={true}
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
