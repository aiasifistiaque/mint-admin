'use client';

import { Button, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState, ChangeEvent } from 'react';

import {
	VInput,
	VSelect,
	Column,
	useCustomToast,
	useGetAllQuery,
	useInviteAdminMutation,
	MenuModal,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	MenuModalFooter,
	DiscardButton,
	ConfirmButton,
	Icon,
} from '@/components/library';

const InviteAdminModal = () => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('');

	const { data } = useGetAllQuery({ path: 'adminroles', limit: 999, sort: 'name' });
	const roles = data?.doc || [];

	const [trigger, result] = useInviteAdminMutation();
	const { isSuccess, isError, isLoading, error } = result;

	const closeModal = () => {
		setEmail('');
		setRole('');
		result?.reset?.();
		onClose();
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger({ email, role });
	};

	useEffect(() => {
		if (isSuccess) closeModal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	useCustomToast({
		isError,
		isLoading,
		error,
		isSuccess,
		successTitle: 'Invitation sent',
		successText: 'They can now use the link in their email to join.',
	});

	return (
		<>
			<Button
				size='sm'
				onClick={onOpen}>
				<Icon
					size={16}
					name='add'
				/>
				Invite Admin
			</Button>

			<MenuModal
				forceModal
				isOpen={isOpen}
				onClose={closeModal}>
				<form onSubmit={handleSubmit}>
					<MenuModalHeader description="They'll get an email with a link to set their name, phone and password — the link works once and expires in 7 days.">
						Invite Admin
					</MenuModalHeader>
					<MenuModalCloseButton />
					<MenuModalBody pt={4}>
						<Column gap={4}>
							<VInput
								label='Email'
								isRequired
								type='email'
								placeholder='name@company.com'
								value={email}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
								name='email'
							/>

							<VSelect
								label='Role'
								isRequired
								placeholder='Select a role'
								value={role}
								onChange={(e: any) => setRole(e.target.value)}
								name='role'>
								{roles.map((r: any) => (
									<option
										key={r._id}
										value={r._id}>
										{r.name}
									</option>
								))}
							</VSelect>
						</Column>
					</MenuModalBody>
					<MenuModalFooter>
						<DiscardButton onClick={closeModal}>Discard</DiscardButton>
						<ConfirmButton
							type='submit'
							loadingText='Sending'
							loading={isLoading}
							disabled={!email || !role}>
							Send Invite
						</ConfirmButton>
					</MenuModalFooter>
				</form>
			</MenuModal>
		</>
	);
};

export default InviteAdminModal;
