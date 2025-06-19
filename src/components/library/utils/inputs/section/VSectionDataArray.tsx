import { FC, useState } from 'react';

import { FormControl, Image, Stack, Flex, Text, Heading } from '@chakra-ui/react';
import { HelperText, Label, ImageContainer, Column } from '../../..';
import DeleteSection from './DeleteSection';
import AddSectionDataModal from './AddSectionDataModal';

type FormDataType = {
	value: any;
	onChange: any;
	isRequired?: boolean;
	label?: string;
	helper?: string;
	isDisabled?: boolean;
	name: any;
	hasImage?: boolean;
	limit?: number;
	section?: any;
};

const VSectionDataArray: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	isDisabled = false,
	name,
	limit = 999,
	section,
	...props
}) => {
	const imageComponent = (
		<ImageContainer>
			<Image
				h='100%'
				w='100%'
				objectFit='contain'
				src={value}
			/>
		</ImageContainer>
	);

	if (isDisabled) return imageComponent;
	return (
		<FormControl isRequired={isRequired}>
			<Stack w='full'>
				<Label fontSize='22px'>{label}</Label>
				<Column
					gap={4}
					my={4}>
					{value?.map((item: any, i: number) => (
						<Flex
							key={i}
							w='full'
							align='center'
							gap={6}>
							{section?.display?.image && (
								<Image
									objectFit='contain'
									src={item?.[section?.display?.image]}
									h='64px'
									w='64px'
								/>
							)}
							<Column
								gap={4}
								w='full'>
								<Flex
									justify='space-between'
									align='center'>
									<Heading size='md'>{item?.[section?.display?.title]}</Heading>
									<Flex gap={1}>
										<AddSectionDataModal
											value={value}
											type='edit'
											handleDataChange={onChange}
											name={name}
											index={i}
											prevVal={item}
											section={section}
											dataModel={section?.dataModel}
										/>
										<DeleteSection
											idx={i}
											handleDataChange={onChange}
											name={name}
											value={value}
										/>
									</Flex>
								</Flex>

								<Text noOfLines={6}>{item?.[section?.display?.description]}</Text>
							</Column>
						</Flex>
					))}
				</Column>
				{value && value?.length >= limit ? null : (
					<Flex>
						<AddSectionDataModal
							value={value}
							type='add'
							handleDataChange={onChange}
							multiple={true}
							name={name}
							section={section}
							dataModel={section?.dataModel}
						/>
					</Flex>
				)}
				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VSectionDataArray;
