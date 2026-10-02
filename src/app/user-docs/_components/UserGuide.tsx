'use client';

import { FC, ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Grid, Link, Text } from '@chakra-ui/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { API_ORIGIN } from '@/components/library/config/lib/constants/panel';
import DocsShell from '../../docs/_components/DocsShell';
import GuideHeader from '../../docs/_components/GuideHeader';
import GuideNav from '../../docs/_components/GuideNav';
import { useHashScroll } from '../../docs/_components/prose';
import { USER_DOCS_NAV, USER_GUIDES, userGuide } from './guides';

/**
 * The frame of every user guide (/user-docs/<guide>): the user guides' navbar,
 * the guide's header (name, icon and description from USER_GUIDES), "On this
 * page", the text, and the guides before and after it. Public — a developer
 * building a tenant's site reads the API guides without an account.
 */
const UserGuide: FC<{
	href: string;
	sections: { id: string; title: string }[];
	open?: { href: string; label: string };
	children: ReactNode;
}> = ({ href, sections, open, children }) => {
	useHashScroll();
	const guide = userGuide(href);
	const at = USER_GUIDES.findIndex(g => g.href === href);
	const prev = USER_GUIDES[at - 1];
	const next = USER_GUIDES[at + 1];

	return (
		<DocsShell
			current={href}
			nav={USER_DOCS_NAV}>
			<Flex
				direction='column'
				gap={6}
				pb={16}>
				<GuideHeader
					href={href}
					icon={guide?.icon}
					title={guide?.name || ''}
					description={guide?.description}
					open={open}
					mb={2}
				/>

				<Grid
					templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
					gap={10}
					alignItems='start'>
					<GuideNav sections={sections} />

					<Box
						maxW='760px'
						minW={0}>
						{children}

						<Grid
							templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
							gap={3}
							mt={12}>
							{prev ? (
								<Turn
									href={prev.href}
									label='Previous'
									title={prev.name}
									back
								/>
							) : (
								<Box />
							)}
							{next && (
								<Turn
									href={next.href}
									label='Next'
									title={next.name}
								/>
							)}
						</Grid>
					</Box>
				</Grid>
			</Flex>
		</DocsShell>
	);
};

const Turn: FC<{ href: string; label: string; title: string; back?: boolean }> = ({ href, label, title, back }) => (
	<Link
		asChild
		display='flex'
		flexDirection='column'
		alignItems={back ? 'flex-start' : 'flex-end'}
		gap={0.5}
		p={4}
		borderWidth='1px'
		borderColor='border.muted'
		borderRadius='xl'
		color='fg'
		_hover={{ textDecoration: 'none', borderColor: 'border' }}>
		<NextLink href={href}>
			<Text
				fontSize='12px'
				color='fg.muted'
				display='inline-flex'
				alignItems='center'
				gap={1}>
				{back && <ArrowLeft size={12} />}
				{label}
				{!back && <ArrowRight size={12} />}
			</Text>
			<Text
				fontSize='sm'
				fontWeight='600'>
				{title}
			</Text>
		</NextLink>
	</Link>
);

export { API_ORIGIN };

/** A project's public API, with `<project>` standing in for its public slug. */
export const PUBLIC_API = `${API_ORIGIN}/public/api/<project>`;

export default UserGuide;
