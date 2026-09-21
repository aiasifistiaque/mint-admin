'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge, Button, Flex, Text } from '@chakra-ui/react';
import { ExternalLink, Github, Link2 } from 'lucide-react';
import { Layout, useGetByIdQuery } from '@/components/library';
import {
	Panel,
	PageHeader,
	CopyValue,
	DetailRow,
	ErrorState,
	DetailSkeleton,
	EmptyState,
	date,
} from '@/components/library/cl';
import LinkHostingModal from '../_components/LinkHostingModal';
import { projectHref, platformLabel, accountEmail } from '../_components/hosting';

const URL_FIELDS = [
	{ key: 'liveUrl', label: 'Live' },
	{ key: 'prodUrl', label: 'Production' },
	{ key: 'testUrl', label: 'Test' },
	{ key: 'devUrl', label: 'Development' },
	{ key: 'domain', label: 'Domain' },
];

const TAG_FIELDS = [
	{ key: 'frameworks', label: 'Frameworks' },
	{ key: 'libraries', label: 'Libraries' },
	{ key: 'technologies', label: 'Technologies' },
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
 * The repo detail page, built from the same console kit as the Heroku and
 * Vercel project pages so a repo and the thing it deploys to read as one
 * system rather than two tools.
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

	if (isError) {
		return (
			<Layout
				title='Repo'
				path='repos'>
				<Flex
					direction='column'
					pt={5}>
					<ErrorState
						error={error}
						onRetry={refetch}
					/>
				</Flex>
			</Layout>
		);
	}

	if (isLoading || !repo) {
		return (
			<Layout
				title='Loading…'
				path='repos'>
				<Flex
					direction='column'
					gap={6}
					pt={{ base: 3, md: 5 }}>
					<DetailSkeleton />
				</Flex>
			</Layout>
		);
	}

	const href = projectHref(repo);
	const urls = URL_FIELDS.filter(field => repo[field.key]);

	return (
		<Layout
			title={repo.name}
			path='repos'>
			<Flex
				direction='column'
				gap={6}
				pt={{ base: 3, md: 5 }}
				pb={8}>
				<PageHeader
					breadcrumbs={[
						{ href: '/dashboard', title: 'Home' },
						{ href: '/repos', title: 'Repos' },
						{ href: `/repos/${id}`, title: repo.name },
					]}
					title={repo.name}
					badge={
						repo.hostedPlatform ? (
							<Badge
								size='sm'
								colorPalette={repo.hostedPlatform === 'vercel' ? 'gray' : 'purple'}>
								{platformLabel(repo.hostedPlatform)}
							</Badge>
						) : undefined
					}
					meta={
						<>
							{repo.category}
							{repo.projectType && ` · ${repo.projectType}`}
							{repo.project?.name && ` · ${repo.project.name}`}
							{repo.status && ` · ${repo.status}`}
						</>
					}
					actions={
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
					}
				/>

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
								value={
									repo.hostingAccount ? accountEmail(repo.hostingAccount) : 'Unavailable'
								}
							/>
							<DetailRow
								label={repo.hostedPlatform === 'heroku' ? 'App' : 'Project'}
								value={repo.hostedProjectName}
							/>
						</Flex>
					)}
				</Panel>

				<Panel title='Details'>
					<Flex
						direction='column'
						gap={3}>
						<DetailRow
							label='Client'
							value={repo.client?.name || repo.clientName}
						/>
						<DetailRow
							label='Project'
							value={repo.project?.name}
						/>
						<DetailRow
							label='Category'
							value={repo.category}
						/>
						<DetailRow
							label='Type'
							value={repo.projectType}
						/>
						<DetailRow
							label='Status'
							value={repo.status}
						/>
						<DetailRow
							label='Hosting note'
							value={repo.hostingServer}
						/>
						<DetailRow
							label='Repository'
							value={repo.githubUrl ? <LinkedValue value={repo.githubUrl} /> : undefined}
						/>
						<DetailRow
							label='Created'
							value={date(repo.createdAt)}
						/>
					</Flex>
				</Panel>

				<Panel title='Environments'>
					{!urls.length ? (
						<EmptyState title='No URLs recorded' />
					) : (
						<Flex
							direction='column'
							gap={3}>
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

				<Panel title='Stack'>
					<Flex
						direction='column'
						gap={3}>
						{TAG_FIELDS.map(field => (
							<DetailRow
								key={field.key}
								label={field.label}
								value={
									repo[field.key]?.length ? (
										<Flex
											gap={1}
											flexWrap='wrap'>
											{repo[field.key].map((item: string) => (
												<Badge
													key={item}
													size='xs'>
													{item}
												</Badge>
											))}
										</Flex>
									) : undefined
								}
							/>
						))}
					</Flex>
				</Panel>

				{repo.description && (
					<Panel title='Notes'>
						<Text fontSize='13px'>{repo.description}</Text>
					</Panel>
				)}
			</Flex>

			<LinkHostingModal
				repoId={id}
				repo={repo}
				isOpen={linking}
				onClose={() => setLinking(false)}
			/>
		</Layout>
	);
};

export default RepoPage;
