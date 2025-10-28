'use client';
import { useCallback, useState, FC } from 'react';
import { Input, InputProps, IconButton, Flex } from '@chakra-ui/react';

import { Label, Icon, HelperText, FormControl } from '../..';
import { useColorMode } from '@/components/ui/color-mode';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string[];
	placeholder?: any;
	lowercase?: boolean;
	section?: boolean;
};

const VTags: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	lowercase = true,
	section = false,
	...props
}) => {
	const { colorMode } = useColorMode();
	const borderColor = colorMode === 'dark' ? 'brand.200' : 'brand.500';
	const [tag, setTag] = useState<string>('');

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
			<Flex
				flexDir='column'
				gap={2}
				w='full'>
				<Label>{label}</Label>

				<Flex
					flexDir='column'
					gap={1}
					w='full'>
					<Flex
						position='relative'
						alignItems='center'>
						<Input
							value={tag}
							onChange={handleChange}
							px={3}
							paddingRight={10}
							borderRadius='lg'
							size='sm'
							color='text.500'
							_dark={{
								color: 'gray.300',
							}}
							placeholder={placeholder ? placeholder : label}
							_placeholder={{ fontSize: 14, fontWeight: '500' }}
						/>
						<Flex
							position='absolute'
							right={2}
							h='32px'
							alignItems='center'>
							<IconButton
								onClick={addTag}
								size='xs'
								colorPalette='gray'
								aria-label='add tag'>
								<Icon name='add' />
							</IconButton>
						</Flex>
					</Flex>

					{helper && <HelperText>{helper}</HelperText>}
				</Flex>
				<Flex
					flexWrap='wrap'
					gap={1}
					pt={2}>
					{value?.map((item: string, i: number) => (
						<Flex key={i}>
							<Flex
								px={2.5}
								py={1}
								bg='gray.100'
								borderRadius='md'
								alignItems='center'
								gap={2}>
								<Flex
									as='span'
									fontSize='sm'>
									{' '}
									{item}
								</Flex>
								<Flex
									as='button'
									onClick={() => deleteTag(item)}
									cursor='pointer'
									fontSize='lg'
									opacity={0.7}
									_hover={{ opacity: 1 }}>
									×
								</Flex>
							</Flex>
						</Flex>
					))}
				</Flex>
			</Flex>
		</FormControl>
	);
};

export default VTags;
