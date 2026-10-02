'use client';

import { FormEvent, useState } from 'react';
import { Button, Field, Flex, Input, Text } from '@chakra-ui/react';
import { Layout, refreshAuth, useAppDispatch, useCreateOrganizationMutation } from '@/components/library';
import { Panel } from '@/components/library/cl';
import { HOME, rememberProject } from '@/components/library/config/lib/constants/panel';

/**
 * Another organization, with you as its owner (tenant panel). The panel then
 * switches to it — a new session in that organization.
 */
export default function NewOrganizationPage() {
	const dispatch = useAppDispatch();
	const [name, setName] = useState('');
	const [create, { isLoading, error }] = useCreateOrganizationMutation();

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		const res = await create({ name: name.trim() });
		if ('data' in res && res.data?.token) {
			rememberProject(null);
			dispatch(refreshAuth(res.data.token));
			window.location.href = HOME;
		}
	};

	return (
		<Layout
			title='New organization'
			path='org-new'>
			<Flex
				pt={2}
				maxW='520px'>
				<Panel
					w='full'
					title='New organization'
					subtitle='Its own projects, members and roles. You’ll be its owner.'>
					<form onSubmit={submit}>
						<Flex
							direction='column'
							gap={3}>
							<Field.Root required>
								<Field.Label
									fontSize='13px'
									fontWeight='600'>
									Name
								</Field.Label>
								<Input
									size='sm'
									autoFocus
									value={name}
									maxLength={120}
									placeholder='e.g. Acme Studio'
									onChange={e => setName(e.target.value)}
								/>
							</Field.Root>
							{error && (
								<Text
									fontSize='13px'
									color='red.fg'>
									{(error as any)?.data?.message || 'Something went wrong — try again.'}
								</Text>
							)}
							<Flex justify='flex-end'>
								<Button
									type='submit'
									size='sm'
									loading={isLoading}
									disabled={!name.trim()}>
									Create and switch
								</Button>
							</Flex>
						</Flex>
					</form>
				</Panel>
			</Flex>
		</Layout>
	);
}
