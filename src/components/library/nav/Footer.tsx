'use client';

import { FC, Fragment, memo } from 'react';
import Link from 'next/link';
import { Box, Flex, Text } from '@chakra-ui/react';
import { padding } from '../config';

/**
 * The links along the bottom of every page (Layout renders this under the
 * page body). An empty `href` shows the label without a link — for a page
 * that doesn't exist yet. Links starting with `http` open in a new tab.
 */
export const FOOTER_LINKS: { label: string; href: string }[] = [
	{ label: 'Support', href: '' },
	{ label: 'System Status', href: '' },
	{ label: 'Docs', href: '' },
	{ label: 'Terms of Use', href: '' },
	{ label: 'Report Issue', href: '' },
	{ label: 'Privacy Policy', href: '' },
];

const COMPANY = 'ThinkCrypt';

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };

const linkCss: any = {
	fontSize: '13px',
	color: 'fg',
	whiteSpace: 'nowrap',
	transition: 'color .12s ease',
	_hover: { color: 'fg.muted' },
};

const FooterLink: FC<{ label: string; href: string }> = ({ label, href }) => {
	if (!href) return <Text {...linkCss}>{label}</Text>;
	const external = /^https?:\/\//.test(href);
	return (
		<Link
			href={href}
			{...(external && { target: '_blank', rel: 'noreferrer' })}>
			<Text {...linkCss}>{label}</Text>
		</Link>
	);
};

const Footer = () => (
	<Box
		as='footer'
		borderTopWidth='1px'
		borderColor='border.muted'
		px={PX}
		py={5}>
		<Flex
			align='center'
			justify='center'
			wrap='wrap'
			rowGap={2}
			columnGap={4}>
			{FOOTER_LINKS.map((link, i) => (
				<Fragment key={link.label}>
					{i > 0 && (
						<Box
							aria-hidden
							h='14px'
							w='1px'
							bg='border'
						/>
					)}
					<FooterLink {...link} />
				</Fragment>
			))}
			<Text
				fontSize='13px'
				color='fg.muted'
				whiteSpace='nowrap'
				ml={{ base: 0, md: 2 }}>
				© {new Date().getFullYear()} {COMPANY}
			</Text>
		</Flex>
	</Box>
);

export default memo(Footer);
