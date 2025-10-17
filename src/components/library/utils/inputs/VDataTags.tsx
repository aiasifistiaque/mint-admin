'use client';
import React, { useCallback, useState } from 'react';
import {
	InputProps,
	FormControl,
	Stack,
	useColorModeValue,
	IconButton,
	Tag,
	Wrap,
	WrapItem,
	TagLabel,
	TagCloseButton,
	SelectProps,
	Flex,
} from '@chakra-ui/react';

import { useGetSelectDataQuery } from '../../';
import { Label, SelectContainer, HelperText, Icon, JsonView } from '../..';

type InputContainerProps = InputProps &
	SelectProps & {
		label: string;
		isRequired?: boolean;
		helper?: string;
		value: string[];
		model: string;
		placeholder?: any;
		item?: any;
		valKey?: string;
		labelKey?: string;
	};

const VDataTags: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	item,
	// valKey = '_id',
	// labelKey = 'name',
	...props
}) => {
	const [tag, setTag] = useState<string>('');
	const { data } = useGetSelectDataQuery(model);

	const valKey = item?.valKey || '_id';
	const labelKey = item?.labelKey || 'name';

	const addTag = useCallback(() => {
		if (tag && tag?.length > 0 && !value?.includes(tag)) {
			let newArr = [];
			if (Array.isArray(value)) newArr = [...value, tag];
			else newArr = [tag];

			if (props.onChange) {
				const event = {
					target: {
						name: props?.name,
						value: newArr,
					},
				} as any;
				props.onChange(event); // Call onChange with the synthetic event
			}
		}
		setTag('');
	}, [tag, props.onChange]); // Add props.onChange to the dependency array

	const handleChange = useCallback((e: any) => {
		// const lowerCaseValue = e.target.value.toLowerCase().replace(/\s/g, '-');
		setTag(e.target.value);
	}, []);

	const deleteTag = useCallback(
		(tagToDelete: string) => {
			const newArr = value.filter(tag => tag !== tagToDelete);
			if (props.onChange) {
				const event = {
					target: {
						name: props?.name,
						value: newArr,
					},
				} as any;
				props.onChange(event); // Call onChange with the synthetic event
			}
		},
		[value, props.onChange]
	); // Add value and props.onChange to the dependency array

	const getNameById = (id: string) => {
		const ite = data?.doc?.find((item: any) => item[valKey] === id);
		const addOnValue = item?.modelAddOn && ite?.[item?.modelAddOn];
		const addOnText = addOnValue ? `(${addOnValue})` : '';

		const displayValue = valKey == '_id' ? ite?.[labelKey] : id;

		return `${displayValue}${addOnText}` || id;
	};

	return (
		<FormControl
			isRequired={isRequired}
			gap={4}>
			<Stack
				spacing={2}
				w='full'>
				<Label>{label}</Label>
				{/* <JsonView data={item} /> */}

				<Stack
					spacing={1}
					w='full'>
					<Flex
						align='center'
						gap={2}>
						<SelectContainer
							value={tag}
							onChange={handleChange}>
							<option value=''>Select {model}</option>
							{data &&
								data?.doc?.map((ite: any, i: number) => (
									<option
										disabled={value?.includes(ite[valKey])}
										key={i}
										value={ite[valKey]}>
										{ite[labelKey]}
									</option>
								))}
						</SelectContainer>

						<IconButton
							onClick={addTag}
							size='sm'
							colorScheme='gray'
							aria-label='add tag'
							icon={
								<Icon
									name='add'
									size={20}
								/>
							}
						/>
					</Flex>

					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
				<Wrap
					gap={1}
					pt={2}>
					{value?.map((item: string, i: number) => (
						<WrapItem key={i}>
							<Tag
								size='md'
								variant='subtle'
								colorScheme='gray'>
								<TagLabel>{getNameById(item)}</TagLabel>
								<TagCloseButton onClick={() => deleteTag(item)} />
							</Tag>
						</WrapItem>
					))}
				</Wrap>
			</Stack>
		</FormControl>
	);
};

export default VDataTags;
