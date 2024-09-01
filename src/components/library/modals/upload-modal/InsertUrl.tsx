import React, { ReactNode } from 'react';
import {
	Center,
	Flex,
	FlexProps,
	FormControl,
	FormLabel,
	Image,
	Input,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';

import { Column } from '../../';

const bodyText = {
	title: `If your Url is correct, you'll see an image preview here. Large images may take a few
				minutes to appear.`,
	subtitle:
		'Remember: Using others images on the web without their permission may be bad manners, or worse, copyright infringement',
};

const Label = ({ children }: { children: ReactNode }) => (
	<FormLabel
		fontWeight='bold'
		m='0'
		fontSize='14px'
		whiteSpace='nowrap'>
		{children}
	</FormLabel>
);

const Container = ({ children }: FlexProps & { children: ReactNode }) => (
	<Center
		gap={1}
		flexDir='column'>
		{children}
	</Center>
);

const InsertUrl = ({ handleSelect }: { handleSelect: any }) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');
	const [url, setUrl] = React.useState<any>(null);
	const handleChange = (e: any) => {
		setUrl(e.target.value);
		handleSelect(e.target.value);
	};
	const ImageContainer = (
		<Center flex={1}>
			<Container
				h='300px'
				w='400px'
				bg='gray.300'>
				<Image
					src={url}
					alt='Preview'
					objectFit='contain'
				/>
			</Container>
		</Center>
	);

	const bodyContainer = (
		<Container
			flex={1}
			color='gray.400'>
			<Text
				fontWeight='600'
				fontSize='1.1rem'>
				{bodyText?.title}
			</Text>
			<Text fontSize='.9rem'>{bodyText?.subtitle}</Text>
		</Container>
	);

	const body = url ? ImageContainer : bodyContainer;

	return (
		<Column
			gap={2}
			flex={1}
			h='full'>
			<Flex>
				<FormControl>
					<Flex
						gap={2}
						align='center'>
						<Label>Paste an image URL here:</Label>
						<Input
							focusBorderColor={borderColor}
							size='xs'
							value={url}
							onChange={handleChange}
						/>
					</Flex>
				</FormControl>
			</Flex>
			<Center flex={1}>{body}</Center>
		</Column>
	);
};

export default InsertUrl;
