import React, { FC, Fragment } from 'react';
import { Td, Image, Text, Flex, Heading, useColorModeValue } from '@chakra-ui/react';

import { useIsMobile, Column, PLACEHOLDER_IMAGE, TableDataProps } from '../../../../';

const PADDING_Y = 1;
const PADDING_X = 4;

const IMG_SIZE = { base: '50px', md: '40px' };

const CustomTd: FC<TableDataProps> = ({ children, src, type, heading, editable, ...props }) => {
	const isMobile = useIsMobile();
	const letters = src ? 15 : 20;
	const text =
		typeof children === 'string' && !isMobile
			? children.slice(0, letters) + (children.length > letters ? '...' : '')
			: children;

	const Container = isMobile ? Column : Td;

	const TextContainer = isMobile ? (editable ? Fragment : Text) : Fragment;
	const imageBg = useColorModeValue('#ebebeb', '#2d2d2d');

	return (
		<>
			<Container
				_dark={{
					borderColor: 'stroke.deepD',
				}}
				gap={heading ? 2 : { base: 4, md: 0 }}
				flexDir={heading ? 'column' : 'row'}
				wordBreak='break-word'
				fontSize={isMobile && type == 'image-text' ? '1.2rem' : isMobile ? '1rem' : '.82rem'}
				py={PADDING_Y}
				px={{ base: 0, md: PADDING_X }}
				fontWeight='500'
				{...props}>
				{type == 'image-text' && (
					<Image
						bg={imageBg}
						mr={{ base: 2, md: 0 }}
						objectFit='contain'
						h={IMG_SIZE}
						w={IMG_SIZE}
						src={src || PLACEHOLDER_IMAGE}
						alt='img'
					/>
				)}
				{isMobile && heading && <Heading size='xs'>{heading}</Heading>}
				<TextContainer>{text || <i>--</i>}</TextContainer>
			</Container>
		</>
	);
};

export default CustomTd;
