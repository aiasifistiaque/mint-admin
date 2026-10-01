'use client';

import { FC, FormEvent, useEffect, useState } from 'react';
import { Box, Button, Field, Flex, Grid, Input, Skeleton, Text } from '@chakra-ui/react';
import {
	Layout,
	PromptDialog,
	useGetMembersQuery,
	useGetOrganizationQuery,
	useTransferOwnershipMutation,
	useUpdateOrganizationMutation,
} from '@/components/library';
import { Dropdown, Panel } from '@/components/library/cl';
import { useWorkspace } from '@/components/library/tenant';
import { GOALS, HEARD_FROM, INDUSTRIES, TEAM_SIZES } from '@/components/library/tenant/onboarding';
import type { Onboarding } from '@/components/library/store/services/tenantApi';

/**
 * The organization's settings (tenant panel): its name, the answers about the
 * business given at sign-up (editable), and — for the owner — handing
 * ownership to another member. Needs `manage-organization` to change.
 */

const errorText = (e: any) => e?.data?.message || 'Something went wrong — try again.';

const Details: FC = () => {
	const { data: org, isLoading } = useGetOrganizationQuery();
	const { can } = useWorkspace();
	const [save, { isLoading: saving, error, isSuccess, reset }] = useUpdateOrganizationMutation();
	const [name, setName] = useState('');
	const [about, setAbout] = useState<Onboarding>({});
	const editable = can('manage-organization');

	useEffect(() => {
		if (!org) return;
		setName(org.name);
		setAbout(org.onboarding || {});
	}, [org?._id]);

	const set = (k: keyof Onboarding) => (v: any) => {
		reset();
		setAbout(a => ({ ...a, [k]: v }));
	};

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		const { businessName, industry, teamSize, role, website, country, heardFrom, heardFromOther, goals } = about;
		await save({
			name: name.trim(),
			onboarding: { businessName, industry, teamSize, role, website, country, heardFrom, heardFromOther, goals: goals || [] },
		});
	};

	if (isLoading || !org)
		return (
			<Panel title='Organization'>
				<Skeleton h='180px' />
			</Panel>
		);

	return (
		<Panel
			title='Organization'
			subtitle={`${org.counts?.members ?? 0} members · ${org.counts?.projects ?? 0} projects`}>
			<form onSubmit={submit}>
				<fieldset disabled={!editable}>
					<Flex
						direction='column'
						gap={4}>
						<Grid
							templateColumns={{ base: '1fr', md: '1fr 1fr' }}
							gap={3}>
							<Field.Root required>
								<Field.Label {...labelCss}>Name</Field.Label>
								<Input
									size='sm'
									value={name}
									maxLength={120}
									onChange={e => {
										reset();
										setName(e.target.value);
									}}
								/>
							</Field.Root>
							<Field.Root>
								<Field.Label {...labelCss}>Business name</Field.Label>
								<Input
									size='sm'
									value={about.businessName || ''}
									onChange={e => set('businessName')(e.target.value)}
								/>
							</Field.Root>
							<Box>
								<Text {...labelCss}>Industry</Text>
								<Box mt={1.5}>
									<Dropdown
										size='sm'
										value={about.industry || ''}
										onChange={set('industry')}
										items={INDUSTRIES}
										placeholder='Not set'
										disabled={!editable}
									/>
								</Box>
							</Box>
							<Box>
								<Text {...labelCss}>Team size</Text>
								<Box mt={1.5}>
									<Dropdown
										size='sm'
										value={about.teamSize || ''}
										onChange={set('teamSize')}
										items={TEAM_SIZES}
										placeholder='Not set'
										disabled={!editable}
									/>
								</Box>
							</Box>
							<Field.Root>
								<Field.Label {...labelCss}>Website</Field.Label>
								<Input
									size='sm'
									value={about.website || ''}
									placeholder='https://'
									onChange={e => set('website')(e.target.value)}
								/>
							</Field.Root>
							<Field.Root>
								<Field.Label {...labelCss}>Country</Field.Label>
								<Input
									size='sm'
									value={about.country || ''}
									onChange={e => set('country')(e.target.value)}
								/>
							</Field.Root>
							<Box>
								<Text {...labelCss}>Heard about us from</Text>
								<Box mt={1.5}>
									<Dropdown
										size='sm'
										value={about.heardFrom || ''}
										onChange={set('heardFrom')}
										items={HEARD_FROM}
										placeholder='Not set'
										disabled={!editable}
									/>
								</Box>
							</Box>
							<Box>
								<Text {...labelCss}>Building</Text>
								<Flex
									mt={1.5}
									wrap='wrap'
									gap={1.5}>
									{GOALS.map(g => {
										const on = (about.goals || []).includes(g.value);
										return (
											<Box
												key={g.value}
												as='button'
												// @ts-ignore — Box as button
												type='button'
												aria-pressed={on}
												disabled={!editable}
												onClick={() => set('goals')(on ? (about.goals || []).filter(x => x !== g.value) : [...(about.goals || []), g.value])}
												px={2.5}
												h='26px'
												borderRadius='full'
												borderWidth='1px'
												borderColor={on ? 'accent.solid' : 'border'}
												bg={on ? 'accent.solid' : 'bg.panel'}
												color={on ? 'accent.contrast' : 'fg'}
												fontSize='12px'
												cursor={editable ? 'pointer' : 'default'}>
												{g.label}
											</Box>
										);
									})}
								</Flex>
							</Box>
						</Grid>
						{editable && (
							<Flex
								align='center'
								justify='flex-end'
								gap={3}>
								{error && (
									<Text
										fontSize='13px'
										color='red.fg'>
										{errorText(error)}
									</Text>
								)}
								{isSuccess && (
									<Text
										fontSize='13px'
										color='fg.muted'>
										Saved
									</Text>
								)}
								<Button
									type='submit'
									size='sm'
									loading={saving}
									disabled={!name.trim()}>
									Save
								</Button>
							</Flex>
						)}
					</Flex>
				</fieldset>
			</form>
		</Panel>
	);
};

