'use client';

import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

type ToastProps = {
	isError?: boolean;
	isSuccess?: boolean;
	error?: any;
	successText?: string;
	successTitle?: string;
	isLoading: boolean;
};

const VARIANT = 'left-accent';
const POSITION = 'bottom-right';
const IS_CLOSABLE = true;
const DURATION = 9000;

const useCustomToast = ({
	isError,
	isSuccess,
	error,
	successText,
	successTitle,
	isLoading,
}: ToastProps) => {
	const toast = useToast();

	useEffect(() => {
		if (isLoading) return;
		isError &&
			toast({
				title: 'Error',
				description: error?.data?.message,
				status: 'error',
				duration: DURATION,
				isClosable: IS_CLOSABLE,
				variant: VARIANT,
				position: POSITION,
			});
	}, [isLoading]);

	useEffect(() => {
		if (isLoading) return;
		isSuccess &&
			toast({
				title: successTitle || 'Success',
				description: successText || 'success',
				status: 'success',
				duration: DURATION,
				isClosable: IS_CLOSABLE,
				variant: VARIANT,
				position: POSITION,
			});
	}, [isLoading]);

	return null;
};

export default useCustomToast;
