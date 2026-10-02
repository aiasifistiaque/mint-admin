'use client';

import { useState } from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import {
	Toast,
	radius,
	useUpdateVercelProjectMutation,
	useDeleteVercelProjectMutation,
} from '@/components/library';
import { Panel, ConfirmAction } from '@/components/library/cl';

const EDITABLE = [
	{ key: 'buildCommand', label: 'Build command', placeholder: 'Framework default' },
	{ key: 'installCommand', label: 'Install command', placeholder: 'Framework default' },
	{ key: 'outputDirectory', label: 'Output directory', placeholder: 'Framework default' },
	{ key: 'rootDirectory', label: 'Root directory', placeholder: '/' },
	{ key: 'devCommand', label: 'Dev command', placeholder: 'Framework default' },
];

type Props = {
	id: string;
	projectRef: string;
	project: any;
	team: string;
	storefront?: any;
	onDeleted: () => void;
};

const SettingsTab = ({ id, projectRef, project, team, storefront, onDeleted }: Props) => {
	const [draft, setDraft] = useState<Record<string, string>>(() =>
		EDITABLE.reduce((acc, field) => ({ ...acc, [field.key]: project[field.key] || '' }), {})
	);
	const [deleting, setDeleting] = useState(false);

	const [update, updateResult] = useUpdateVercelProjectMutation();
	const [remove, removeResult] = useDeleteVercelProjectMutation();

	const dirty = EDITABLE.some(field => (project[field.key] || '') !== draft[field.key]);

	return (
		<Flex
			direction='column'
			gap={4}>
			<Panel
				title='Build configuration'
				subtitle='Applies to the next deployment. Nothing here changes what is running now.'
				actions={
					<Button
						size='xs'
						disabled={!dirty}
						loading={updateResult.isLoading}
						onClick={() =>
							update({
								id,
								project: projectRef,
								team,
								...EDITABLE.reduce(
									(acc, field) => ({ ...acc, [field.key]: draft[field.key] || null }),
									{}
								),
							})
						}>
						Save
					</Button>
				}>
				<Flex
					direction='column'
					gap={3}>
					{EDITABLE.map(field => (
						<Flex
							key={field.key}
							gap={4}
							align='center'>
							<Text
								fontSize='xs'
								color='fg.muted'
								minW='150px'>
								{field.label}
							</Text>
							<Input
								size='sm'
								maxW='420px'
								fontFamily='mono'
								borderRadius={radius.INPUT}
								placeholder={field.placeholder}
								value={draft[field.key]}
								onChange={event =>
									setDraft(current => ({ ...current, [field.key]: event.target.value }))
								}
							/>
						</Flex>
					))}
				</Flex>
			</Panel>

			{/*
				Alone at the bottom, ghost red, never beside a benign action.
				A storefront cannot be deleted here at all — the backend refuses
				it — because hongo's own flow is the only one that also clears the
				Deployment row, Shop.deployment and PurchasedTheme.isDeployed.
			*/}
			<Panel
				title='Danger zone'
				subtitle={
					storefront
						? `This project is the live storefront for ${storefront.shopName}.`
						: 'Deleting a project takes its deployments and domain attachments with it.'
				}>
				{storefront ? (
					<Text
						fontSize='13px'
						color='fg.muted'>
						Deleting it from here is refused: the shop&apos;s records would be left pointing at a
						project that no longer exists. Remove the storefront from the shop instead.
					</Text>
				) : (
					<Button
						size='sm'
						variant='ghost'
						colorPalette='red'
						onClick={() => setDeleting(true)}>
						Delete this project
					</Button>
				)}
			</Panel>

			<ConfirmAction
				isOpen={deleting}
				onClose={() => setDeleting(false)}
				onConfirm={async () => {
					const answer: any = await remove({
						id,
						project: projectRef,
						team,
						confirm: project.name,
					});
					setDeleting(false);
					if (answer?.data) onDeleted();
				}}
				title='Delete this project'
				consequence={`${project.name}, every deployment it has ever made and every domain attached to it are removed from Vercel permanently. There is no undo.`}
				confirmLabel='Delete project'
				destructive
				isLoading={removeResult.isLoading}
				typeToConfirm={project.name}
			/>

			<Toast
				isError={updateResult.isError || removeResult.isError}
				error={updateResult.error || removeResult.error}
			/>
			<Toast
				isSuccess={updateResult.isSuccess}
				successTitle='Saved'
				successText='The next deployment will use the new configuration.'
			/>
		</Flex>
	);
};

export default SettingsTab;
