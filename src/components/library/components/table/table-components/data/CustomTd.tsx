import React, { FC, Fragment } from 'react';
import { Td, Image, Text, Heading, ImageProps, FlexProps, Center } from '@chakra-ui/react';

import { useIsMobile, Column, PLACEHOLDER_IMAGE, TableDataProps } from '../../../..';

const CustomTd: FC<TableDataProps> = ({ children, src, type, heading, editable, ...props }) => {
	const isMobile = useIsMobile();

	//const letters = src ? 15 : 20;
	// const text =
	// 	typeof children === 'string' && !isMobile
	// 		? children.slice(0, letters) + (children.length > letters ? '...' : '')
	// 		: children;

	const text = children;

	const Container = isMobile ? Column : Td;
	const TextContainer = isMobile ? (editable ? Fragment : Text) : Fragment;

	return (
		<>
			<Container
				{...tdCss(type, heading)}
				{...props}>
				{type == 'image-text' && (
					<Center {...imageBoxCss}>
						<Image
							src={src || PLACEHOLDER_IMAGE}
							{...imageCss}
						/>
					</Center>
				)}
				{isMobile && heading && <Heading size='xs'>{heading}</Heading>}
				<TextContainer>{text || <i>--</i>}</TextContainer>
			</Container>
		</>
	);
};

//CSS STARTS HERE
const PADDING_Y = 2;
const PADDING_X = 4;

const IMG_SIZE = { base: '50px', md: '40px' };

//CONTAINER CSS
const tdCss = (type: any, heading: any): any => {
	return {
		maxW: type == 'image-text' ? '240px' : '160px',
		border: 'none',
		whiteSpace: 'normal',
		py: PADDING_Y,
		px: {
			base: 0,
			md: PADDING_X,
		},
		fontWeight: '400',
		gap: heading ? 2 : { base: 4, md: 0 },
		flexDir: heading ? 'column' : 'row',
		fontSize: {
			base: type == 'image-text' ? '1.2rem' : '1rem',
			md: '.85rem',
		},
	};
};

const imageBoxCss: FlexProps = {
	w: IMG_SIZE,
	h: IMG_SIZE,
	minW: IMG_SIZE,
	mr: { base: 2, md: 0 },
};

//IMAGE CSS
const imageCss: ImageProps = {
	objectFit: 'contain',
	h: IMG_SIZE,
	w: IMG_SIZE,
	alt: 'img',
	bg: '#ebebeb',
	_dark: {
		bg: '#2d2d2d',
	},
};

export default CustomTd;
