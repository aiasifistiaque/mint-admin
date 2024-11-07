'use client';
import React, { useCallback, useState } from 'react';
import {
	InputProps,
	FormControl,
	Stack,
	IconButton,
	Tag,
	Wrap,
	WrapItem,
	TagLabel,
	TagCloseButton,
	Flex,
} from '@chakra-ui/react';
import { Label, Icon, HelperText, Column } from '../../';
import { Input } from './';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string[];
	placeholder?: any;
};

const VCustomAttributes: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	const [tag, setTag] = useState<{ label: string; value: string }>({
		label: '',
		value: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTag(prevTag => ({ ...prevTag, [name]: value }));
	};

	const addTag = () => {
		if (!tag.label || !tag.value) return;
		const newArr = [...(Array.isArray(value) ? value : []), tag];
		if (props.onChange) {
			const event = {
				target: {
					name: props.name,
					value: newArr,
				},
			} as any;
			props.onChange(event); // Call onChange with the synthetic event
		}

		setTag({ label: '', value: '' });
	}; // Add props.onChange to the dependency array

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
				<Label>{label}</Label>

				<Stack
					spacing={1}
					w='full'>
					<Flex gap={2}>
						<Input
							name='label'
							value={tag?.label}
							onChange={handleChange}
							placeholder='Attribute Title'
						/>
						<Input
							name='value'
							value={tag?.value}
							onChange={handleChange}
							placeholder='Attribute Value'
						/>

						<IconButton
							onClick={addTag}
							size='sm'
							colorScheme='gray'
							aria-label='add tag'
							icon={<Icon name='add' />}
						/>
					</Flex>

					{helper && <HelperText>{helper}</HelperText>}
				</Stack>

				<Wrap
					gap={2}
					pt={2}>
					{value?.map((item: any, i: number) => (
						<WrapItem key={i}>
							<Tag
								size='lg'
								colorScheme='gray'
								borderRadius='md'>
								<TagLabel>
									{item?.label}: {item?.value}
								</TagLabel>
								<TagCloseButton onClick={() => deleteTag(item)} />
							</Tag>
						</WrapItem>
					))}
				</Wrap>
			</Stack>
		</FormControl>
	);
};

export default VCustomAttributes;
