'use client';

import {
	Layout,
	useGetSelfQuery,
	useUpdateSelfMutation,
	useCustomToast,
	SignatureUpload,
	useModalLayout,
	UpdatePasswordModal,
	PromptDialog,
} from '@/components/library';
import { Box, Button, Flex, Grid, Input, Image, Skeleton, Text } from '@chakra-ui/react';
import { Check, KeyRound, Lock, PanelRight, PenLine, SquareDashed, UserRound } from 'lucide-react';
import React, { FC, ReactNode, useEffect, useState } from 'react';

const COMPACT = { size: 'sm', px: 3 } as const;

/**
 * One settings card: title and description, the content, and a footer ledge
 * with a note on the left and the card's actions on the right — so every
 * card saves the same way, from the same place.
 */
const SettingsCard: FC<{
	id: string;
	icon: ReactNode;
	title: string;
	description?: ReactNode;
	note?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
	as?: any;
	onSubmit?: (e: any) => void;
}> = ({ id, icon, title, description, note, actions, children, as, onSubmit }) => (
	<Box
		as={as}
		id={id}
		onSubmit={onSubmit}
		scrollMarginTop='80px'
		borderWidth='1px'
		borderColor='border'
		borderRadius='xl'
		bg='bg.panel'
		overflow='hidden'>
		<Flex
			gap={3}
			align='flex-start'
			px={{ base: 4, md: 6 }}
			pt={{ base: 4, md: 5 }}
			pb={children ? 0 : { base: 4, md: 5 }}>
			<Flex
				flexShrink={0}
				w='32px'
				h='32px'
				align='center'
				justify='center'
				borderRadius='lg'
				borderWidth='1px'
				borderColor='border'
				bg='bg.subtle'
				color='fg.muted'>
				{icon}
			</Flex>
			<Box minW={0}>
				<Text
					fontSize='15px'
					fontWeight='600'
					letterSpacing='-0.01em'
					lineHeight='1.4'>
					{title}
				</Text>
				{description && (
					<Text
						mt={0.5}
						fontSize='13px'
						color='fg.muted'
						lineHeight='1.5'>
						{description}
					</Text>
				)}
			</Box>
		</Flex>

		{children && (
			<Box
				px={{ base: 4, md: 6 }}
				pt={5}
				pb={{ base: 4, md: 6 }}>
				{children}
			</Box>
		)}

		{(note || actions) && (
			<Flex
				align='center'
				justify='space-between'
				gap={3}
				flexWrap='wrap'
				px={{ base: 4, md: 6 }}
				py={3}
				borderTopWidth='1px'
				borderColor='border.muted'
				bg='bg.subtle'>
				<Text
					fontSize='12px'
					color='fg.muted'
					minW={0}>
					{note}
				</Text>
				<Flex
					gap={2}
					ml='auto'>
					{actions}
				</Flex>
			</Flex>
		)}
	</Box>
);

/** A label and its value (or its input), one row of a card's list. */
const Row: FC<{ label: string; hint?: ReactNode; children: ReactNode }> = ({ label, hint, children }) => (
	<Grid
		templateColumns={{ base: '1fr', md: '180px minmax(0, 1fr)' }}
		gap={{ base: 1.5, md: 6 }}
		alignItems='center'
		py={3.5}
		borderTopWidth='1px'
		borderColor='border.muted'
		_first={{ borderTopWidth: 0, pt: 0 }}
		_last={{ pb: 0 }}>
		<Box>
			<Text
				fontSize='13px'
				fontWeight='500'>
				{label}
			</Text>
			{hint && (
				<Text
					fontSize='12px'
					color='fg.muted'>
					{hint}
				</Text>
			)}
		</Box>
		<Box
			minW={0}
			fontSize='13px'>
			{children}
		</Box>
	</Grid>
);

const Value: FC<{ children?: ReactNode; locked?: boolean }> = ({ children, locked }) => (
	<Flex
		align='center'
		gap={2}
		minH='32px'
		color={children ? 'fg' : 'fg.subtle'}>
		<Text truncate>{children || 'Not set'}</Text>
		{locked && (
			<Box
				as='span'
				color='fg.subtle'
				flexShrink={0}
				title="Can't be changed here">
				<Lock size={12} />
			</Box>
		)}
	</Flex>
);

const initials = (name?: string) =>
	String(name || '?')
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map(w => w[0]?.toUpperCase())
		.join('');

