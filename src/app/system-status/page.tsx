'use client';

import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Button, Flex, Link, Spinner, Text } from '@chakra-ui/react';
import { CircleAlert, CircleCheck, CircleDashed, RefreshCw } from 'lucide-react';
import { useGetSystemStatusQuery } from '@/components/library';
import SiteShell from '../_site/SiteShell';

/**
 * System Status (public): whether the admin's parts are working, checked
 * against GET /admin/api/status every 30 seconds. The admin app is up if this
 * page loaded; the API is up if the check answers; the database reports its
 * own ping.
 */

type State = 'operational' | 'down' | 'checking';

const STATE: Record<State, { label: string; color: string; Icon: any }> = {
	operational: { label: 'Operational', color: 'green.fg', Icon: CircleCheck },
	down: { label: 'Down', color: 'red.fg', Icon: CircleAlert },
	checking: { label: 'Checking…', color: 'fg.muted', Icon: CircleDashed },
};

const Row: FC<{ name: string; note: string; state: State; detail?: string }> = ({ name, note, state, detail }) => {
	const s = STATE[state];
	return (
		<Flex
			align='center'
			gap={4}
			px={5}
			py={4}
			borderTopWidth='1px'
			borderColor='border.muted'
			_first={{ borderTopWidth: 0 }}>
			<Box
				flex={1}
				minW={0}>
				<Text
					fontSize='sm'
					fontWeight='600'>
					{name}
				</Text>
				<Text
					fontSize='12px'
					color='fg.muted'>
					{note}
				</Text>
			</Box>
			{detail && (
				<Text
					fontSize='12px'
					color='fg.muted'
					flexShrink={0}>
					{detail}
				</Text>
			)}
			{/* The state in words beside its icon — never colour alone. */}
			<Flex
				align='center'
				gap={1.5}
				color={s.color}
				flexShrink={0}
				w='110px'
				justify='flex-end'>
				<s.Icon size={16} />
				<Text
					fontSize='13px'
					fontWeight='500'
					color='inherit'>
					{s.label}
				</Text>
			</Flex>
		</Flex>
	);
};

const since = (seconds?: number) => {
	if (seconds === undefined) return undefined;
	const d = Math.floor(seconds / 86400);
	const h = Math.floor((seconds % 86400) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	return d ? `up ${d}d ${h}h` : h ? `up ${h}h ${m}m` : `up ${m}m`;
};

const SystemStatusPage = () => {
	const { data, isLoading, isFetching, isError, refetch, fulfilledTimeStamp } = useGetSystemStatusQuery(undefined, {
		pollingInterval: 30000,
		refetchOnFocus: true,
	});

	const api: State = isLoading ? 'checking' : isError ? 'down' : 'operational';
	const database: State = isLoading ? 'checking' : isError ? 'down' : data?.database === 'operational' ? 'operational' : 'down';
	const allUp = api === 'operational' && database === 'operational';
	const checking = api === 'checking';

	const banner = checking
		? { text: 'Checking the systems…', bg: 'bg.muted', color: 'fg', Icon: CircleDashed }
		: allUp
		? { text: 'All systems operational', bg: 'green.subtle', color: 'green.fg', Icon: CircleCheck }
		: { text: 'Some systems are not working', bg: 'red.subtle', color: 'red.fg', Icon: CircleAlert };

	return (
		<SiteShell
			title='System Status'
			lead='Whether the admin is working right now. Checked every 30 seconds.'>
			<Flex
				align='center'
				gap={3}
				px={5}
				py={4}
				mb={6}
				borderRadius='xl'
				bg={banner.bg}
				color={banner.color}>
				<banner.Icon size={20} />
				<Text
					fontSize='md'
					fontWeight='600'
					color='inherit'
					flex={1}>
					{banner.text}
				</Text>
				{isFetching && <Spinner size='sm' />}
			</Flex>

			<Box
				borderWidth='1px'
				borderColor='border'
				borderRadius='xl'
				overflow='hidden'>
				<Row
					name='Admin app'
					note='The pages you use in the browser'
					state='operational'
				/>
				<Row
					name='API'
					note='Sign-in, saving and loading data'
					state={api}
					detail={data && !isError ? `${data.apiMs} ms · ${since(data.uptime)}` : undefined}
				/>
				<Row
					name='Database'
					note='Where records are stored'
					state={database}
					detail={data && !isError && data.databaseMs !== null ? `${data.databaseMs} ms` : undefined}
				/>
			</Box>

			<Flex
				align='center'
				justify='space-between'
				mt={4}
				gap={3}>
				<Text
					fontSize='12px'
					color='fg.muted'>
					{fulfilledTimeStamp ? `Last checked ${new Date(fulfilledTimeStamp).toLocaleTimeString()}` : 'Not checked yet'}
				</Text>
				<Button
					size='xs'
					variant='outline'
					loading={isFetching}
					onClick={() => refetch()}>
					<RefreshCw size={13} />
					Check now
				</Button>
			</Flex>

			<Text
				fontSize='sm'
				color='fg.muted'
				mt={10}
				lineHeight='1.7'>
				Something not working that shows as operational here?{' '}
				<Link asChild>
					<NextLink href='/report-issue'>Report an issue</NextLink>
				</Link>
				, and include what you were doing when it happened.
			</Text>
		</SiteShell>
	);
};

export default SystemStatusPage;
