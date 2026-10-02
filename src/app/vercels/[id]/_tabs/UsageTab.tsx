'use client';

import { Badge, Button, Flex, Grid, Text } from '@chakra-ui/react';
import {
	dateTime,
	Panel,
	StatTile,
	StatusDot,
	DataTable,
	EmptyState,
	ErrorState,
	TableSkeleton,
} from '@/components/library/cl';

const USAGE_WINDOWS = [7, 30, 90];

/**
 * Usage, derived from the deployment list.
 *
 * Vercel's metered figures — bandwidth, function invocations, edge requests —
 * are Pro-and-above: `GET /v1/usage` answers `plan_upgrade_required` on this
 * account. So this tab counts what the deployment list can prove and then says
 * plainly what it cannot see. The unavailable panel is **not optional**: without
 * it the build numbers read as the whole picture, and someone would plan
 * capacity from a third of the data.
 */
export const UsageTab = ({
	usage,
	isFetching,
	isError,
	error,
	days,
	setDays,
}: {
	usage: any;
	isFetching: boolean;
	isError: boolean;
	error: any;
	days: number;
	setDays: (value: number) => void;
}) => {
	if (isError) return <ErrorState error={error} />;
	if (!usage && isFetching) return <TableSkeleton rows={6} />;
	if (!usage) return <EmptyState title='No usage data' />;

	return (
		<Flex
			direction='column'
			gap={4}>
			<Flex
				align='center'
				gap={2}>
				{USAGE_WINDOWS.map(window => (
					<Button
						key={window}
						size='xs'
						variant={days === window ? 'solid' : 'outline'}
						onClick={() => setDays(window)}>
						{window} days
					</Button>
				))}
				{usage.truncated && (
					<Text
						fontSize='xs'
						color='fg.muted'>
						More deployments than one page could carry — these totals are a floor.
					</Text>
				)}
			</Flex>

			<Grid
				templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
				gap={3}>
				<StatTile
					label='Builds'
					hint={`last ${days} days`}
					value={usage.builds.total}
				/>
				<StatTile
					label='Build minutes'
					hint='measured, not estimated'
					value={usage.buildMinutes.total}
				/>
				<StatTile
					label='Failed'
					value={usage.builds.failed}
				/>
				<StatTile
					label='Queued now'
					hint={
						usage.limits.concurrentBuilds
							? `${usage.limits.concurrentBuilds} concurrent build${usage.limits.concurrentBuilds > 1 ? 's' : ''}`
							: undefined
					}
					value={usage.builds.queuedNow}
				/>
			</Grid>

			<Panel
				title='By project'
				subtitle='Sorted by build minutes — the top row is what is consuming the account.'
				flush>
				{!usage.byProject.length ? (
					<EmptyState title='No deployments in this window' />
				) : (
					<DataTable<any>
						columns={[
							{
								key: 'name',
								label: 'Project',
								render: row => (
									<Flex
										align='center'
										gap={2}>
										<Text fontSize='13px'>{row.name}</Text>
										{row.isStorefront && (
											<Badge
												size='xs'
												colorPalette='purple'>
												Storefront
											</Badge>
										)}
									</Flex>
								),
							},
							{ key: 'deployments', label: 'Builds', numeric: true, render: row => <Text fontSize='13px'>{row.deployments}</Text> },
							{ key: 'minutes', label: 'Minutes', numeric: true, render: row => <Text fontSize='13px'>{row.minutes}</Text> },
							{ key: 'failed', label: 'Failed', numeric: true, render: row => <Text fontSize='13px' color={row.failed ? 'fg.error' : 'fg.muted'}>{row.failed}</Text> },
							{ key: 'last', label: 'Last deployed', render: row => <Text fontSize='13px' color='fg.muted'>{dateTime(row.lastDeployedAt)}</Text> },
						]}
						rows={usage.byProject}
						rowKey={row => row.projectId}
					/>
				)}
			</Panel>

			<Panel
				title='By day'
				flush>
				{!usage.perDay.length ? (
					<EmptyState title='No deployments in this window' />
				) : (
					<DataTable<any>
						columns={[
							{ key: 'date', label: 'Date', render: row => <Text fontSize='13px'>{row.date}</Text> },
							{
								key: 'count',
								label: 'Builds',
								numeric: true,
								// The cap counts deployments, so the badge belongs beside the
								// build count. In its own trailing column it sat next to
								// Minutes and read as though the minutes were capped.
								render: row => (
									<Flex
										align='center'
										justify='flex-end'
										gap={2}>
										{row.hitCap && (
											<Badge
												size='xs'
												colorPalette='orange'
												title='This day reached the assumed daily deployment cap'>
												at cap
											</Badge>
										)}
										<Text fontSize='13px'>{row.count}</Text>
									</Flex>
								),
							},
							{ key: 'minutes', label: 'Minutes', numeric: true, render: row => <Text fontSize='13px'>{row.minutes}</Text> },
						]}
						rows={[...usage.perDay].reverse()}
						rowKey={row => row.date}
					/>
				)}
			</Panel>

			<Panel
				title='Not available through the API'
				subtitle={
					usage.limits.plan === 'hobby'
						? 'Vercel exposes metered usage only to Pro and Enterprise teams. Everything above is counted from the deployment list instead.'
						: 'Vercel does not expose these to this token.'
				}>
				<Flex
					direction='column'
					gap={2}>
					{usage.unavailable.map((metric: string) => (
						<Flex
							key={metric}
							align='center'
							gap={2}>
							<StatusDot
								tone='idle'
								showLabel={false}
							/>
							<Text
								fontSize='13px'
								color='fg.muted'>
								{metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
							</Text>
						</Flex>
					))}
					<Text
						fontSize='xs'
						color='fg.muted'
						mt={1}>
						Read these on the Vercel dashboard.
					</Text>
				</Flex>
			</Panel>
		</Flex>
	);
};

export default UsageTab;
