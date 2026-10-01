'use client';

import { FC, FormEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { Text } from '@chakra-ui/react';
import {
	LoginContainer,
	VInput,
	VPassword,
	login,
	useAcceptTenantInvitationMutation,
	useAppDispatch,
	useGetTenantInvitationQuery,
} from '@/components/library';

/**
 * Joining an organization from an emailed invitation (tenant panel —
 * /tenant/api/invitations/:token). Someone new makes their account here; an
 * existing account proves it's theirs with its password. Either way they land
 * in the organization that invited them.
 */
const TenantAcceptInvitation: FC = () => {
	const { token } = useParams<{ token: string }>();
	const dispatch = useAppDispatch();
	const { data: invitation, isLoading: loadingInfo, isError } = useGetTenantInvitationQuery(token);
	const [accept, { isLoading, error }] = useAcceptTenantInvitationMutation();
	const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '' });
	const existing = !!invitation?.existingAccount;
	const mismatch = !existing && form.confirm.length > 0 && form.password !== form.confirm;

	const set = (k: keyof typeof form) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (mismatch) return;
		const res = await accept({ token, password: form.password, ...(!existing && { name: form.name, phone: form.phone }) });
		if ('data' in res && res.data?.token) dispatch(login({ token: res.data.token }));
	};

	if (!loadingInfo && (isError || !invitation))
		return (
			<LoginContainer
				title='This invitation has expired'
				hideSubmit
				isLoading={false}
				handleSubmit={(e: any) => e.preventDefault()}>
				<Text
					fontSize='sm'
					color='fg.muted'
					textAlign='center'>
					The link is invalid, was already used, or is more than 7 days old. Ask for a new one.
				</Text>
			</LoginContainer>
		);

	return (
		<LoginContainer
			title={invitation ? `Join ${invitation.organization.name}` : 'Join'}
			subtitle={
				invitation
					? existing
						? `Sign in to accept — you'll join as ${invitation.role}.`
						: `Create your account — you'll join as ${invitation.role}.`
					: undefined
			}
			submitLabel={existing ? 'Sign in and join' : 'Create account and join'}
			isLoading={isLoading || loadingInfo}
			handleSubmit={submit}>
			<VInput
				label='Email'
				size='md'
				value={invitation?.email || ''}
				disabled
				readOnly
				name='email'
			/>
			{!existing && (
				<>
					<VInput
						label='Your name'
						isRequired
						size='md'
						autoComplete='name'
						autoFocus
						value={form.name || invitation?.name || ''}
						onChange={set('name')}
						name='name'
					/>
					<VInput
						label='Phone'
						size='md'
						autoComplete='tel'
						value={form.phone}
						onChange={set('phone')}
						name='phone'
					/>
				</>
			)}
			<VPassword
				label={existing ? 'Your password' : 'Password'}
				isRequired
				size='md'
				autoComplete={existing ? 'current-password' : 'new-password'}
				autoFocus={existing}
				value={form.password}
				onChange={set('password')}
				name='password'
			/>
			{!existing && (
				<VPassword
					label='Confirm password'
					isRequired
					size='md'
					value={form.confirm}
					onChange={set('confirm')}
					name='confirm'
					helper={mismatch ? 'Passwords don’t match.' : undefined}
				/>
			)}
			{error && (
				<Text
					role='alert'
					fontSize='13px'
					color='red.fg'>
					{(error as any)?.data?.message || 'Something went wrong — try again.'}
				</Text>
			)}
		</LoginContainer>
	);
};

export default TenantAcceptInvitation;
