'use client';

import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Grid, GridItem, Link, Text } from '@chakra-ui/react';
import { DashboardGrid } from '@/components/library/dashboard/widgets';
import { SIZE_LABEL, SIZE_SPAN, Widget, WidgetSize } from '@/components/library/dashboard/types';
import DocsShell from '../../_components/DocsShell';
import GuideHeader from '../../_components/GuideHeader';
import GuideNav from '../../_components/GuideNav';
import { C, Code, H3, P, Props, Section } from '../_components/ui';
import { LibraryTabs } from '../_components/LibraryTabs';
import SafeDemo from '../_components/SafeDemo';

/**
 * Dashboard widgets — live. Every example reads the Admins route, which every
 * install has, so what you see are real numbers from this admin (and a note
 * instead, if your role can't read admins).
 */

const NAV = [
	{
		group: 'Widgets',
		items: [
			{ id: 'stat', title: 'Number' },
			{ id: 'chart-time', title: 'Chart over time' },
			{ id: 'chart-field', title: 'Chart by field' },
			{ id: 'recent', title: 'Recent items' },
		],
	},
	{
		group: 'Layout',
		items: [
			{ id: 'sizes', title: 'Sizes' },
			{ id: 'settings', title: 'Widget settings' },
		],
	},
];

const w = (widget: Omit<Widget, 'route'>): Widget => ({ route: 'admins', ...widget });

const STATS: Widget[] = [
	w({ id: 's1', type: 'stat', title: 'Admins', size: 'md', metric: 'count', range: 'all' }),
	w({ id: 's2', type: 'stat', title: 'New admins', size: 'md', metric: 'count', range: '30d', compare: true }),
	w({
		id: 's3',
		type: 'stat',
		title: 'Active admins',
		size: 'md',
		metric: 'count',
		range: 'all',
		filters: [{ field: 'isActive', op: 'eq', value: true } as any],
	}),
];

const TIME: Widget[] = [
	w({ id: 't1', type: 'chart', title: 'Admins added, by month', size: 'lg', group: 'time', chart: 'bar', interval: 'month', range: '12m', metric: 'count' }),
	w({ id: 't2', type: 'chart', title: 'Admins added, by day', size: 'lg', group: 'time', chart: 'line', interval: 'day', range: '30d', metric: 'count' }),
];

const FIELD: Widget[] = [
	w({ id: 'f1', type: 'chart', title: 'By invitation status', size: 'lg', group: 'field', chart: 'donut', by: 'invitationStatus', metric: 'count', range: 'all' }),
	w({ id: 'f2', type: 'chart', title: 'Active or not', size: 'lg', group: 'field', chart: 'bar', by: 'isActive', metric: 'count', range: 'all', limit: 5 }),
];

const RECENT: Widget[] = [
	w({ id: 'r1', type: 'recent', title: 'Latest admins', size: 'full', columns: ['name', 'email', 'createdAt'], sort: '-createdAt', limit: 5 }),
];

const Live: FC<{ widgets: Widget[] }> = ({ widgets }) => (
	<SafeDemo name='This widget'>
		<DashboardGrid
			widgets={widgets}
			preview
		/>
	</SafeDemo>
);

const Sizes: FC = () => (
	<Grid
		templateColumns='repeat(12, 1fr)'
		gap={2}>
		{(Object.keys(SIZE_SPAN) as WidgetSize[]).map(size => (
			<GridItem
				key={size}
				colSpan={SIZE_SPAN[size]}>
				<Flex
					h='48px'
					align='center'
					justify='center'
					borderWidth='1px'
					borderStyle='dashed'
					borderColor='border'
					borderRadius='md'
					fontSize='12px'
					color='fg.muted'>
					<C>{size}</C>&nbsp;{SIZE_LABEL[size]} · {SIZE_SPAN[size]}/12
				</Flex>
			</GridItem>
		))}
	</Grid>
);

