'use client';
import { useCallback, useState, FC } from 'react';
import {
	Input,
	InputProps,
	FormControl,
	Stack,
	useColorModeValue,
	InputGroup,
	InputRightElement,
	IconButton,
	Tag,
	Wrap,
	WrapItem,
	TagLabel,
	TagCloseButton,
	Checkbox,
} from '@chakra-ui/react';

import { Label, Icon, HelperText, VDataSelect, useGetQuery, useGetByIdQuery } from '../..';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string[];
	placeholder?: any;
	lowercase?: boolean;
	section?: boolean;
};

const VModelFields: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	lowercase = true,
	section = false,
	...props
}) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');
	const [tag, setTag] = useState<string>('');

	const [model, setModel] = useState<string>('');

	const { data, isFetching, isError } = useGetByIdQuery({ path: `model/${model}`, id: 'keys' });

	const handleChange = useCallback((e: any) => {
		if (section) {
			setTag(e.target.value);
		} else {
			if (lowercase) {
				const lowerCaseValue = e.target.value.toLowerCase().replace(/\s/g, '-');
				setTag(lowerCaseValue);
			} else {
				const lowerCaseValue = e.target.value.replace(/\s/g, '-');
				setTag(lowerCaseValue);
			}
		}
	}, []);

	const addItem = (item: string, isChecked: boolean) => {
		const currentValue = value || [];

		if (isChecked) {
			if (!currentValue.includes(item)) {
				const newArr = [...currentValue, item];
				if (props.onChange) {
					const event = {
						target: {
							name: props.name,
							value: newArr,
						},
					} as any;
					props.onChange(event); // Call onChange with the synthetic event
				}
			}
		} else {
			const newArr = currentValue.filter((tag: string) => tag !== item);
			if (props.onChange) {
				const event = {
					target: {
						name: props.name,
						value: newArr,
					},
				} as any;
				props.onChange(event); // Call onChange with the synthetic event
			}
		}
	};

	const addTag = (tag: string) => {
		if (tag && tag.length > 0 && !value?.includes(tag)) {
			// const newArr = [...value, tag];
			let newArr = [];
			if (Array.isArray(value)) newArr = [...value, tag];
			else newArr = [tag];

			if (props.onChange) {
				const event = {
					target: {
						name: props.name,
						value: newArr,
					},
				} as any;
				props.onChange(event); // Call onChange with the synthetic event
			}
		}
		setTag('');
	}; // Add props.onChange to the dependency array

	// Handle "select all" checkbox for a permission group
	const handleSelectAllChange = (item: any, isChecked: boolean) => {
		const fieldValues = item.fields.map((field: any) => field.value);
		let updatedPermissions: string[];
		const currentValue = value || [];

		if (isChecked) {
			// Add all field values that aren't already selected
			const newPermissions = fieldValues.filter((val: any) => !currentValue.includes(val));
			updatedPermissions = [...currentValue, ...newPermissions];
		} else {
			// Remove all field values for this group
			updatedPermissions = currentValue.filter(
				(permission: any) => !fieldValues.includes(permission)
			);
		}
		if (props?.onChange) {
			const event = {
				target: {
					name: props.name,
					value: updatedPermissions,
				},
			} as any;

			props.onChange(event);
		}
	};

	const deleteTag = useCallback(
		(tagToDelete: string) => {
			const newArr = value.filter(tag => tag !== tagToDelete);
			if (props.onChange) {
				const event = {
					target: {
						name: props.name,
						value: newArr,
					},
				} as any;
				props.onChange(event); // Call onChange with the synthetic event
			}
		},
		[value, props.onChange]
	); // Add value and props.onChange to the dependency array

	return (
		<FormControl
			isRequired={isRequired}
			gap={4}>
			<Stack
				spacing={2}
				w='full'>
				<VDataSelect
					value={model}
					onChange={(e: any) => setModel(e.target.value)}
					name='model'
					label='Model'
					labelKey='modelName'
					valueKey='modelName'
					placeholder='Select Model'
					model='models'
					helper='Please Choose the model for fetching fields'
				/>
				<Label>{label}</Label>
				{data?.map((item: string, i: number) => (
					<Checkbox
						key={i}
						isChecked={() => value?.includes(item)}
						onChange={e => (value?.includes(item) ? addTag(item) : deleteTag(item))}
						{...titleCheckboxCss}>
						{item}
					</Checkbox>
				))}

				<Stack
					spacing={1}
					w='full'>
					<InputGroup>
						<Input
							value={tag}
							onChange={handleChange}
							px={3}
							borderRadius='lg'
							size='sm'
							focusBorderColor={borderColor}
							color='text.500'
							_dark={{
								color: 'gray.300',
							}}
							placeholder={placeholder ? placeholder : label}
							_placeholder={{ fontSize: 14, fontWeight: '500' }}
						/>
						<InputRightElement
							h='32px'
							p={0}>
							{/* <IconButton
								onClick={addTag}
								size='xs'
								colorScheme='gray'
								aria-label='add tag'
								icon={<Icon name='add' />}
							/> */}
						</InputRightElement>
					</InputGroup>

					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
				<Wrap
					gap={1}
					pt={2}>
					{value?.map((item: string, i: number) => (
						<WrapItem key={i}>
							<Tag variant='subtle'>
								<TagLabel> {item}</TagLabel>
								<TagCloseButton onClick={() => deleteTag(item)} />
							</Tag>
						</WrapItem>
					))}
				</Wrap>
			</Stack>
		</FormControl>
	);
};

const titleCheckboxCss: any = {
	colorScheme: 'brand',
	size: 'md',
	fontSize: '16px',
	fontWeight: '500',
};

export default VModelFields;
