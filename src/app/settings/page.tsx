'use client';

// import Link from 'next/link';
// import React, { useState, useEffect } from 'react';
// import { Button, Flex } from '@chakra-ui/react';

// import { useUpdateByIdMutation } from '@/components/library/store/services/commonApi';
// import { useGetSelfQuery } from '@/store/services/authApi';

// import QrComponent from './_components/QrComponent';

// import { Layout, Column, VImage, Details, HeadingMenu, useCustomToast } from '@/components/library';

// const SettingsPage = () => {
// 	const { data, isFetching } = useGetSelfQuery({});

// 	const [trigger, result] = useUpdateByIdMutation();

// 	const [formData, setFormData] = useState<any>({});

// 	const refresh = () => {
// 		setFormData({
// 			name: data?.restaurant?.name || '',
// 			email: data?.restaurant?.email || '',
// 			image: data?.restaurant?.image || '',
// 		});
// 	};

// 	const [editing, setEditing] = useState(false);

// 	const handleChange = (e: any) => {
// 		setFormData({ ...formData, [e.target.name]: e.target.value });
// 	};

// 	const handleSubmit = (e: any) => {
// 		e.preventDefault();
// 		trigger({
// 			body: formData,
// 			path: 'restaurant',
// 			invalidate: ['self'],
// 			id: data?.restaurant?._id,
// 		});
// 	};

// 	const handleImage = (e: any) => {
// 		//setChangedData(prevState => ({ ...prevState, image: e }));
// 		setFormData({ ...formData, image: e });
// 	};

// 	const close = () => {
// 		setEditing(false);
// 		refresh();
// 	};
// 	const open = () => setEditing(true);

// 	useEffect(() => {
// 		if (!isFetching && data) {
// 			refresh();
// 		}
// 	}, [data]);

// 	useEffect(() => {
// 		if (!result?.isLoading && result?.isSuccess) {
// 			setEditing(false);
// 			refresh();
// 		}
// 	}, [result?.isLoading]);
// 	useCustomToast({
// 		isLoading: result?.isLoading,
// 		isError: result?.isError,
// 		error: result?.error,
// 		isSuccess: result?.isSuccess,
// 		successText: 'Updated successfully',
// 	});

// 	if (!data) return null;
// 	return (
// 		<Layout
// 			title={'Settings'}
// 			path={'/settings'}>
// 			<Column>
// 				<form onSubmit={handleSubmit}>
// 					<Column gap={4}>
// 						<HeadingMenu
// 							open={open}
// 							close={close}
// 							title='Restaurant Details'
// 							editing={editing}
// 							isLoading={result?.isLoading}>
// 							<Flex pb='44px'>
// 								<VImage
// 									name='image'
// 									value={formData.image}
// 									onChange={handleImage}
// 									isDisabled={!editing}
// 								/>
// 							</Flex>

// 							<Details
// 								editing={editing}
// 								title='Name'
// 								onChange={handleChange}
// 								name='name'>
// 								{formData?.name}
// 							</Details>
// 							<Details
// 								editing={editing}
// 								onChange={handleChange}
// 								title='Email'
// 								isDisabled>
// 								{formData?.email}
// 							</Details>
// 							<Link href='/editor'>
// 								<Button size='xs'>Customize QR Code</Button>
// 							</Link>
// 						</HeadingMenu>
// 					</Column>
// 				</form>

// 				<QrComponent id={data?.restaurant?._id} />
// 			</Column>
// 		</Layout>
// 	);
// };

// export default SettingsPage;

import {
	Layout,
	Icon,
	useGetSelfQuery,
	useUpdateSelfMutation,
	useCustomToast,
	Details,
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
			<Heading size='lg'>Profile</Heading>
			<form onSubmit={handleSubmit}>
				<Flex
					justify='space-between'
					borderBottomWidth={1}
					align='center'
					py={5}>
					<Heading size='md'>User</Heading>
					{editing ? (
						<Flex align='center'>
							<Button
								mr={2}
								size='xs'
								colorScheme='gray'
								onClick={closeEdit}>
								Discard
							</Button>
							<Button
								size='xs'
								isLoading={result?.isLoading}
								type='submit'>
								Confirm
							</Button>
						</Flex>
					) : (
						<Button
							size='xs'
							rightIcon={<Icon name='edit' />}
							onClick={openEdit}>
							Edit
						</Button>
					)}
				</Flex>
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
		</Layout>
	);
};

export default SettingsPage;
