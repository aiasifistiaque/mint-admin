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

import { useGetSelectDataQuery } from '@/store/services/usersApi';
import { Label, SelectContainer, HelperText, Icon } from '../..';

type InputContainerProps = InputProps &
	SelectProps & {
		label: string;
		isRequired?: boolean;
		helper?: string;
		value: string[];
		model: string;
		placeholder?: any;
		item?: any;
	};

const VDataTags: React.FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	item,
	...props
}) => {
	const [tag, setTag] = useState<string>('');
	const { data } = useGetSelectDataQuery(model);

	const handleChange = useCallback((e: any) => {
		// const lowerCaseValue = e.target.value.toLowerCase().replace(/\s/g, '-');
		setTag(e.target.value);
	}, []);

	const addTag = useCallback(() => {
		if (tag && tag?.length > 0 && !value?.includes(tag)) {
			const newArr = [...value, tag];

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
		const ite = data?.doc?.find((item: any) => item._id === id);

		return `${ite?.name} ${item?.modelAddOn && `(${ite?.[item?.modelAddOn]})`}` || id;
	};

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
										key={i}
										value={ite?._id}>
										{ite?.name} {item?.modelAddOn && `(${ite?.[item?.modelAddOn]})`}
									</option>
								))}
						</SelectContainer>

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
					gap={1}
					pt={2}>
					{value?.map((item: string, i: number) => (
						<WrapItem key={i}>
							<Tag
								size='sm'
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