/** A mini picture of each form layout, so the choice reads before its label. */
const LayoutPicture: FC<{ kind: 'modal' | 'drawer' }> = ({ kind }) => (
	<Box
		position='relative'
		h='72px'
		borderRadius='md'
		bg='bg.muted'
		overflow='hidden'>
		<Box
			position='absolute'
			top={2}
			left={2}
			right={2}
			h='6px'
			borderRadius='sm'
			bg='border'
		/>
		<Box
			position='absolute'
			bg='bg.panel'
			borderWidth='1px'
			borderColor='border.emphasized'
			boxShadow='sm'
			{...(kind === 'modal'
				? { top: '18px', left: '28%', right: '28%', bottom: '10px', borderRadius: 'sm' }
				: { top: 0, right: 0, bottom: 0, w: '38%', borderLeftRadius: 'sm' })}>
			{[0, 1, 2].map(i => (
				<Box
					key={i}
					mx={1.5}
					mt={i ? 1 : 1.5}
					h='4px'
					borderRadius='full'
					bg='border'
					w={i === 2 ? '50%' : 'auto'}
				/>
			))}
		</Box>
	</Box>
);

const LAYOUTS: { value: 'modal' | 'drawer'; label: string; hint: string }[] = [
	{ value: 'modal', label: 'Centred dialog', hint: 'Opens over the page, in the middle' },
	{ value: 'drawer', label: 'Side panel', hint: 'Slides in from the right; the table stays in view' },
];

