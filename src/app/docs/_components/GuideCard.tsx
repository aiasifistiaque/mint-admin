'use client';

import { FC } from 'react';
import NextLink from 'next/link';
import { Flex, Link, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Guide } from './guides';

/**
 * A guide on a docs home page (/docs, /user-docs): its icon and name, what it
 * covers, links straight to its main sections, and "Read the guide".
 */
const GuideCard: FC<{ guide: Guide }> = ({ guide }) => {
	const Icon = guide.icon;
	return (
		<Flex
			direction='column'
			gap={3}
			p={5}
			borderWidth='1px'
			borderColor='border.muted'
			borderRadius='xl'
			bg='bg'
			transition='border-color .15s ease, box-shadow .15s ease'
			_hover={{ borderColor: 'border', boxShadow: 'sm' }}>
			<Flex
				align='center'
				gap={3}>
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
				<Link
					asChild
					fontSize='md'
					fontWeight='600'
					color='fg'
					_hover={{ textDecoration: 'none', color: 'fg.muted' }}>
					<NextLink href={guide.href}>{guide.name}</NextLink>
				</Link>
			</Flex>
			<Text
				fontSize='sm'
				color='fg.muted'
				lineHeight='1.6'>
				{guide.description}
			</Text>
			<Flex
				direction='column'
				gap={1}
				flex={1}>
				{[
					...guide.topics.map(t => ({ href: `${guide.href}#${t.id}`, title: t.title })),
					...(guide.pages || []),
				].map(t => (
					<Link
						key={t.href}
						asChild
						fontSize='13px'
						color='fg'
						w='fit-content'
						_hover={{ color: 'fg.muted' }}>
						<NextLink href={t.href}>{t.title}</NextLink>
					</Link>
				))}
			</Flex>
			<Link
				asChild
				mt={1}
				fontSize='13px'
				fontWeight='500'
				color='fg'
				w='fit-content'
				_hover={{ textDecoration: 'none', color: 'fg.muted' }}>
				<NextLink href={guide.href}>
					Read the guide
					<ArrowRight size={14} />
				</NextLink>
			</Link>
		</Flex>
	);
};

export default GuideCard;
