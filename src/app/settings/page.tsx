'use client';

import {
	Layout,
	Icon,
	useGetSelfQuery,
	useUpdateSelfMutation,
	useCustomToast,
	Details,
	Section,
	SpaceBetween,
} from '@/components/library';
import { Button, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const SettingsPage = () => {
	const { data, isFetching } = useGetSelfQuery({});
	const [editing, setEditing] = useState(false);

	const [updateSelf, result] = useUpdateSelfMutation();

	const [formData, setFormData] = useState<any>({
		name: '',
		email: '',
		phone: '',
		role: '',
	});

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const refresh = () => {
		setFormData({
			name: data?.name || '',
			email: data?.email || '',
			phone: data?.phone || '',
			role: data?.role?.name || '',
		});
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		updateSelf({
			name: formData.name,
		});
	};

	const closeEdit = () => {
		setEditing(false);
		refresh();
	};
	const openEdit = () => setEditing(true);

	useEffect(() => {
		if (!isFetching && data) {
			refresh();
		}
	}, [data]);

	useEffect(() => {
		if (!result?.isLoading && result?.isSuccess) {
			setEditing(false);
			refresh();
		}
	}, [result?.isLoading]);

	useCustomToast({
		isLoading: result?.isLoading,
		isError: result?.isError,
		error: result?.error,
		isSuccess: result?.isSuccess,
		successText: 'Profile updated successfully',
	});

	return (
		<Layout
			title='Settings'
			path='settings'>
			<Section
				px={6}
				py={0}
				mt={4}
				bg={{ _light: 'container.light' }}
				_dark={{ bg: 'menu.dark' }}
				border='1px solid'
				borderColor={{ _light: 'border.light', _dark: 'border.dark' }}>
				<Heading size='xl'>Profile</Heading>
				<form onSubmit={handleSubmit}>
					<SpaceBetween
						borderBottomWidth={1}
						pb={4}
						_dark={{ borderColor: 'border.dark' }}>
						<Heading size='lg'>User</Heading>
						{editing ? (
							<Flex
								align='center'
								gap={2}>
								<Button
									size='xs'
									px={3}
									variant='outline'
									onClick={closeEdit}>
									Discard
								</Button>
								<Button
									size='xs'
									px={3}
									loading={result?.isLoading}
									type='submit'>
									Confirm
								</Button>
							</Flex>
						) : (
							<Button
								size='xs'
								px={3}
								onClick={openEdit}>
								Edit
								{/* <Icon name='edit' /> */}
							</Button>
						)}
					</SpaceBetween>
					<Flex
						direction='column'
						py={6}
						w='100%'>
						<Details
							editing={editing}
							title='Name'
							name='name'
							onChange={handleChange}>
							{formData?.name}
						</Details>
						<Details
							editing={editing}
							title='Email'
							name='email'
							isDisabled>
							{formData?.email}
						</Details>
						<Details
							editing={editing}
							title='Role'
							name='role'
							isDisabled>
							{formData?.role}
						</Details>
						<Details
							editing={editing}
							title='Password'
							isPassword={true}>
							********
						</Details>
					</Flex>
				</form>
			</Section>
		</Layout>
	);
};

export default SettingsPage;
