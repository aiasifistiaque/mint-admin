import { FC, Fragment } from 'react';
import {
	Table,
	Image,
	Text,
	Heading,
	ImageProps,
	Center,
	Link,
	CenterProps,
} from '@chakra-ui/react';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

import { useIsMobile, Column, PLACEHOLDER_IMAGE, TableDataProps, theme } from '../../../..';

const { TABLE } = theme;

const CustomTd: FC<TableDataProps> = ({ children, src, type, heading, editable, ...props }) => {
	const isMobile = useIsMobile();

	const text = children;

	const Container = isMobile ? Column : Table.Cell;

	const TextContainer = isMobile
		? editable
			? Fragment
			: type == 'tag'
			? Fragment
			: Text
		: Fragment;

	// Function to add word break opportunities on specific characters
	const formatTextForBreaking = (text: any) => {
		if (typeof text !== 'string') return text;

		// Add zero-width space after specific characters to allow breaking
		return text.replace(/([_\-/.:%@0])/g, '$1\u200B');
	};

	if (type == 'selectMenu') return <Container {...tdCss(type, heading)}>{children}</Container>;

	const External = ({ children }: any) => {
		if (text && (type == 'external-link' || type == 'file')) {
			return (
				<Link
					target='_blank'
					href={text}>
					<>
						{type == 'file' ? <b>Go to file</b> : children}{' '}
						<ExternalLinkIcon style={{ marginLeft: '4px' }} />
					</>
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
					{TextContainer === Fragment ? (
						formatTextForBreaking(text) || <i>--</i>
					) : (
						<TextContainer
							color='text.light'
							_dark={{ color: 'text.dark' }}
							// This sits next to the copy icon in a row flex container
							// (see tdCss below): as a flex item it defaults to
							// `min-width: auto`, which lets long unbroken text (a URL)
							// refuse to shrink and overflow past the card's column
							// instead of wrapping.
							minW={0}>
							{formatTextForBreaking(text) || <i>--</i>}
						</TextContainer>
					)}
				</External>
			</Container>
		</>
	);
};

//CSS STARTS HERE
const PADDING_Y = TABLE.cell.paddingY;
const PADDING_X = TABLE.cell.paddingX;

const IMG_SIZE = { base: '50px', md: '40px' };

//CONTAINER CSS
const tdCss = (type: any, heading: any): any => {
	return {
		maxW: type == 'image-text' ? '240px' : '160px',
		// Grid items default to `min-width: auto`, so even with `maxW` set a
		// long unbroken run (a URL, before the zero-width-space breaks below
		// even get a chance) can still force its track wider than its 1fr
		// share on the mobile card grid, pushing into the next field. `minW:
		// 0` lets the track actually shrink to that share.
		minW: 0,
		border: 'none',
		whiteSpace: 'normal',
		wordBreak: 'normal',
		overflowWrap: 'break-word',
		color: 'text.light',
		_dark: { color: 'text.dark' },
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
			md: '.9rem',
		},

		// _notLast: {
		// 	borderRight: '1px solid',
		// 	borderColor: 'border.light',
		// 	_dark: {
		// 		borderColor: 'border.dark',
		// 	},
		// },
	};
};

const imageBoxCss: CenterProps = {
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
