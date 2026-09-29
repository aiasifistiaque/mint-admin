'use client';

import { FC, useState } from 'react';
import { Badge, Box, Button, Flex, Link, Skeleton, Text } from '@chakra-ui/react';
import { ExternalLink, MonitorSmartphone } from 'lucide-react';
import {
	AdminSessionView,
	PromptDialog,
	logout,
	useAppDispatch,
	useGetMySessionsQuery,
	useSignOutOtherSessionsMutation,
	useSignOutSessionMutation,
} from '@/components/library';
import { DeviceIcon, ago, deviceLabel, methodLabel, when } from '@/components/library/components/sessions/sessionView';
import { toaster } from '@/components/ui/toaster';
import { SettingsCard } from './ui';

const COMPACT = { size: 'sm', px: 3 } as const;

const DocLink: FC<{ anchor: string }> = ({ anchor }) => (
	<Link
		href={`/docs/two-factor#${anchor}`}
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

const SessionRow: FC<{ s: AdminSessionView; onSignOut: () => void }> = ({ s, onSignOut }) => (
	<Flex
		align='center'
		gap={3}
		py={3}
		borderTopWidth='1px'
		borderColor='border.muted'
		_first={{ borderTopWidth: 0, pt: 0 }}>
		<Flex
			flexShrink={0}
			w='36px'
			h='36px'
			align='center'
			justify='center'
			borderRadius='lg'
			bg='bg.muted'
			color='fg.muted'>
			<DeviceIcon type={s.deviceType} />
		</Flex>
		<Box
			flex={1}
			minW={0}>
			<Flex
				align='center'
				gap={2}
				flexWrap='wrap'>
				<Text
					fontSize='13px'
					fontWeight='500'>
					{deviceLabel(s)}
				</Text>
				{s.current && (
					<Badge
						size='xs'
						colorPalette='green'>
						This device
					</Badge>
				)}
				{!s.current && s.online && (
					<Badge
						size='xs'
						variant='subtle'>
						Active now
					</Badge>
				)}
			</Flex>
			<Text
				fontSize='12px'
				color='fg.muted'
				title={`Signed in ${when(s.signedInAt)}${s.ip ? ` from ${s.ip}` : ''}`}>
				{s.current ? 'Active now' : `Last active ${ago(s.lastActiveAt)}`} · Signed in {ago(s.signedInAt)}
				{s.ip ? ` · ${s.ip}` : ''} · {methodLabel(s.method)}
			</Text>
		</Box>
		<Button
			{...COMPACT}
			variant='outline'
			onClick={onSignOut}>
			Sign out
		</Button>
	</Flex>
);

/**
 * Settings → Signed-in devices: where this account is signed in, when each
 * was last active, and signing one (or all the others) out. A signed-out
 * device's next request is refused and it lands on the login page.
 */
const SessionsCard: FC = () => {
	const dispatch = useAppDispatch();
	const { data, isLoading } = useGetMySessionsQuery();
	const [signOut, signingOut] = useSignOutSessionMutation();
	const [signOutOthers, signingOutOthers] = useSignOutOtherSessionsMutation();
	const [target, setTarget] = useState<AdminSessionView | 'others' | null>(null);

	const list = data?.doc || [];
	const others = list.filter(s => !s.current).length;

	const confirm = async () => {
		try {
			if (target === 'others') {
				const r = await signOutOthers().unwrap();
				toaster.create({ type: 'success', title: r.message });
			} else if (target) {
				await signOut(target._id).unwrap();
				if (target.current) {
					dispatch(logout());
					return;
				}
				toaster.create({ type: 'success', title: `Signed out ${deviceLabel(target)}` });
			}
			setTarget(null);
		} catch (e: any) {
			toaster.create({ type: 'error', title: 'Couldn’t sign out', description: e?.data?.message });
		}
	};

	return (
		<>
			<SettingsCard
				id='devices'
				icon={<MonitorSmartphone size={16} />}
				title='Signed-in devices'
				description={
					<>
						Where your account is signed in, and when each was last used. Sign out any you don’t recognise. <DocLink anchor='devices' />
					</>
				}
				note={isLoading ? '' : `${list.length} device${list.length === 1 ? '' : 's'} signed in`}
				actions={
					<Button
						{...COMPACT}
						variant='outline'
						disabled={!others}
						onClick={() => setTarget('others')}>
						Sign out other devices
					</Button>
				}>
				{isLoading ? (
					<Skeleton h='96px' />
				) : (
					<Box>
						{list.map(s => (
							<SessionRow
								key={s._id}
								s={s}
								onSignOut={() => setTarget(s)}
							/>
						))}
					</Box>
				)}
			</SettingsCard>

			<PromptDialog
				open={!!target}
				onClose={() => setTarget(null)}
				onConfirm={confirm}
				tone='warning'
				title={
					target === 'others'
						? `Sign out ${others} other device${others === 1 ? '' : 's'}?`
						: target && target.current
						? 'Sign out on this device?'
						: 'Sign out this device?'
				}
				description={
					target === 'others'
						? 'Every device except this one is signed out straight away. They’ll need your password (and two-factor, if it’s on) to sign in again.'
						: target && target.current
						? 'You’ll go to the login page.'
						: 'It’s signed out straight away — its next click goes to the login page.'
				}
				subject={target && target !== 'others' ? deviceLabel(target) : undefined}
				confirmLabel='Sign out'
				loading={signingOut.isLoading || signingOutOthers.isLoading}
				aside={<DocLink anchor='devices' />}
			/>
		</>
	);
};

export default SessionsCard;
