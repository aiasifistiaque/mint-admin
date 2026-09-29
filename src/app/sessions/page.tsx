'use client';

import { FC, useEffect, useState } from 'react';
import { Badge, Box, Button, Flex, IconButton, Link, Text } from '@chakra-ui/react';
import { ExternalLink, LogOut, UserX } from 'lucide-react';
import {
	AdminSessionView,
	Layout,
	PromptDialog,
	logout,
	useAppDispatch,
	useGetAllSessionsQuery,
	useSignOutAdminSessionsMutation,
	useSignOutAnySessionMutation,
} from '@/components/library';
import { ConsoleTabs, DataTable, EmptyState, ErrorState, FilterInput, PageHeader, Panel, TableSkeleton } from '@/components/library/cl';
import type { Column } from '@/components/library/cl/DataTable';
import { DeviceIcon, ago, deviceLabel, methodLabel, when } from '@/components/library/components/sessions/sessionView';
import { toaster } from '@/components/ui/toaster';

type Status = 'active' | 'signed-out' | 'all';
const LIMIT = 50;

const DocLink: FC = () => (
	<Link
		href='/docs/two-factor#all-sessions'
		target='_blank'
		rel='noreferrer'
		fontSize='12px'
		color='fg.muted'
		display='inline-flex'
		alignItems='center'
		gap={1}
		_hover={{ color: 'fg' }}>
		How this works
		<ExternalLink size={11} />
	</Link>
);

type Target = { kind: 'session'; s: AdminSessionView } | { kind: 'admin'; s: AdminSessionView };

/**
 * Login sessions — every admin's signed-in devices, for super admins (`*`) or
 * roles with the Login sessions permission (view-sessions to see them,
 * delete-sessions to sign them out): who is signed in where, when they were last
 * active, and signing a device (or all of one admin's) out. A signed-out
 * device's next request is refused and it lands on the login page.
 */