const DashboardDocs = () => (
	<Flex
		direction='column'
		gap={6}
		pb={16}>
		<GuideHeader
			href='/docs/components'
			title='Dashboard'
			description='The dashboard’s widgets — numbers, charts and recent lists — live, reading this admin’s own Admins route.'
			open={{ href: '/dashboard-builder', label: 'Open Dashboard Builder' }}
			mb={0}
		/>
		<LibraryTabs current='/docs/components/dashboard' />

		<Grid
			templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
			gap={10}
			alignItems='start'>
			<GuideNav groups={NAV} />

			<Box
				maxW='800px'
				minW={0}>
				<Section
					id='overview'
					title='How widgets work'
					lead='Each widget reads one route, with the reader’s own permissions.'>
					<P>
						A widget asks its route for numbers (<C>/get/stats</C>) or rows, as the person looking at the
						dashboard — someone who can&apos;t read the route doesn&apos;t see the widget. They&apos;re arranged
						in the{' '}
						<Link asChild>
							<NextLink href='/docs/dashboard-builder'>dashboard builder</NextLink>
						</Link>
						; in code, <C>DashboardGrid</C> draws a list of them.
					</P>
					<Code label='tsx'>{`import { DashboardGrid } from '@/components/library/dashboard/widgets';

<DashboardGrid
	widgets={[
		{ id: 'a', type: 'stat', route: 'orders', title: 'Orders', size: 'sm', metric: 'count', range: '30d', compare: true },
	]}
/>`}</Code>
				</Section>

				<Section
					id='stat'
					title='Number'
					lead='One figure — a count, sum or average over a time range — optionally against the period before.'>
					<Live widgets={STATS} />
					<P>
						<strong>Compare</strong> adds the change on the previous period of the same length, by arrow and
						words rather than colour — more isn&apos;t always better. <C>prefix</C> and <C>suffix</C> add a unit
						(৳, kg).
					</P>
				</Section>

				<Section
					id='chart-time'
					title='Chart over time'
					lead='A series by day, week or month — bars or a line.'>
					<Live widgets={TIME} />
				</Section>

				<Section
					id='chart-field'
					title='Chart by field'
					lead='How records split across a field’s values — a donut or bars, largest first.'>
					<Live widgets={FIELD} />
				</Section>

				<Section
					id='recent'
					title='Recent items'
					lead='The latest records, with the columns you choose; each row opens the record.'>
					<Live widgets={RECENT} />
				</Section>

				<Section
					id='sizes'
					title='Sizes'
					lead='Widths out of a 12-column grid on wide screens; every widget is full width on a phone.'>
					<Sizes />
				</Section>

				<Section
					id='settings'
					title='Widget settings'
					lead='The shape the dashboard builder saves.'>
					<Props
						rows={[
							{ name: 'type', type: 'stat | chart | recent', required: true, description: 'What the widget shows.' },
							{ name: 'route', type: 'string', required: true, description: 'The route it reads.' },
							{ name: 'title', type: 'string', description: 'The heading.' },
							{ name: 'size', type: 'sm | md | lg | xl | full', required: true, description: 'Its width (above).' },
							{ name: 'metric / field', type: 'count | sum | avg / string', description: 'What to measure; sum and avg need a number field.' },
							{ name: 'range / dateField', type: 'all | today | 7d | 30d | 90d | month | 12m | year', description: 'The time window, and the date it’s measured on (createdAt by default).' },
							{ name: 'compare', type: 'boolean', description: 'Number only: against the period before.' },
							{ name: 'group', type: 'time | field', description: 'Chart only: a series over time, or a split by a field.' },
							{ name: 'chart / interval / by / limit', type: 'bar | line | donut / day | week | month / string / number', description: 'Chart only: the look, the step, the field to split by, how many values.' },
							{ name: 'columns / sort', type: 'string[] / string', description: 'Recent only: the columns, and the order (-createdAt).' },
							{ name: 'filters', type: 'condition[]', description: 'Fixed conditions on the route’s fields — count only paid orders.' },
							{ name: 'prefix / suffix', type: 'string', description: 'A unit around the number.' },
						]}
					/>
					<H3>The charts on their own</H3>
					<P>
						The column, line, bar-list and donut charts these widgets draw are components too, on{' '}
						<Link asChild>
							<NextLink href='/docs/components#charts'>Filters &amp; charts</NextLink>
						</Link>
						.
					</P>
				</Section>
			</Box>
		</Grid>
	</Flex>
);

const DashboardDocsPage = () => (
	<DocsShell
		current='/docs/components'
		requireLogin>
		<DashboardDocs />
	</DocsShell>
);

export default DashboardDocsPage;
