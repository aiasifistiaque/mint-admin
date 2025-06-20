'use client';
import {
	VInput,
	useCustomToast,
	useAppDispatch,
	useRegisterMutation,
	login,
	LoginContainer,
} from '@/components/library';
import React, { FC, ChangeEvent, useState, useEffect } from 'react';

const LoginPage: FC<{}> = () => {
	const [formData, setFormData] = useState<any>({
		name: undefined,
		email: undefined,
		restaurant: undefined,
		password: undefined,
		confirm: undefined,
	});

	const [trigger, result] = useRegisterMutation();
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
			title='Register'
			isLoading={isLoading}
			handleSubmit={handleSubmit}>
			<VInput
				label='Name'
				isRequired
				value={formData.name}
				onChange={handleChange}
				name='name'
			/>
			<VInput
				label='Email'
				isRequired
				value={formData.email}
				onChange={handleChange}
				name='email'
			/>
			<VInput
				label='Restaurant name'
				isRequired
				value={formData.restaurant}
				onChange={handleChange}
				name='restaurant'
			/>
			<VInput
				label='Password'
				isRequired
				value={formData.password}
				onChange={handleChange}
				name='password'
				type='password'
			/>
			<VInput
				label='Confirm Passsword'
				isRequired
				value={formData.confirm}
				onChange={handleChange}
				name='confirm'
				type='password'
			/>
		</LoginContainer>
	);
};

export default LoginPage;
