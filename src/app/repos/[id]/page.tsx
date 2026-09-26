'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge, Button, Flex } from '@chakra-ui/react';
import { ExternalLink, Github, Link2 } from 'lucide-react';
import { useGetByIdQuery } from '@/components/library';
import {
	Panel,
	CopyValue,
	DetailRow,
	ErrorState,
	DetailSkeleton,
	EmptyState,
} from '@/components/library/cl';
import RecordView from '@/app/view/_components/RecordView';
import LinkHostingModal from '../_components/LinkHostingModal';
import { projectHref, platformLabel, accountEmail } from '../_components/hosting';

const URL_FIELDS = [
	{ key: 'liveUrl', label: 'Live' },
	{ key: 'prodUrl', label: 'Production' },
	{ key: 'testUrl', label: 'Test' },
	{ key: 'devUrl', label: 'Development' },
	{ key: 'domain', label: 'Domain' },
];

const LinkedValue = ({ value }: { value?: string }) =>
	value ? (
		<Flex
			align='center'
			gap={2}
			minW={0}>
			<CopyValue
				value={value}
				display={value.replace(/^https?:\/\//, '')}
				mono={false}
			/>
			<a
				href={value}
				target='_blank'
				rel='noreferrer'
				aria-label='Open'>
				<ExternalLink size={13} />
			</a>
		</Flex>
	) : null;

/**
 * The repo page: its hosting console as the first tab, then the same
 * Overview, linked-record tabs and History every record's page has
 * (RecordView), so the table's "Open" loses nothing by landing here instead
 * of /view/repos/<id>. The record's plain fields — client, category, stack,
 * notes — are Overview's; this tab is what only a repo has.
 */
const RepoPage = () => {
	const params = useParams();
	const router = useRouter();
	const id = String(params?.id || '');

	const [linking, setLinking] = useState(false);

	const { data: repo, isLoading, isError, error, refetch } = useGetByIdQuery(
		{ path: 'repos', id },
		{ skip: !id }
	);

	const href = repo ? projectHref(repo) : null;
	const urls = repo ? URL_FIELDS.filter(field => repo[field.key]) : [];

	const hosting = isError ? (
		<ErrorState
			error={error}
			onRetry={refetch}
		/>
	) : isLoading || !repo ? (
		<DetailSkeleton />
	) : (
		<Flex
			direction='column'
			gap={6}
			pb={8}>
			<Panel
				title='Hosting'
				actions={
					<Button
						size='xs'
						variant='ghost'
						onClick={() => setLinking(true)}>
						{href ? 'Change' : 'Link'}
					</Button>
				}>
				{!repo.hostedPlatform ? (
					<EmptyState
						title='Not linked to a hosting account'
						description='Link this repo to the Vercel or Heroku project it deploys to, and its console is one click from here.'
					/>
				) : (
					<Flex
						direction='column'
						gap={3}>
						<DetailRow
							label='Platform'
							value={platformLabel(repo.hostedPlatform)}
						/>
						<DetailRow
							label='Account'
							value={repo.hostingAccount ? accountEmail(repo.hostingAccount) : 'Unavailable'}
						/>
						<DetailRow
							label={repo.hostedPlatform === 'heroku' ? 'App' : 'Project'}
							value={repo.hostedProjectName}
						/>
						<DetailRow
							label='Hosting note'
							value={repo.hostingServer}
						/>
					</Flex>
				)}
			</Panel>

			<Panel title='Environments'>
				{!urls.length && !repo.githubUrl ? (
					<EmptyState title='No URLs recorded' />
				) : (
					<Flex
						direction='column'
						gap={3}>
						<DetailRow
							label='Repository'
							value={repo.githubUrl ? <LinkedValue value={repo.githubUrl} /> : undefined}
						/>
						{urls.map(field => (
							<DetailRow
								key={field.key}
								label={field.label}
								value={<LinkedValue value={repo[field.key]} />}
							/>
						))}
					</Flex>
				)}
			</Panel>
		</Flex>
	);

	return (
		<RecordView
			slug='repos'
			id={id}
			title={repo?.name}
			badge={
				repo?.hostedPlatform ? (
					<Badge
						size='sm'
						colorPalette={repo.hostedPlatform === 'vercel' ? 'gray' : 'purple'}>
						{platformLabel(repo.hostedPlatform)}
					</Badge>
				) : undefined
			}
			meta={
				repo ? (
					<>
						{repo.category}
						{repo.projectType && ` · ${repo.projectType}`}
						{repo.project?.name && ` · ${repo.project.name}`}
						{repo.status && ` · ${repo.status}`}
					</>
				) : undefined
			}
			actions={
				repo && (
					<>
						{repo.githubUrl && (
							<Button
								size='sm'
								variant='outline'
								asChild>
								<a
									href={repo.githubUrl}
									target='_blank'
									rel='noreferrer'>
									<Github size={14} />
									Repository
								</a>
							</Button>
						)}

						{/* Only when the link is complete enough to resolve to a
							real console page — a half-link would 404 and read as
							a missing project rather than a missing link. */}
						{href && (
							<Button
								size='sm'
								variant='outline'
								onClick={() => router.push(href)}>
								View project
							</Button>
						)}

						<Button
							size='sm'
							variant={href ? 'outline' : 'solid'}
							onClick={() => setLinking(true)}>
							<Link2 size={14} />
							{href ? 'Change link' : 'Link project'}
						</Button>
					</>
				)
			}
			tabs={[{ value: 'hosting', label: 'Hosting', content: hosting }]}>
			{repo && (
				<LinkHostingModal
					repoId={id}
					repo={repo}
					isOpen={linking}
					onClose={() => setLinking(false)}
				/>
			)}
		</RecordView>
	);
};

export default RepoPage;
