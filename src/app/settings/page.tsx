'use client';

import {
	Layout,
	useGetSelfQuery,
	useUpdateSelfMutation,
	useCustomToast,
	Details,
	Section,
	SpaceBetween,
	SignatureUpload,
	useModalLayout,
} from '@/components/library';
import { Button, Flex, Heading, SegmentGroup, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const LAYOUT_OPTIONS = [
	{ value: 'modal', label: 'Modal' },
	{ value: 'drawer', label: 'Drawer' },
];

const SettingsPage = () => {
	const { data, isFetching } = useGetSelfQuery({});
	const modalLayout = useModalLayout();
	const [editing, setEditing] = useState(false);
	const [editingSignature, setEditingSignature] = useState(false);

	const [updateSelf, result] = useUpdateSelfMutation();
	const [updateSignature, signatureResult] = useUpdateSelfMutation();
	const [updateModalLayout, modalLayoutResult] = useUpdateSelfMutation();

	const [formData, setFormData] = useState<any>({
		name: '',
		email: '',
		phone: '',
		role: '',
	});
	const [signature, setSignature] = useState<string>('');

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
		setSignature(data?.signature || '');
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

	const closeSignatureEdit = () => {
		setEditingSignature(false);
		refresh();
	};
	const openSignatureEdit = () => setEditingSignature(true);

	const handleSignatureSubmit = (e: any) => {
		e.preventDefault();
		updateSignature({ signature });
	};

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

	useEffect(() => {
		// Don't call refresh() here: it reads `data`, which may still be the
		// stale pre-upload value until the `self`-tag invalidation refetch
		// lands, and would flash the signature back to the old one right
		// after saving. The local `signature` state already holds the value
		// that was just persisted, so just close editing.
		if (!signatureResult?.isLoading && signatureResult?.isSuccess) {
			setEditingSignature(false);
		}
	}, [signatureResult?.isLoading]);

	useCustomToast({
		isLoading: result?.isLoading,
		isError: result?.isError,
		error: result?.error,
		isSuccess: result?.isSuccess,
		successText: 'Profile updated successfully',
	});

	useCustomToast({
		isLoading: signatureResult?.isLoading,
		isError: signatureResult?.isError,
		error: signatureResult?.error,
		isSuccess: signatureResult?.isSuccess,
		successText: 'Signature updated successfully',
	});

	useCustomToast({
		isLoading: modalLayoutResult?.isLoading,
		isError: modalLayoutResult?.isError,
		error: modalLayoutResult?.error,
		isSuccess: modalLayoutResult?.isSuccess,
		successText: 'Modal layout updated',
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

			<Section
				px={6}
				py={0}
				mt={4}
				bg={{ _light: 'container.light' }}
				_dark={{ bg: 'menu.dark' }}
				border='1px solid'
				borderColor={{ _light: 'border.light', _dark: 'border.dark' }}>
				<form onSubmit={handleSignatureSubmit}>
					<SpaceBetween
						borderBottomWidth={1}
						pb={4}
						_dark={{ borderColor: 'border.dark' }}>
						<Heading size='lg'>Signature</Heading>
						{editingSignature ? (
							<Flex
								align='center'
								gap={2}>
								<Button
									size='xs'
									px={3}
									variant='outline'
									onClick={closeSignatureEdit}>
									Discard
								</Button>
								<Button
									size='xs'
									px={3}
									loading={signatureResult?.isLoading}
									type='submit'>
									Confirm
								</Button>
							</Flex>
						) : (
							<Button
								size='xs'
								px={3}
								onClick={openSignatureEdit}>
								Edit
							</Button>
						)}
					</SpaceBetween>
					<Flex
						direction='column'
						py={6}
						w='100%'>
						{editingSignature ? (
							<SignatureUpload
								value={signature}
								onChange={setSignature}
								helper='Shown on invoice/bill/receipt PDFs you download with "Include signature" checked.'
							/>
						) : (
							<Details
								editing={false}
								title='Signature'
								type='image'>
								{signature}
							</Details>
						)}
					</Flex>
				</form>
			</Section>

			<Section
				px={6}
				py={0}
				mt={4}
				bg={{ _light: 'container.light' }}
				_dark={{ bg: 'menu.dark' }}
				border='1px solid'
				borderColor={{ _light: 'border.light', _dark: 'border.dark' }}>
				<SpaceBetween
					borderBottomWidth={1}
					pb={4}
					_dark={{ borderColor: 'border.dark' }}>
					<Heading size='lg'>Modal Layout</Heading>
				</SpaceBetween>
				<Flex
					direction='column'
					gap={3}
					py={6}
					w='100%'>
					<Text
						fontSize='sm'
						color='fg.muted'>
						Choose how create and edit forms open on desktop — centered, or as a panel sliding in
						from the right. Mobile always uses the bottom sheet regardless of this setting.
					</Text>
					<SegmentGroup.Root
						value={modalLayout}
						onValueChange={details =>
							updateModalLayout({ modalLayout: (details.value as 'modal' | 'drawer') || 'drawer' })
						}
						w='fit-content'>
						<SegmentGroup.Indicator />
						<SegmentGroup.Items items={LAYOUT_OPTIONS} />
					</SegmentGroup.Root>
				</Flex>
			</Section>
		</Layout>
	);
};

export default SettingsPage;