const Ownership: FC = () => {
	const { role, self } = useWorkspace();
	const { data: members } = useGetMembersQuery();
	const [transfer, { isLoading, error, reset }] = useTransferOwnershipMutation();
	const [member, setMember] = useState('');
	const [confirm, setConfirm] = useState(false);
	if (role?.system !== 'owner') return null;
	const others = (members?.doc || []).filter(m => m.user?._id !== self?._id);
	const chosen = others.find(m => m._id === member);

	return (
		<Panel
			title='Ownership'
			subtitle='The owner can delete projects with data and hand the organization over.'>
			{others.length ? (
				<Flex
					gap={2}
					align='center'
					wrap='wrap'>
					<Box
						flex={1}
						minW='220px'>
						<Dropdown
							size='sm'
							value={member}
							onChange={setMember}
							placeholder='Choose the new owner'
							items={others.map(m => ({ value: m._id, label: `${m.user?.name} — ${m.user?.email}` }))}
						/>
					</Box>
					<Button
						size='sm'
						variant='outline'
						disabled={!member}
						onClick={() => setConfirm(true)}>
						Transfer ownership
					</Button>
				</Flex>
			) : (
				<Text
					fontSize='13px'
					color='fg.muted'>
					Invite someone first — ownership can only go to a member.
				</Text>
			)}
			<PromptDialog
				open={confirm}
				onClose={() => {
					setConfirm(false);
					reset();
				}}
				onConfirm={async () => {
					const res = await transfer({ member });
					if ('data' in res) window.location.href = '/org/settings';
				}}
				tone='warning'
				title={`Make ${chosen?.user?.name} the owner?`}
				description={error ? errorText(error) : 'You become an Admin. Only the new owner can give it back.'}
				subject={chosen?.user?.email}
				confirmLabel='Transfer'
				loading={isLoading}
			/>
		</Panel>
	);
};

export default function OrgSettingsPage() {
	return (
		<Layout
			title='Organization'
			path='org-settings'>
			<Flex
				direction='column'
				gap={4}
				pt={2}>
				<Details />
				<Ownership />
			</Flex>
		</Layout>
	);
}

const labelCss: any = { fontSize: '13px', fontWeight: '600', m: 0 };