const SettingsPage = () => {
	const { data, isLoading: loadingSelf } = useGetSelfQuery({});
	const modalLayout = useModalLayout();

	const [editing, setEditing] = useState(false);
	const [profile, setProfile] = useState({ name: '', phone: '' });
	const [editingSignature, setEditingSignature] = useState(false);
	const [signature, setSignature] = useState('');
	const [removing, setRemoving] = useState(false);

	const [updateSelf, result] = useUpdateSelfMutation();
	const [updateSignature, signatureResult] = useUpdateSelfMutation();
	const [updateModalLayout, modalLayoutResult] = useUpdateSelfMutation();

	const reset = () => {
		setProfile({ name: data?.name || '', phone: data?.phone || '' });
		setSignature(data?.signature || '');
	};

	useEffect(() => {
		if (data) reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	useEffect(() => {
		if (!result.isLoading && result.isSuccess) setEditing(false);
	}, [result.isLoading, result.isSuccess]);

	// Not reset() here: `data` can still be the pre-upload value until the
	// `self` refetch lands, and would flash the old signature back.
	useEffect(() => {
		if (!signatureResult.isLoading && signatureResult.isSuccess) {
			setEditingSignature(false);
			setRemoving(false);
		}
	}, [signatureResult.isLoading, signatureResult.isSuccess]);

	useCustomToast({ ...result, successText: 'Profile updated' });
	useCustomToast({ ...signatureResult, successText: 'Signature updated' });
	useCustomToast({ ...modalLayoutResult, successText: 'Form layout updated' });

	const profileChanged =
		profile.name.trim() !== (data?.name || '') || profile.phone.trim() !== (data?.phone || '');
	const signatureChanged = signature !== (data?.signature || '');

	const saveProfile = (e: any) => {
		e.preventDefault();
		if (!profile.name.trim() || !profileChanged) return;
		updateSelf({ name: profile.name.trim(), phone: profile.phone.trim() });
	};

	const saveSignature = (e: any) => {
		e.preventDefault();
		if (signatureChanged) updateSignature({ signature });
	};

	const cancelProfile = () => {
		setEditing(false);
		reset();
	};
	const cancelSignature = () => {
		setEditingSignature(false);
		setSignature(data?.signature || '');
	};

	// 'SUPER-ADMIN' -> 'Super admin'.
	const role = data?.role?.name
		? String(data.role.name).toLowerCase().replace(/[-_]+/g, ' ').replace(/^./, (c: string) => c.toUpperCase())
		: '';

	return (
		<Layout
			title='Settings'
			path='settings'>
			<Flex
				direction='column'
				gap={5}
				w='full'
				maxW='880px'
				mx='auto'
				pt={4}
				pb={10}>
				<Box mb={1}>
					<Text
						fontSize='20px'
						fontWeight='600'
						letterSpacing='-0.01em'>
						Settings
					</Text>
					<Text
						fontSize='13px'
						color='fg.muted'>
						Your profile, sign-in, signature and how forms open. Only you see these.
					</Text>
				</Box>

				{/* ------------------------------------------------ profile */}
				<SettingsCard
					as='form'
					onSubmit={saveProfile}
					id='profile'
					icon={<UserRound size={16} />}
					title='Profile'
					description='How you appear to the rest of the team, in history and on records you create.'
					note={
						editing
							? profileChanged
								? 'You have unsaved changes'
								: 'Email and role are managed by an admin'
							: data?.createdAt && `Member since ${new Date(data.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}`
					}
					actions={
						editing ? (
							<>
								<Button
									{...COMPACT}
									variant='outline'
									disabled={result.isLoading}
									onClick={cancelProfile}>
									Cancel
								</Button>
								<Button
									{...COMPACT}
									type='submit'
									loading={result.isLoading}
									loadingText='Saving'
									disabled={!profileChanged || !profile.name.trim()}>
									Save
								</Button>
							</>
						) : (
							<Button
								{...COMPACT}
								variant='outline'
								disabled={!data}
								onClick={() => setEditing(true)}>
								Edit profile
							</Button>
						)
					}>
					{loadingSelf ? (
						<Flex
							gap={4}
							align='center'>
							<Skeleton
								w='56px'
								h='56px'
								borderRadius='full'
							/>
							<Box flex={1}>
								<Skeleton
									h='14px'
									w='160px'
									mb={2}
								/>
								<Skeleton
									h='12px'
									w='220px'
								/>
							</Box>
						</Flex>
					) : (
						<>
							<Flex
								align='center'
								gap={4}
								mb={5}
								pb={5}
								borderBottomWidth='1px'
								borderColor='border.muted'>
								<Flex
									flexShrink={0}
									w='56px'
									h='56px'
									align='center'
									justify='center'
									borderRadius='full'
									bg='fg'
									color='bg'
									fontSize='18px'
									fontWeight='600'
									letterSpacing='0.02em'>
									{initials(data?.name)}
								</Flex>
								<Box minW={0}>
									<Flex
										align='center'
										gap={2}
										flexWrap='wrap'>
										<Text
											fontSize='16px'
											fontWeight='600'
											truncate>
											{data?.name}
										</Text>
										{role && (
											<Box
												px={2}
												borderWidth='1px'
												borderColor='border'
												borderRadius='full'
												bg='bg.subtle'
												color='fg.muted'
												fontSize='11px'
												fontWeight='500'
												lineHeight='18px'>
												{role}
											</Box>
										)}
									</Flex>
									<Text
										fontSize='13px'
										color='fg.muted'
										truncate>
										{data?.email}
									</Text>
								</Box>
							</Flex>

							<Row label='Full name'>
								{editing ? (
									<Input
										size='sm'
										maxW='360px'
										autoFocus
										value={profile.name}
										onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
									/>
								) : (
									<Value>{data?.name}</Value>
								)}
							</Row>
							<Row label='Phone'>
								{editing ? (
									<Input
										size='sm'
										maxW='360px'
										type='tel'
										placeholder='Add a phone number'
										value={profile.phone}
										onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
									/>
								) : (
									<Value>{data?.phone}</Value>
								)}
							</Row>
							<Row label='Email'>
								<Value locked>{data?.email}</Value>
							</Row>
							<Row label='Role'>
								<Value locked>{role}</Value>
							</Row>
						</>
					)}
				</SettingsCard>

				{/* ------------------------------------------------ password */}
				<SettingsCard
					id='password'
					icon={<KeyRound size={16} />}
					title='Password'
					description='The password you sign in with. You’ll need your current one to change it.'
					note='Use at least 8 characters, and one you don’t use elsewhere.'
					actions={
						<UpdatePasswordModal
							trigger={
								<Button
									{...COMPACT}
									variant='outline'>
									Change password
								</Button>
							}
						/>
					}
				/>

				{/* ----------------------------------------------- signature */}
				<SettingsCard
					as='form'
					onSubmit={saveSignature}
					id='signature'
					icon={<PenLine size={16} />}
					title='Signature'
					description='Printed on invoice, bill and receipt PDFs when you download them with “Include signature” ticked.'
					note={
						editingSignature
							? signatureChanged
								? 'New signature not saved yet'
								: 'A PNG with a transparent background prints best'
							: signature
							? 'Shown at the foot of the PDF, above your name'
							: 'No signature yet'
					}
					actions={
						editingSignature ? (
							<>
								<Button
									{...COMPACT}
									variant='outline'
									disabled={signatureResult.isLoading}
									onClick={cancelSignature}>
									Cancel
								</Button>
								<Button
									{...COMPACT}
									type='submit'
									loading={signatureResult.isLoading && !removing}
									loadingText='Saving'
									disabled={!signatureChanged}>
									Save
								</Button>
							</>
						) : (
							<>
								{signature && (
									<Button
										{...COMPACT}
										variant='ghost'
										color='red.fg'
										onClick={() => setRemoving(true)}>
										Remove
									</Button>
								)}
								<Button
									{...COMPACT}
									variant='outline'
									disabled={!data}
									onClick={() => setEditingSignature(true)}>
									{signature ? 'Replace' : 'Add signature'}
								</Button>
							</>
						)
					}>
					{editingSignature ? (
						<SignatureUpload
							value={signature}
							onChange={setSignature}
						/>
					) : (
						// Paper-white whatever the theme: a signature is dark ink on a
						// transparent image, and vanished on the dark panel.
						<Flex
							h='140px'
							align='center'
							justify='center'
							borderRadius='lg'
							borderWidth='1px'
							borderStyle={signature ? 'solid' : 'dashed'}
							borderColor='border'
							bg={signature ? 'white' : 'bg.subtle'}
							position='relative'
							overflow='hidden'>
							{loadingSelf ? (
								<Skeleton
									w='200px'
									h='60px'
								/>
							) : signature ? (
								<>
									<Image
										src={signature}
										alt='Your signature'
										maxH='96px'
										maxW='70%'
										objectFit='contain'
									/>
									<Box
										position='absolute'
										left='20%'
										right='20%'
										bottom='22px'
										borderBottomWidth='1px'
										borderColor='gray.300'
									/>
								</>
							) : (
								<Flex
									direction='column'
									align='center'
									gap={2}
									color='fg.muted'>
									<SquareDashed
										size={20}
										strokeWidth={1.5}
									/>
									<Text fontSize='13px'>Add a signature to sign your PDFs</Text>
								</Flex>
							)}
						</Flex>
					)}
				</SettingsCard>

				{/* ------------------------------------------------- layout */}
				<SettingsCard
					id='layout'
					icon={<PanelRight size={16} />}
					title='Form layout'
					description='How create and edit forms open on a desktop.'
					note='Phones always use the bottom sheet.'>
					<Grid
						templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
						gap={3}
						role='radiogroup'
						aria-label='Form layout'>
						{LAYOUTS.map(o => {
							const on = modalLayout === o.value;
							return (
								<Box
									key={o.value}
									as='button'
									role='radio'
									aria-checked={on}
									textAlign='left'
									p={3}
									borderRadius='lg'
									borderWidth='1px'
									borderColor={on ? 'fg' : 'border'}
									boxShadow={on ? '0 0 0 1px var(--chakra-colors-fg)' : 'none'}
									bg='bg.panel'
									cursor={modalLayoutResult.isLoading ? 'progress' : 'pointer'}
									transition='border-color 150ms, box-shadow 150ms'
									_hover={{ borderColor: on ? 'fg' : 'border.emphasized' }}
									_focusVisible={{ outline: '2px solid', outlineColor: 'fg', outlineOffset: '2px' }}
									onClick={() => !on && updateModalLayout({ modalLayout: o.value })}>
									<LayoutPicture kind={o.value} />
									<Flex
										mt={3}
										align='flex-start'
										justify='space-between'
										gap={2}>
										<Box>
											<Text
												fontSize='13px'
												fontWeight='600'>
												{o.label}
											</Text>
											<Text
												fontSize='12px'
												color='fg.muted'>
												{o.hint}
											</Text>
										</Box>
										<Flex
											flexShrink={0}
											w='18px'
											h='18px'
											mt='1px'
											align='center'
											justify='center'
											borderRadius='full'
											borderWidth={on ? 0 : '1px'}
											borderColor='border.emphasized'
											bg={on ? 'fg' : 'transparent'}
											color='bg'>
											{on && (
												<Check
													size={12}
													strokeWidth={3}
												/>
											)}
										</Flex>
									</Flex>
								</Box>
							);
						})}
					</Grid>
				</SettingsCard>
			</Flex>

			<PromptDialog
				open={removing}
				onClose={() => setRemoving(false)}
				onConfirm={() => updateSignature({ signature: '' }).then(() => setSignature(''))}
				title='Remove your signature?'
				description='PDFs you download from now on won’t be signed, even with “Include signature” ticked. You can add one again any time.'
				confirmLabel='Remove'
				loading={signatureResult.isLoading}
				loadingText='Removing'
			/>
		</Layout>
	);
};

export default SettingsPage;
