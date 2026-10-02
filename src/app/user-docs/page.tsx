'use client';

import NextLink from 'next/link';
import { Box, Button, Flex, Grid, Link, Text } from '@chakra-ui/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import DocsShell from '../docs/_components/DocsShell';
import GuideCard from '../docs/_components/GuideCard';
import { HOME } from '@/components/library/config/lib/constants/panel';
import { USER_DOCS_NAV, USER_GUIDES, USER_GUIDE_GROUPS } from './_components/guides';

/**
 * The user guides' home (/user-docs): what MINT is in a paragraph, the first
 * five things to do, and every guide as a card by group. Public; the tenant
 * panel's footer and every "How this works" link lead here.
 */

const STEPS = [
	{ title: 'Make a project', body: 'An app for your data, or a website with pages, SEO and content.', href: '/user-docs/projects#create' },
	{ title: 'Build a model', body: 'Customers, orders, bookings — each gets a table, form and detail page.', href: '/user-docs/models#models-wizard' },
	{ title: 'Invite your team', body: 'Add people by email and choose what each of them may do.', href: '/user-docs/organization#invitations' },
	{ title: 'Shape the panel', body: 'Arrange the sidebar and choose what the dashboard shows.', href: '/user-docs/sidebar' },
	{ title: 'Go live', body: 'Open models to your own site or app, with sign-in for your customers.', href: '/user-docs/public-api' },
];

const UserDocsHome = () => (
	<DocsShell
		current='/user-docs'
		nav={USER_DOCS_NAV}>
		<Box
			pt={{ base: 2, md: 6 }}
			pb={{ base: 8, md: 12 }}
			maxW='680px'>
			<Text
				fontSize='sm'
				fontWeight='500'
				color='fg.muted'
				mb={2}>
				MINT Guides
			</Text>
			<Text
				as='h1'
				fontSize={{ base: '2xl', md: '3xl' }}
				fontWeight='600'
				letterSpacing='-0.02em'
				lineHeight='1.2'
				mb={3}>
				Build apps and websites for your business
			</Text>
			<Text
				fontSize='md'
				color='fg.muted'
				lineHeight='1.7'
				mb={6}>
				MINT gives your organization projects — apps and websites — where you describe the things you keep track of and get a
				ready admin for them: tables, forms, filters, a dashboard. Then open them to your own site or app, with sign-in for your
				customers and analytics for your visitors. These guides cover all of it.
			</Text>
			<Flex
				gap={2}
				wrap='wrap'>
				<Button
					asChild
					size='sm'>
					<NextLink href='/user-docs/getting-started'>
						Get started
						<ArrowRight size={14} />
					</NextLink>
				</Button>
				<Button
					asChild
					size='sm'
					variant='outline'>
					<NextLink href={HOME}>
						Open MINT
						<ArrowUpRight size={14} />
					</NextLink>
				</Button>
			</Flex>
		</Box>

		<Box
			as='section'
			id='first-steps'
			scrollMarginTop='80px'
			mb={12}>
			<Text
				as='h2'
				fontSize='lg'
				fontWeight='600'
				mb={1}>
				First steps
			</Text>
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={5}>
				From signing up to a live project, in order.
			</Text>
			<Grid
				templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }}
				gap={3}>
				{STEPS.map((step, i) => (
					<Link
						key={step.href}
						asChild
						display='flex'
						flexDirection='column'
						alignItems='flex-start'
						gap={2}
						p={4}
						borderWidth='1px'
						borderColor='border.muted'
						borderRadius='xl'
						bg='bg.subtle'
						color='fg'
						transition='border-color .15s ease'
						_hover={{ textDecoration: 'none', borderColor: 'border' }}>
						<NextLink href={step.href}>
							<Flex
								w='24px'
								h='24px'
								align='center'
								justify='center'
								borderRadius='full'
								bg='bg.inverted'
								color='fg.inverted'
								fontSize='12px'
								fontWeight='600'>
								{i + 1}
							</Flex>
							<Text
								fontSize='sm'
								fontWeight='600'>
								{step.title}
							</Text>
							<Text
								fontSize='13px'
								color='fg.muted'
								lineHeight='1.5'>
								{step.body}
							</Text>
						</NextLink>
					</Link>
				))}
			</Grid>
		</Box>

		<Flex
			direction='column'
			gap={10}
			pb={8}>
			{USER_GUIDE_GROUPS.map(group => {
				const guides = USER_GUIDES.filter(g => g.group === group);
				if (!guides.length) return null;
				return (
					<Box
						as='section'
						key={group}>
						<Text
							as='h2'
							fontSize='lg'
							fontWeight='600'
							mb={4}>
							{group}
						</Text>
						<Grid
							templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
							gap={4}>
							{guides.map(g => (
								<GuideCard
									key={g.href}
									guide={g}
								/>
							))}
						</Grid>
					</Box>
				);
			})}
		</Flex>
	</DocsShell>
);

export default UserDocsHome;
