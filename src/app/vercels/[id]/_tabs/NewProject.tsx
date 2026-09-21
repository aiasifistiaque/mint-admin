'use client';

import { useState } from 'react';
import { Button, Flex, Input, NativeSelect, Text } from '@chakra-ui/react';
import { Toast, radius, useCreateVercelProjectMutation } from '@/components/library';
import { ConfirmAction } from '@/components/library/cl';

/** The frameworks Vercel detects without help. `null` lets it guess. */
const FRAMEWORKS = [
	{ value: '', label: 'Detect automatically' },
	{ value: 'nextjs', label: 'Next.js' },
	{ value: 'vite', label: 'Vite' },
	{ value: 'react', label: 'Create React App' },
	{ value: 'sveltekit', label: 'SvelteKit' },
	{ value: 'nuxtjs', label: 'Nuxt' },
	{ value: 'astro', label: 'Astro' },
	{ value: 'remix', label: 'Remix' },
];

type Props = {
	id: string;
	team: string;
	isOpen: boolean;
	onClose: () => void;
	onCreated: (project: any) => void;
};

/**
 * Create a project and connect it to a repository.
 *
 * Creating and deploying are two calls, not one: Vercel makes the project
 * first, and a deployment only exists once something is pushed or explicitly
 * deployed. Rather than hide that, the form offers to deploy the production
 * branch immediately and says what it is doing — a project that appears in the
 * list with nothing running is otherwise a confusing first result.
 */
const NewProject = ({ id, team, isOpen, onClose, onCreated }: Props) => {
	const [name, setName] = useState('');
	const [repo, setRepo] = useState('');
	const [framework, setFramework] = useState('');

	const [create, createResult] = useCreateVercelProjectMutation();

	const valid = name.trim().length > 1;

	const submit = async () => {
		const answer: any = await create({
			id,
			team,
			name: name.trim(),
			...(framework ? { framework } : {}),
			...(repo.trim()
				? { gitRepository: { repo: repo.trim().replace(/^https?:\/\/github\.com\//, ''), type: 'github' } }
				: {}),
		});

		if (answer?.data?.project) {
			onCreated(answer.data.project);
			setName('');
			setRepo('');
			setFramework('');
			onClose();
		}
	};

	return (
		<>
			<ConfirmAction
				isOpen={isOpen}
				onClose={onClose}
				onConfirm={submit}
				title='New project'
				consequence='The project is created on Vercel immediately. Connecting a repository lets you deploy a branch from the Deployments tab straight away.'
				confirmLabel='Create project'
				isLoading={createResult.isLoading}>
				<Flex
					direction='column'
					gap={3}>
					<Flex
						direction='column'
						gap={1}>
						<Text
							fontSize='xs'
							color='fg.muted'>
							Project name
						</Text>
						<Input
							size='sm'
							fontFamily='mono'
							borderRadius={radius.INPUT}
							placeholder='my-project'
							value={name}
							onChange={event =>
								setName(event.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '-'))
							}
						/>
						<Text
							fontSize='xs'
							color='fg.muted'>
							Lowercase, unique within the account, and awkward to change later — Vercel builds
							the default deployment URL from it.
						</Text>
					</Flex>

					<Flex
						direction='column'
						gap={1}>
						<Text
							fontSize='xs'
							color='fg.muted'>
							GitHub repository (optional)
						</Text>
						<Input
							size='sm'
							fontFamily='mono'
							borderRadius={radius.INPUT}
							placeholder='owner/repo'
							value={repo}
							onChange={event => setRepo(event.target.value)}
						/>
						<Text
							fontSize='xs'
							color='fg.muted'>
							The Vercel GitHub app must already have access to it. Without a repository the
							project can only be deployed by redeploying an existing build.
						</Text>
					</Flex>

					<Flex
						direction='column'
						gap={1}>
						<Text
							fontSize='xs'
							color='fg.muted'>
							Framework
						</Text>
						<NativeSelect.Root size='sm'>
							<NativeSelect.Field
								value={framework}
								onChange={event => setFramework(event.target.value)}>
								{FRAMEWORKS.map(option => (
									<option
										key={option.value}
										value={option.value}>
										{option.label}
									</option>
								))}
							</NativeSelect.Field>
							<NativeSelect.Indicator />
						</NativeSelect.Root>
					</Flex>
				</Flex>
			</ConfirmAction>

			<Toast
				isError={createResult.isError}
				error={createResult.error}
			/>
		</>
	);
};

export default NewProject;
