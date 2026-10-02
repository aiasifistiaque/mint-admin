'use client';

import { useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import {
	Toast,
	VSelect,
	useGetAllQuery,
	useSetRepoHostingMutation,
	useGetVercelProjectsQuery,
	useGetHerokuAppsQuery,
} from '@/components/library';
import { ConfirmAction } from '@/components/library/cl';
import { PLATFORMS, Platform, accountPath, accountEmail } from './hosting';

type Props = {
	repoId: string;
	repo: any;
	isOpen: boolean;
	onClose: () => void;
};

/**
 * Link a repo to a project on a hosting console.
 *
 * Three dependent choices — platform, then an account on it, then a project in
 * that account — which is why this is a dialog and not fields on the generic
 * create/edit form. Each step's options come from a request that cannot be made
 * until the step before it is answered, and the form builder has no way to
 * express that.
 *
 * All five stored fields are written in one PUT. A repo with a platform but no
 * project is a half-link that every screen would then have to special-case.
 */
const LinkHostingModal = ({ repoId, repo, isOpen, onClose }: Props) => {
	const [platform, setPlatform] = useState<Platform | ''>(repo?.hostedPlatform || '');
	const [accountId, setAccountId] = useState<string>(
		repo?.hostingAccount?._id || repo?.hostingAccount || ''
	);
	const [projectRef, setProjectRef] = useState<string>(repo?.hostedProjectId || '');

	// Reopening after a change should show what is stored, not what was typed
	// into a dialog that was dismissed.
	useEffect(() => {
		if (!isOpen) return;
		setPlatform(repo?.hostedPlatform || '');
		setAccountId(repo?.hostingAccount?._id || repo?.hostingAccount || '');
		setProjectRef(repo?.hostedProjectId || '');
	}, [isOpen, repo]);

	const { data: accountsData, isFetching: accountsFetching } = useGetAllQuery(
		{ path: platform ? accountPath(platform as Platform) : '', limit: 100 },
		{ skip: !platform }
	);

	const accounts = accountsData?.doc || accountsData?.docs || [];

	const { data: vercelProjects, isFetching: vercelFetching } = useGetVercelProjectsQuery(
		{ id: accountId },
		{ skip: platform !== 'vercel' || !accountId }
	);

	const { data: herokuApps, isFetching: herokuFetching } = useGetHerokuAppsQuery(
		{ id: accountId },
		{ skip: platform !== 'heroku' || !accountId }
	);

	const projects =
		platform === 'vercel'
			? (vercelProjects?.projects || []).map((p: any) => ({
					id: p.id,
					name: p.name,
					hint: p.framework,
				}))
			: (herokuApps?.apps || []).map((a: any) => ({
					id: a.id,
					name: a.name,
					hint: a.region,
				}));

	const projectsFetching = vercelFetching || herokuFetching;
	const chosen = projects.find((p: any) => p.id === projectRef);

	const [setHosting, result] = useSetRepoHostingMutation();

	const save = async () => {
		await setHosting({
			id: repoId,
			hostedPlatform: platform,
			hostingAccount: accountId,
			hostedProjectId: chosen?.id || '',
			// Stored alongside the id because the console routes are built from
			// the name, and a link should still read when the account record is
			// unreachable.
			hostedProjectName: chosen?.name || '',
		});

		onClose();
	};

	// An empty platform is the server's signal to `$unset` the whole set.
	const unlink = async () => {
		await setHosting({ id: repoId, hostedPlatform: '' });
		onClose();
	};

	return (
		<>
			<ConfirmAction
				isOpen={isOpen}
				onClose={onClose}
				onConfirm={save}
				title='Link a hosted project'
				consequence='This records which account and project this repo is deployed to. It changes nothing on the platform itself.'
				confirmLabel={chosen ? `Link to ${chosen.name}` : 'Link'}
				// Nothing partial gets sent: the server refuses a half-link, and
				// the button should not look like it would work either.
				isLoading={result.isLoading}>
				<Flex
					direction='column'
					gap={3}>
					<VSelect
						label='Platform'
						placeholder='Select a platform'
						defaultDisabled
						value={platform}
						onChange={(event: any) => {
							setPlatform(event.target.value as Platform);
							// The account and project belong to the old platform;
							// keeping them would submit a link pointing at the wrong
							// console.
							setAccountId('');
							setProjectRef('');
						}}>
						{PLATFORMS.map(option => (
							<option
								key={option.value}
								value={option.value}>
								{option.label}
							</option>
						))}
					</VSelect>

					{!!platform && (
						<VSelect
							label='Account'
							placeholder='Select an account'
							defaultDisabled
							value={accountId}
							disabled={accountsFetching || !accounts.length}
							helper={
								accountsFetching
									? 'Loading accounts…'
									: !accounts.length
										? 'No accounts connected on this platform yet.'
										: undefined
							}
							onChange={(event: any) => {
								setAccountId(event.target.value);
								setProjectRef('');
							}}>
							{accounts.map((account: any) => (
								<option
									key={account._id}
									value={account._id}>
									{accountEmail(account)}
								</option>
							))}
						</VSelect>
					)}

					{!!accountId && (
						<VSelect
							label={platform === 'heroku' ? 'App' : 'Project'}
							placeholder={`Select ${platform === 'heroku' ? 'an app' : 'a project'}`}
							defaultDisabled
							value={projectRef}
							disabled={projectsFetching || !projects.length}
							helper={
								projectsFetching
									? 'Loading from the platform…'
									: !projects.length
										? 'This account has nothing deployed, or its token is no longer valid.'
										: undefined
							}
							onChange={(event: any) => setProjectRef(event.target.value)}>
							{projects.map((project: any) => (
								<option
									key={project.id}
									value={project.id}>
									{project.hint ? `${project.name} — ${project.hint}` : project.name}
								</option>
							))}
						</VSelect>
					)}

					{!!repo?.hostedPlatform && (
						<Text
							fontSize='xs'
							color='fg.muted'
							cursor='pointer'
							textDecoration='underline'
							onClick={unlink}>
							Remove this link
						</Text>
					)}
				</Flex>
			</ConfirmAction>

			<Toast
				isError={result.isError}
				error={result.error}
			/>
		</>
	);
};

export default LinkHostingModal;
