import React, { FC, Fragment } from 'react';
import { Td, Image, Text, Heading, ImageProps, FlexProps, Center, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { useIsMobile, Column, PLACEHOLDER_IMAGE, TableDataProps } from '../../../..';

const CustomTd: FC<TableDataProps> = ({ children, src, type, heading, editable, ...props }) => {
	const isMobile = useIsMobile();

	const text = children;

	const Container = isMobile ? Column : Td;

	const TextContainer = isMobile
		? editable
			? Fragment
			: type == 'tag'
			? Fragment
			: Text
		: Fragment;

	const External = ({ children }: any) => {
		if (text && (type == 'external-link' || type == 'file')) {
			return (
				<Link
					isExternal
					href={text}>
					{type == 'file' ? <b>Go to file</b> : children} <ExternalLinkIcon mx='4px' />
				</Link>
			);
		}
		return <>{children}</>;
	};

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
				<External>
					<TextContainer>{text || <i>--</i>}</TextContainer>
				</External>
			</Container>
		</>
	);
};

//CSS STARTS HERE
const PADDING_Y = 1.5;
const PADDING_X = 4;

const IMG_SIZE = { base: '50px', md: '40px' };

//CONTAINER CSS
const tdCss = (type: any, heading: any): any => {
	return {
		maxW: type == 'image-text' ? '240px' : '160px',
		border: 'none',
		whiteSpace: 'normal',
		wordBreak: 'break-all',
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
