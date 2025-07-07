import { InputProps, MenuProps, SelectProps, SwitchProps, TextareaProps } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

// Direct imports instead of barrel export
import VInput from '../../../utils/inputs/VInput';
import VSelect from '../../../utils/inputs/VSelect';
import VSwitch from '../../../utils/inputs/VSwitch';
import VImage from '../../../utils/inputs/VImage';
import VTextarea from '../../../utils/inputs/VTextarea';
import VDataSelect from '../../../utils/inputs/VDataSelect';
import VCheckbox from '../../../utils/inputs/VCheckbox';
import ViewOnly from '../../../utils/inputs/ViewOnly';
import VTags from '../../../utils/inputs/VTags';
import VDataTags from '../../../utils/inputs/VDataTags';
import VDataMenu from '../../../utils/inputs/VDataMenu';
import { InputDataType } from '../../../types';
import VImageArray from '../../../utils/inputs/VImageArray';
import VCustomAttributes from '../../../utils/inputs/VCustomAttributes';
import VSection from '../../../utils/inputs/section/VSection';
import VSlug from '../../../utils/inputs/VSlug';
import VPermissions from '../../../utils/inputs/VPermissions';
import VCatCollectionList from '../../../utils/inputs/VCatCollectionList';
import VCustom from '../../../utils/inputs/section/VCustom';
import { useGetByIdQuery } from '../../../store/services/commonApi';
import VArrayString from '../../../utils/inputs/section/VArrayStrint';
import VColor from '../../../utils/inputs/VColor';
import VEditor from '../../../utils/inputs/VEditorr';
import VFont from '../../../utils/inputs/Vfont';
import { fontWeightOptions } from '../../../data/fonts';
import BLineHeight from '../../../utils/inputs/sliders/BLineHeight';
import BOpacity from '../../../utils/inputs/sliders/BOpacity';
import VSlider from '../../../utils/inputs/sliders/BSlider';
import VSectionDataArray from '../../../utils/inputs/section/VSectionDataArray';
import VFontSize from '../../../utils/inputs/VFontSize';
import VAlignment from '../../../utils/inputs/VAlign';
import VFile from '../../../utils/inputs/VFile';
import VVideo from '../../../utils/inputs/VVideo.new';
import VIcon from '../../../utils/inputs/VIcon';

import { flexAlignOptions, flexJustifyOptions, textAlignOptions } from './options';

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
					folder={item?.folder}
					isRequired={isRequired}
					onChange={props.onChange}
					helper={item?.helper}
					style={item?.style}
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
		case 'video':
			return (
				<VVideo
					isRequired={isRequired}
					onChange={props.onChange}
					helper={item?.helper}
					{...props}
				/>
			);

		case 'icon':
			return (
				<VIcon
					isRequired={isRequired}
					onChange={props.onChange}
					helper={item?.helper}
					{...props}
				/>
			);

		case 'image-array':
			return (
				<VImageArray
					folder={item?.folder}
					limit={item?.limit}
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
		case 'alignment':
			return (
				<VAlignment
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);

		case 'flex-justify':
			return (
				<VAlignment
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					options={flexJustifyOptions}
					{...props}
				/>
			);

		case 'flex-align':
			return (
				<VAlignment
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					options={flexAlignOptions}
					{...props}
				/>
			);

		case 'text-align':
			return (
				<VAlignment
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					options={textAlignOptions}
					{...props}
				/>
			);

		case 'nested-select':
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
		case 'font-size':
			return (
				<VFontSize
					options={[10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 32, 36, 40, 48, 64, 96, 128]}
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'font-weight':
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
					{fontWeightOptions?.map((option: any, i: number) => (
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
					item={item}
					menuKey={item?.menuKey}
					menuAddOnKey={item?.menuAddOnKey}
					dataModel={dataModel}
					isRequired={isRequired}
					model={props?.model || ''}
					field={item?.menuField || 'name'}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'nested-data-menu':
			return (
				<VDataMenu
					menuKey={item?.menuKey}
					menuAddOnKey={item?.menuAddOnKey}
					dataModel={dataModel}
					isRequired={isRequired}
					model={props?.model || ''}
					field={item?.menuField || 'name'}
					helper={item?.helper}
					{...props}
				/>
			);

		case 'font':
			return (
				<VFont
					isRequired={isRequired}
					helper={item?.helper}
					onChange={props.onChange}
					{...props}
				/>
			);

		case 'line-height':
			return (
				<BLineHeight
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);

		case 'opacity':
			return (
				<BOpacity
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'slider':
			return (
				<VSlider
					isRequired={isRequired}
					helper={item?.helper}
					values={item?.values}
					threshold={item?.threshold}
					min={item?.min}
					max={item?.max}
					step={item?.step}
					{...props}
				/>
			);

		case 'letterspacing':
			return (
				<VSlider
					isRequired={isRequired}
					helper={item?.helper}
					values={[-3, -2, -1, 0, 1, 2, 3]}
					threshold={100}
					min={-400}
					max={400}
					step={10}
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
					hasImage={item?.hasImage}
					limit={item?.limit}
					section={item?.section}
					{...props}
				/>
			);
		case 'section-data-array':
			return (
				<VSectionDataArray
					onChange={props.onChange}
					isRequired={isRequired}
					name={props.name}
					helper={item?.helper}
					hasImage={item?.hasImage}
					limit={item?.limit}
					section={item?.section}
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
					item={item}
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
		case 'color':
			return (
				<>
					<VColor
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
		case 'basic-editor':
			return (
				<VEditor
					type='basic'
					onChange={props.onChange}
					name={props.name}
					helper={item?.helper}
					isRequired={item?.isRequired}
					{...props}
				/>
			);
		case 'editor':
			return (
				<VEditor
					onChange={props.onChange}
					name={props.name}
					helper={item?.helper}
					isRequired={item?.isRequired}
					{...props}
				/>
			);
		case 'file':
			return (
				<VFile
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
				/>
			);
		case 'date':
			const formattedValue = props.value ? new Date(props.value).toISOString().split('T')[0] : '';
			return (
				<VInput
					type={type}
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
					value={formattedValue}
				/>
			);
		case 'time':
			return (
				<VInput
					type='time'
					isRequired={isRequired}
					helper={item?.helper}
					{...props}
					value={props.value}
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
