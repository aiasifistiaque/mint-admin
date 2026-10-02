'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Flex, Input, Switch, Text } from '@chakra-ui/react';
import {
	Toast,
	radius,
	useSetHerokuMaintenanceMutation,
	useRenameHerokuAppMutation,
	useDestroyHerokuAppMutation,
} from '@/components/library';
import { Panel, ConfirmAction } from '@/components/library/cl';

type SettingsTabProps = {
	id: string;
	app: string;
	maintenance: boolean;
};

const SettingsTab: FC<SettingsTabProps> = ({ id, app, maintenance }) => {
	const router = useRouter();

	const [setMaintenance, maintenanceResult] = useSetHerokuMaintenanceMutation();
	const [rename, renameResult] = useRenameHerokuAppMutation();
	const [destroy, destroyResult] = useDestroyHerokuAppMutation();

	const [newName, setNewName] = useState('');
	const [renaming, setRenaming] = useState(false);
	const [destroying, setDestroying] = useState(false);
	const [togglingTo, setTogglingTo] = useState<boolean | null>(null);

	const onToggleMaintenance = async () => {
		const result = await setMaintenance({ id, app, enabled: !!togglingTo });
		if ('error' in result) return;
		setTogglingTo(null);
	};

	const onRename = async () => {
		const result = await rename({ id, app, name: newName.trim().toLowerCase() });
		if ('error' in result) return;

		setRenaming(false);
		// The URL carries the old name, so staying put would 404 on the next fetch.
		router.replace(`/herokus/${id}/apps/${newName.trim().toLowerCase()}`);
	};

	const onDestroy = async () => {
		const result = await destroy({ id, app, confirm: app });
		if ('error' in result) return;

		setDestroying(false);
		router.replace(`/herokus/${id}`);
	};

	return (
		<Flex direction='column' gap={6}>
			<Panel title='Maintenance mode'>
				<Flex align='center' justify='space-between' gap={4} flexWrap='wrap'>
					<Text fontSize='sm' color='fg.muted' maxW='520px'>
						While maintenance mode is on, Heroku serves a static maintenance page instead of routing
						web requests to the app. Worker dynos keep running.
					</Text>
					<Switch.Root
						checked={maintenance}
						onCheckedChange={details => setTogglingTo(details.checked)}>
						<Switch.HiddenInput />
						<Switch.Control />
						<Switch.Label fontSize='sm'>{maintenance ? 'On' : 'Off'}</Switch.Label>
					</Switch.Root>
				</Flex>
			</Panel>

			<Panel title='Rename app'>
				<Flex direction='column' gap={3}>
					<Text fontSize='sm' color='fg.muted' maxW='560px'>
						Renaming changes the app's URL and its git remote. Anything pointing at the old name —
						bookmarks, webhooks, deploy remotes, DNS — stops working immediately.
					</Text>
					<Flex gap={2} flexWrap='wrap'>
						<Input
							size='sm'
							w='280px'
							placeholder={app}
							fontSize='13px'
							borderRadius={radius.INPUT}
							value={newName}
							onChange={event => setNewName(event.target.value.toLowerCase())}
						/>
						<Button
							size='sm'
							variant='outline'
							disabled={!newName.trim() || newName.trim() === app}
							onClick={() => setRenaming(true)}>
							Rename
						</Button>
					</Flex>
				</Flex>
			</Panel>

			<Panel
				title='Danger zone'
				borderColor='red.400'>
				<Flex align='center' justify='space-between' gap={4} flexWrap='wrap'>
					<Text fontSize='sm' color='fg.muted' maxW='520px'>
						Deleting <strong>{app}</strong> destroys its dynos, add-ons, database and config vars.
						This cannot be undone, and Heroku offers no way to recover it.
					</Text>
					<Button
						size='sm'
						variant='ghost'
						colorPalette='red'
						onClick={() => setDestroying(true)}>
						Delete this app
					</Button>
				</Flex>
			</Panel>

			<ConfirmAction
				isOpen={togglingTo !== null}
				onClose={() => setTogglingTo(null)}
				onConfirm={onToggleMaintenance}
				title={togglingTo ? 'Turn on maintenance mode' : 'Turn off maintenance mode'}
				confirmLabel={togglingTo ? 'Turn on' : 'Turn off'}
				isLoading={maintenanceResult.isLoading}
				consequence={
					togglingTo
						? `Visitors to ${app} will see Heroku's maintenance page instead of the app.`
						: `${app} will start serving traffic again.`
				}
			/>

			<ConfirmAction
				isOpen={renaming}
				onClose={() => setRenaming(false)}
				onConfirm={onRename}
				title={`Rename ${app}`}
				confirmLabel='Rename'
				destructive
				typeToConfirm={app}
				isLoading={renameResult.isLoading}
				consequence={`${app} becomes ${newName.trim().toLowerCase()}. Its old URL and git remote stop working right away.`}
			/>

			<ConfirmAction
				isOpen={destroying}
				onClose={() => setDestroying(false)}
				onConfirm={onDestroy}
				title={`Delete ${app}`}
				confirmLabel='Delete permanently'
				destructive
				typeToConfirm={app}
				isLoading={destroyResult.isLoading}
				consequence={`Everything belonging to ${app} is destroyed: dynos, add-ons, the database and all config vars. There is no undo and no backup.`}
			/>

			<Toast
				isError={maintenanceResult.isError || renameResult.isError || destroyResult.isError}
				error={maintenanceResult.error || renameResult.error || destroyResult.error}
			/>
			<Toast
				isSuccess={maintenanceResult.isSuccess || renameResult.isSuccess || destroyResult.isSuccess}
				successTitle='Done'
				successText='Heroku has applied the change.'
			/>
		</Flex>
	);
};

export default SettingsTab;
