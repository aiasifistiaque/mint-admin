'use client';

import { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Flex, FlexProps, Link, Text } from '@chakra-ui/react';
import { BookOpen } from 'lucide-react';
import { GUIDES } from './guides';

/**
 * The top of every guide: its icon (from GUIDES, by `href`), title, a line on
 * what it covers, and a link to the screen it documents.
 */
const GuideHeader: FC<
	FlexProps & {
		href: string;
		title: string;
		description: ReactNode;
		open?: { href: string; label: string };
	}
> = ({ href, title, description, open, ...props }) => {
	const Icon = GUIDES.find(g => g.href === href)?.icon || BookOpen;
	return (
		<Flex
			align='center'
			gap={3}
			mb={8}
			{...props}>
			<Flex
				w='36px'
				h='36px'
				flexShrink={0}
				align='center'
				justify='center'
				borderRadius='lg'
				bg='bg.muted'>
				<Icon size={18} />
			</Flex>
			<Box minW={0}>
				<Text
					as='h1'
					fontSize='xl'
					fontWeight='600'
					letterSpacing='-0.01em'>
					{title}
				</Text>
				<Text
					fontSize='sm'
					color='fg.muted'>
					{description}
					{open && (
						<>
							{' '}
							<Link asChild>
								<NextLink href={open.href}>{open.label}</NextLink>
							</Link>
						</>
					)}
				</Text>
			</Box>
		</Flex>
	);
};

export default GuideHeader;
