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
} from '@chakra-ui/react';

import { Label, Icon, HelperText } from '../..';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string[];
	placeholder?: any;
};

const VTags: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');
	const [tag, setTag] = useState<string>('');

	const handleChange = useCallback((e: any) => {
		const lowerCaseValue = e.target.value.toLowerCase().replace(/\s/g, '-');
		setTag(lowerCaseValue);
	}, []);

	const addTag = useCallback(() => {
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
	}, [tag, props.onChange]); // Add props.onChange to the dependency array

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
							<IconButton
								onClick={addTag}
								size='xs'
								colorScheme='gray'
								aria-label='add tag'
								icon={<Icon name='add' />}
							/>
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

export default VTags;
