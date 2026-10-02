'use client';

import { FC, useEffect, useState } from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import {
	Toast,
	radius,
	useGetHerokuDynosQuery,
	useUpdateHerokuFormationMutation,
	useRestartHerokuDynoMutation,
	useRestartHerokuAppMutation,
} from '@/components/library';
import {
	Panel,
	DataTable,
	StatusDot,
	ConfirmAction,
	EmptyState,
	ErrorState,
	TableSkeleton,
	Dropdown,
} from '@/components/library/cl';

/** Heroku's current sizes. A size the account cannot use is rejected upstream
 *  with a readable message, so this stays a plain list rather than a gate. */
const DYNO_SIZES = ['eco', 'basic', 'standard-1x', 'standard-2x', 'performance-m', 'performance-l'];

const uptime = (since?: string | null) => {
	if (!since) return '—';

	const minutes = Math.floor((Date.now() - new Date(since).getTime()) / 60000);
	if (minutes < 60) return `${minutes}m`;
	if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
	return `${Math.floor(minutes / 1440)}d`;
};

const DynosTab: FC<{ id: string; app: string }> = ({ id, app }) => {
	const { data, isFetching, isError, error, refetch } = useGetHerokuDynosQuery({ id, app });

	const [scale, scaleResult] = useUpdateHerokuFormationMutation();
	const [restartDyno, restartDynoResult] = useRestartHerokuDynoMutation();
	const [restartApp, restartAppResult] = useRestartHerokuAppMutation();

	const [edits, setEdits] = useState<Record<string, { quantity: number; size: string }>>({});
	const [pendingScale, setPendingScale] = useState<any>(null);
	const [pendingDyno, setPendingDyno] = useState<string>('');
	const [restartingAll, setRestartingAll] = useState(false);

	const formation = data?.formation || [];
	const dynos = data?.dynos || [];

	// Seed the editable fields from the server once the formation arrives, and
	// again whenever it changes underneath us after a successful scale.
	useEffect(() => {
		if (!formation.length) return;

		setEdits(
			formation.reduce((acc: any, item: any) => {
				acc[item.type] = { quantity: item.quantity, size: item.size };
				return acc;
			}, {})
		);
	}, [data]);

	const dirty = (type: string) => {
		const current = formation.find((item: any) => item.type === type);
		const edit = edits[type];
		if (!current || !edit) return false;
		return current.quantity !== edit.quantity || current.size !== edit.size;
	};

	const onScale = async () => {
		const result = await scale({
			id,
			app,
			updates: [
				{
					type: pendingScale.type,
					quantity: edits[pendingScale.type].quantity,
					size: edits[pendingScale.type].size,
				},
			],
		});
		if ('error' in result) return;
		setPendingScale(null);
	};

	const onRestartDyno = async () => {
		const result = await restartDyno({ id, app, dyno: pendingDyno });
		if ('error' in result) return;
		setPendingDyno('');
	};

	const onRestartAll = async () => {
		const result = await restartApp({ id, app });
		if ('error' in result) return;
		setRestartingAll(false);
	};

	if (isFetching && !data) return <TableSkeleton rows={5} cols={4} />;
	if (isError) return <ErrorState error={error} onRetry={refetch} />;

	return (
		<Flex direction='column' gap={6}>
			<Panel
				flush
				title='Formation'
				subtitle='How many dynos of each process type should be running, and at what size.'>
				{formation.length === 0 ? (
					<EmptyState
						title='No process types'
						description='This app has no Procfile entries, so there is nothing to scale.'
					/>
				) : (
					<DataTable<any>
						rows={formation}
						rowKey={item => item.type}
						columns={[
							{
								key: 'type',
								label: 'Process',
								render: item => (
									<Text fontSize='13px' fontWeight='600' fontFamily='mono'>
										{item.type}
									</Text>
								),
							},
							{
								key: 'quantity',
								label: 'Quantity',
								width: '110px',
								render: item => (
									<Input
										size='xs'
										type='number'
										min={0}
										max={100}
										w='70px'
										borderRadius={radius.INPUT}
										value={edits[item.type]?.quantity ?? item.quantity}
										onChange={event =>
											setEdits(prev => ({
												...prev,
												[item.type]: {
													...prev[item.type],
													quantity: Number(event.target.value),
												},
											}))
										}
									/>
								),
							},
							{
								key: 'size',
								label: 'Size',
								width: '160px',
								render: item => (
									<Dropdown
										size='xs'
										w='150px'
										borderRadius={radius.INPUT}
										value={edits[item.type]?.size ?? item.size}
										onChange={v => setEdits(prev => ({
												...prev,
												[item.type]: { ...prev[item.type], size: v },
											}))
										}>
										{Array.from(new Set([item.size, ...DYNO_SIZES])).map(size => (
											<option key={size} value={size}>
												{size}
											</option>
										))}
									</Dropdown>
								),
							},
							{
								key: 'command',
								label: 'Command',
								render: item => (
									<Text fontSize='12px' fontFamily='mono' color='fg.muted' truncate>
										{item.command}
									</Text>
								),
							},
						]}
						rowActions={item =>
							dirty(item.type) ? (
								<Button size='2xs' onClick={() => setPendingScale(item)}>
									Save
								</Button>
							) : null
						}
					/>
				)}
			</Panel>

			<Panel
				flush
				title={`Dynos (${dynos.length})`}
				actions={
					<Button
						size='sm'
						variant='outline'
						disabled={dynos.length === 0}
						onClick={() => setRestartingAll(true)}>
						Restart all
					</Button>
				}>
				{dynos.length === 0 ? (
					<EmptyState
						title='Nothing running'
						description='Scale a process type above to start a dyno.'
					/>
				) : (
					<DataTable<any>
						rows={dynos}
						rowKey={dyno => dyno.id}
						columns={[
							{
								key: 'name',
								label: 'Dyno',
								render: dyno => (
									<Text fontSize='13px' fontWeight='600' fontFamily='mono'>
										{dyno.name}
									</Text>
								),
							},
							{ key: 'state', label: 'State', render: dyno => <StatusDot state={dyno.state} /> },
							{ key: 'size', label: 'Size', render: dyno => dyno.size },
							{
								key: 'release',
								label: 'Release',
								render: dyno => (dyno.releaseVersion ? `v${dyno.releaseVersion}` : '—'),
							},
							{ key: 'uptime', label: 'Up', numeric: true, render: dyno => uptime(dyno.updatedAt) },
						]}
						rowActions={dyno => (
							<Button size='2xs' variant='ghost' onClick={() => setPendingDyno(dyno.name)}>
								Restart
							</Button>
						)}
					/>
				)}
			</Panel>

			<ConfirmAction
				isOpen={!!pendingScale}
				onClose={() => setPendingScale(null)}
				onConfirm={onScale}
				title={`Scale ${pendingScale?.type ?? ''}`}
				confirmLabel='Apply'
				isLoading={scaleResult.isLoading}
				consequence={
					<>
						{pendingScale &&
							`${pendingScale.type} goes to ${edits[pendingScale.type]?.quantity} × ${edits[pendingScale.type]?.size}. `}
						Scaling up is billed immediately and by the second, and paid dyno sizes need a verified
						Heroku account.
					</>
				}
			/>

			<ConfirmAction
				isOpen={!!pendingDyno}
				onClose={() => setPendingDyno('')}
				onConfirm={onRestartDyno}
				title={`Restart ${pendingDyno}`}
				confirmLabel='Restart'
				isLoading={restartDynoResult.isLoading}
				consequence={`${pendingDyno} stops and is replaced. Requests it is serving right now will fail.`}
			/>

			<ConfirmAction
				isOpen={restartingAll}
				onClose={() => setRestartingAll(false)}
				onConfirm={onRestartAll}
				title={`Restart all dynos on ${app}`}
				confirmLabel='Restart all'
				destructive
				typeToConfirm={app}
				isLoading={restartAppResult.isLoading}
				consequence={`Every dyno on ${app} stops and restarts. The app will be briefly unavailable.`}
			/>

			<Toast
				isError={scaleResult.isError || restartDynoResult.isError || restartAppResult.isError}
				error={scaleResult.error || restartDynoResult.error || restartAppResult.error}
			/>
			<Toast
				isSuccess={scaleResult.isSuccess || restartDynoResult.isSuccess || restartAppResult.isSuccess}
				successTitle='Done'
				successText='Heroku is applying the change.'
			/>
		</Flex>
	);
};

export default DynosTab;
