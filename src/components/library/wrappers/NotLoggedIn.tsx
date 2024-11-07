'use client';
import { FlexProps } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react';
import { useAuth } from '../';

export type FlexPropsType = FlexProps & {
	children?: React.ReactNode;
};

const NotLoggedIn: FC<FlexPropsType> = ({ children }) => {
	const { isLoading, isLoggedIn } = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isLoggedIn) {
			router.replace('/');
		}
	}, [isLoading]);

	if (isLoading) return null;
	if (!isLoggedIn) return children;
	return null;
};

export default NotLoggedIn;