const SessionsPage = () => {
	const dispatch = useAppDispatch();
	const [status, setStatus] = useState<Status>('active');
	const [typed, setTyped] = useState('');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [target, setTarget] = useState<Target | null>(null);

	// The search runs on the server (admins' names and emails, devices, IPs).
	useEffect(() => {
		const t = setTimeout(() => {
			setSearch(typed.trim());
			setPage(1);
		}, 300);
		return () => clearTimeout(t);
	}, [typed]);

	const { data, isLoading, isFetching, error } = useGetAllSessionsQuery({ status, search: search || undefined, page, limit: LIMIT });
	const [signOutOne, one] = useSignOutAnySessionMutation();
	const [signOutAdmin, all] = useSignOutAdminSessionsMutation();

	const rows = data?.doc || [];
	const total = data?.total || 0;
	const pages = Math.max(1, Math.ceil(total / LIMIT));

	const confirm = async () => {
		if (!target) return;
		try {
			if (target.kind === 'session') {
				const r = await signOutOne(target.s._id).unwrap();
				if (r.current) return void dispatch(logout());
				toaster.create({ type: 'success', title: `Signed out ${target.s.admin?.name || 'the admin'} on ${deviceLabel(target.s)}` });
			} else {
				const r = await signOutAdmin(target.s.admin!._id).unwrap();
				toaster.create({ type: 'success', title: `${target.s.admin?.name || 'The admin'}: ${r.message.toLowerCase()}` });
			}
			setTarget(null);
		} catch (e: any) {
			toaster.create({ type: 'error', title: 'Couldn’t sign out', description: e?.data?.message });
		}
	};

	const columns: Column<AdminSessionView>[] = [
		{
			key: 'admin',
			label: 'Admin',
			render: s => (
				<Box minW={0}>
					<Flex
						align='center'
						gap={2}>
						<Text
							fontSize='13px'
							fontWeight='500'
							truncate>
							{s.admin?.name || 'Unknown admin'}
						</Text>
						{s.current && (
							<Badge
								size='xs'
								colorPalette='green'>
								You, here
							</Badge>
						)}
					</Flex>
					<Text
						fontSize='12px'
						color='fg.muted'
						truncate>
						{s.admin?.email}
						{s.admin?.role ? ` · ${s.admin.role}` : ''}
					</Text>
				</Box>
			),
		},
		{
			key: 'device',
			label: 'Device',
			render: s => (
				<Flex
					align='center'
					gap={2.5}
					title={methodLabel(s.method)}>
					<Box color='fg.muted'>
						<DeviceIcon type={s.deviceType} />
					</Box>
					<Box minW={0}>
						<Text fontSize='13px'>{deviceLabel(s)}</Text>
						<Text
							fontSize='12px'
							color='fg.muted'>
							{methodLabel(s.method)}
						</Text>
					</Box>
				</Flex>
			),
		},
		{ key: 'ip', label: 'IP address', render: s => <Text fontSize='13px' fontFamily='mono'>{s.ip || '—'}</Text> },
		{ key: 'signedIn', label: 'Signed in', render: s => <Text fontSize='13px' title={when(s.signedInAt)}>{ago(s.signedInAt)}</Text> },
		{
			key: 'lastActive',
			label: 'Last active',
			render: s => (
				<Flex
					align='center'
					gap={1.5}
					title={when(s.lastActiveAt)}>
					{s.online && (
						<Box
							w='7px'
							h='7px'
							borderRadius='full'
							bg='green.solid'
						/>
					)}
					<Text fontSize='13px'>{s.online ? 'Active now' : ago(s.lastActiveAt)}</Text>
				</Flex>
			),
		},
		{
			key: 'status',
			label: 'Status',
			render: s =>
				s.revokedAt ? (
					<Box title={when(s.revokedAt)}>
						<Text
							fontSize='13px'
							color='fg.muted'>
							Signed out {ago(s.revokedAt)}
						</Text>
						<Text
							fontSize='12px'
							color='fg.subtle'>
							{s.revokedBy?.name ? `by ${s.revokedBy.name}` : s.revokeReason}
						</Text>
					</Box>
				) : (
					<Badge
						size='sm'
						colorPalette='green'
						variant='subtle'>
						Signed in
					</Badge>
				),
		},
	];

	return (
		<Layout
			title='Login sessions'
			path='sessions'>
			<Flex
				direction='column'
				gap={6}
				pb={16}>
				<PageHeader
					breadcrumbs={[
						{ href: '/dashboard', title: 'Home' },
						{ href: '/sessions', title: 'Login sessions' },
					]}
					title='Login sessions'
					meta={
						data ? (
							<>
								{data.summary.activeSessions} signed-in device{data.summary.activeSessions === 1 ? '' : 's'} · {data.summary.adminsOnline} admin
								{data.summary.adminsOnline === 1 ? '' : 's'} active in the last 5 minutes · <DocLink />
							</>
						) : (
							<DocLink />
						)
					}
				/>

				<ConsoleTabs
					tabs={[
						{ value: 'active', label: 'Signed in' },
						{ value: 'signed-out', label: 'Signed out' },
						{ value: 'all', label: 'All' },
					]}
					value={status}
					onChange={v => {
						setStatus(v as Status);
						setPage(1);
					}}>
					<Panel
						flush
						title={status === 'active' ? 'Signed-in devices' : status === 'signed-out' ? 'Signed-out sessions' : 'All sessions'}
						subtitle={isFetching && !isLoading ? 'Updating…' : `${total.toLocaleString()} session${total === 1 ? '' : 's'}`}
						actions={
							<FilterInput
								value={typed}
								onChange={setTyped}
								placeholder='Search admin, device or IP'
								width='260px'
							/>
						}>
						{isLoading ? (
							<Box p={4}>
								<TableSkeleton
									rows={6}
									cols={6}
								/>
							</Box>
						) : error ? (
							<Box p={4}>
								<ErrorState error={error} />
							</Box>
						) : !rows.length ? (
							<Box p={4}>
								<EmptyState
									title={search ? 'No sessions match' : status === 'signed-out' ? 'No signed-out sessions yet' : 'Nobody is signed in'}
									description={search ? 'Try an admin’s name or email, a browser, or an IP address.' : undefined}
								/>
							</Box>
						) : (
							<DataTable
								columns={columns}
								rows={rows}
								rowKey={s => s._id}
								rowActions={s =>
									s.revokedAt ? null : (
										<Flex gap={1}>
											<IconButton
												aria-label='Sign out this device'
												title='Sign out this device'
												size='xs'
												variant='ghost'
												onClick={() => setTarget({ kind: 'session', s })}>
												<LogOut size={14} />
											</IconButton>
											{s.admin?._id && (
												<IconButton
													aria-label={`Sign out all of ${s.admin.name}'s devices`}
													title='Sign out all of this admin’s devices'
													size='xs'
													variant='ghost'
													color='red.fg'
													onClick={() => setTarget({ kind: 'admin', s })}>
													<UserX size={14} />
												</IconButton>
											)}
										</Flex>
									)
								}
							/>
						)}
						{pages > 1 && (
							<Flex
								justify='space-between'
								align='center'
								px={4}
								py={3}
								borderTopWidth='1px'
								borderColor='border.muted'>
								<Text
									fontSize='12px'
									color='fg.muted'>
									Page {page} of {pages}
								</Text>
								<Flex gap={2}>
									<Button
										size='xs'
										variant='outline'
										disabled={page <= 1}
										onClick={() => setPage(p => p - 1)}>
										Previous
									</Button>
									<Button
										size='xs'
										variant='outline'
										disabled={page >= pages}
										onClick={() => setPage(p => p + 1)}>
										Next
									</Button>
								</Flex>
							</Flex>
						)}
					</Panel>
				</ConsoleTabs>
			</Flex>

			<PromptDialog
				open={!!target}
				onClose={() => setTarget(null)}
				onConfirm={confirm}
				tone='warning'
				title={target?.kind === 'admin' ? `Sign out all of ${target.s.admin?.name || 'this admin'}’s devices?` : 'Sign out this device?'}
				description={
					target?.kind === 'admin'
						? 'Every device they’re signed in on is signed out straight away. They can sign in again with their password (and two-factor, if it’s on).'
						: target?.s.current
						? 'This is your own session on this browser — you’ll go to the login page.'
						: 'It’s signed out straight away; its next click goes to the login page.'
				}
				subject={target ? `${target.s.admin?.name || ''}${target.kind === 'session' ? ` · ${deviceLabel(target.s)}` : ''}` : undefined}
				confirmLabel='Sign out'
				loading={one.isLoading || all.isLoading}
				aside={<DocLink />}
			/>
		</Layout>
	);
};

export default SessionsPage;
