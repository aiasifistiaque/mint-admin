'use client';
import {
	VInput,
	useCustomToast,
	useLgoinMutation,
	useAppDispatch,
	login,
	LoginContainer,
	TwoFactorChallenge,
} from '@/components/library';
import TwoFactorStep from './_components/TwoFactorStep';
import { Box, Link as ChakraLink } from '@chakra-ui/react';
import { SIGNED_OUT_KEY } from '@/components/provider/SessionGuard';
import NextLink from 'next/link';

import React, { FC, ChangeEvent, useState, useEffect } from 'react';

type FormDataType = {
	email: string;
	password: string;
};

const LoginPage: FC<{}> = () => {
	const [formData, setFormData] = useState<FormDataType>({
		email: '',
		password: '',
	});

	const [trigger, result] = useLgoinMutation();
	const dispatch = useAppDispatch();

	const { isSuccess, isError, isLoading, error } = result;
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		trigger(formData);
	};

	// Sent here because this session was signed out elsewhere (SessionGuard):
	// say so once, then forget it.
	const [signedOut, setSignedOut] = useState(false);
	useEffect(() => {
		try {
			if (sessionStorage.getItem(SIGNED_OUT_KEY)) {
				setSignedOut(true);
				sessionStorage.removeItem(SIGNED_OUT_KEY);
			}
		} catch {
			/* storage blocked */
		}
	}, []);

	// With two-factor on, the password earns a ticket instead of the token:
	// the second step (TwoFactorStep) trades it for the session.
	const [challenge, setChallenge] = useState<TwoFactorChallenge | null>(null);

	useEffect(() => {
		if (result.isSuccess) {
			const data: any = result.data;
			if (data?.twoFactor) setChallenge(data.twoFactor);
			else dispatch(login(data));
		}
	}, [isLoading]);

	useCustomToast({
		isError,
		isLoading: isLoading,
		error: error,
	});

	if (challenge)
		return (
			<TwoFactorStep
				challenge={challenge}
				onToken={token => dispatch(login({ token } as any))}
				onRestart={() => {
					setChallenge(null);
					setFormData(f => ({ ...f, password: '' }));
					result.reset();
				}}
			/>
		);

	return (
		<LoginContainer
			title='Login'
			isLoading={isLoading}
			handleSubmit={handleSubmit}>
			{signedOut && (
				<Box
					role='status'
					px={3}
					py={2.5}
					borderRadius='lg'
					bg='orange.subtle'
					color='orange.fg'
					fontSize='13px'>
					You were signed out on this device — from another device, or by an administrator. Sign in again to continue.
				</Box>
			)}
			<VInput
				label='Email'
				isRequired
				size='md'
				value={formData.email}
				onChange={handleChange}
				name='email'
			/>
			<VInput
				label='Password'
				isRequired
				size='md'
				value={formData.password}
				onChange={handleChange}
				name='password'
				type='password'
			/>
			<ChakraLink
				as={NextLink}
				href='/auth/forgot-password'
				fontSize='sm'
				alignSelf='flex-end'>
				Forgot Password?
			</ChakraLink>
		</LoginContainer>
	);
};

export default LoginPage;
