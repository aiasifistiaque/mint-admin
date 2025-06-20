'use client';
import {
	VInput,
	useCustomToast,
	useLgoinMutation,
	useAppDispatch,
	login,
	LoginContainer,
} from '@/components/library';

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

	useEffect(() => {
		if (result.isSuccess) {
			dispatch(login(result.data));
		}
	}, [isLoading]);

	useCustomToast({
		isError,
		isLoading: isLoading,
		error: error,
	});

	return (
		<LoginContainer
			title='Login'
			isLoading={isLoading}
			handleSubmit={handleSubmit}>
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
		</LoginContainer>
	);
};

export default LoginPage;
