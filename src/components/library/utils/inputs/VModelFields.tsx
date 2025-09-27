'use client';
import { useCallback, useState, FC } from 'react';
import {
	InputProps,
	FormControl,
	Stack,
	useColorModeValue,
	Grid,
	Tag,
	Wrap,
	WrapItem,
	TagLabel,
	TagCloseButton,
	Checkbox,
	Box,
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
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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
		if (!value?.includes(tag)) {
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
				props.onChange(event);
			}
		}
	};

	const deleteTag = (tagToDelete: string) => {
		const newArr = value.filter(tag => tag !== tagToDelete);
		if (props.onChange) {
			const event = {
				target: {
					name: props.name,
					value: newArr,
				},
			} as any;
			props.onChange(event);
		}
	};

	const handleDragStart = (e: React.DragEvent, index: number) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e: React.DragEvent, dropIndex: number) => {
		e.preventDefault();

		if (draggedIndex === null || draggedIndex === dropIndex) {
			setDraggedIndex(null);
			return;
		}

		const newArr = [...value];
		const draggedItem = newArr[draggedIndex];

		// Remove the dragged item
		newArr.splice(draggedIndex, 1);
		// Insert it at the new position
		newArr.splice(dropIndex, 0, draggedItem);

		if (props.onChange) {
			const event = {
				target: {
					name: props.name,
					value: newArr,
				},
			} as any;
			props.onChange(event);
		}

		setDraggedIndex(null);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

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
					labelKey='name'
					valueKey='name'
					placeholder='Select Model'
					model='mongoose/list'
					helper='Please Choose the model for fetching fields'
				/>
				<Label>{label}</Label>

				<Wrap
					mb={2}
					gap={1}
					pt={2}>
					{value?.map((item: string, i: number) => (
						<WrapItem key={i}>
							<Box
								draggable
								onDragStart={e => handleDragStart(e, i)}
								onDragOver={handleDragOver}
								onDrop={e => handleDrop(e, i)}
								onDragEnd={handleDragEnd}
								cursor='move'
								opacity={draggedIndex === i ? 0.5 : 1}
								transition='opacity 0.2s'
								_hover={{ transform: 'scale(1.02)' }}>
								<Tag
									variant='subtle'
									userSelect='none'>
									<TagLabel>{item}</TagLabel>
									<TagCloseButton onClick={() => deleteTag(item)} />
								</Tag>
							</Box>
						</WrapItem>
					))}
				</Wrap>
				<Grid
					mb={2}
					templateColumns='1fr 1fr 1fr'
					gap={4}
					w='full'>
					{!isFetching &&
						data?.map((item: string, i: number) => (
							<Checkbox
								key={i}
								isChecked={value?.includes(item)}
								onChange={() => (!value?.includes(item) ? addTag(item) : deleteTag(item))}
								{...titleCheckboxCss}>
								{item}
							</Checkbox>
						))}
				</Grid>
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
