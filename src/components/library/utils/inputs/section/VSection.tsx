import React, { FC, useState } from 'react';

import {
	FormControl,
	Image,
	Stack,
	Flex,
	Text,
	Heading,
	Button,
	IconButton,
} from '@chakra-ui/react';
import { HelperText, Label, ImageContainer, Column, Icon } from '../../../';
import AddSectionModal from './AddSectionModal';
import DeleteSection from './DeleteSection';

type FormDataType = {
	value: any;
	onChange: any;
	isRequired?: boolean;
	label?: string;
	helper?: string;
	isDisabled?: boolean;
	name: any;
};

const VSection: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	isDisabled = false,
	name,
	...props
}) => {
	const type = value ? 'edit' : 'add';

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
						<Column
							key={i}
							gap={4}>
							<Flex
								justify='space-between'
								align='center'>
								<Heading size='md'>{item?.title} </Heading>
								<Flex gap={1}>
									<AddSectionModal
										value={value}
										type='edit'
										handleDataChange={onChange}
										name={name}
										index={i}
										prevVal={item}
									/>
									<DeleteSection
										idx={i}
										handleDataChange={onChange}
										name={name}
										value={value}
									/>
								</Flex>
							</Flex>

							<Text>{item?.description} </Text>
						</Column>
					))}
				</Column>
				<Flex>
					<AddSectionModal
						value={value}
						type='add'
						handleDataChange={onChange}
						multiple={true}
						name={name}
					/>
				</Flex>
				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

export default VSection;
