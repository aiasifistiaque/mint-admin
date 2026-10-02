'use client';

import NextLink from 'next/link';
import { Box, Button, Flex, Grid, Link, Text } from '@chakra-ui/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import DocsShell from './_components/DocsShell';
import GuideCard from './_components/GuideCard';
import { GUIDES, GUIDE_GROUPS } from './_components/guides';

/**
 * The docs home (/docs): what the docs cover, a short path through the first
 * things to set up, and every guide as a card, grouped, with links straight to
 * its main sections. Public, like the sign-in & security guide — it only links
 * out; guides that need a login still ask for one.
 */

const STEPS = [
	{
		title: 'Secure your account',
		body: 'Turn on two-factor sign-in with a passkey or email codes.',
		href: '/docs/two-factor#turn-on',
	},
	{
		title: 'Build a page',
		body: 'Describe a feature and let the builder make its model, table and form.',
		href: '/docs/builder#features',
	},
	{
		title: 'Put it in the sidebar',
		body: 'Add the page to a section and choose who can see it.',
		href: '/docs/sidebar-builder#pages',
	},
	{
		title: 'Shape the dashboard',
		body: 'Pick the numbers and charts everyone sees first.',
		href: '/docs/dashboard-builder#widgets',
	},
];

const DocsHome = () => (
	<DocsShell current='/docs'>
		{/* Intro */}
		<Box
			pt={{ base: 2, md: 6 }}
			pb={{ base: 8, md: 12 }}
			maxW='680px'>
			<Text
				fontSize='sm'
				fontWeight='500'
				color='fg.muted'
				mb={2}>
				MINT Docs
			</Text>
			<Text
				as='h1'
				fontSize={{ base: '2xl', md: '3xl' }}
				fontWeight='600'
				letterSpacing='-0.02em'
				lineHeight='1.2'
				mb={3}>
				Everything you need to run your admin
			</Text>
			<Text
				fontSize='md'
				color='fg.muted'
				lineHeight='1.7'
				mb={6}>
				Guides for everyone who uses the admin — from signing in safely, to building your own pages, to the
				everyday tools. Start with the steps below, or open any guide.
			</Text>
			<Flex
				gap={2}
				wrap='wrap'>
				<Button
					asChild
					size='sm'>
					<a href='#get-started'>
						Get started
						<ArrowRight size={14} />
					</a>
				</Button>
				<Button
					asChild
					size='sm'
					variant='outline'>
					<NextLink href='/'>
						Open admin
						<ArrowUpRight size={14} />
					</NextLink>
				</Button>
			</Flex>
		</Box>

		{/* Get started */}
		<Box
			as='section'
			id='get-started'
			scrollMarginTop='80px'
			mb={12}>
			<Text
				as='h2'
				fontSize='lg'
				fontWeight='600'
				mb={1}>
				Get started
			</Text>
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={5}>
				The first four things to set up, in order.
			</Text>
			<Grid
				templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
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

		{/* Every guide, by group */}
		<Flex
			direction='column'
			gap={10}
			pb={8}>
			{GUIDE_GROUPS.map(group => {
				const guides = GUIDES.filter(g => g.group === group);
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

export default DocsHome;
