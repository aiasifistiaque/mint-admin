'use client';

import { useEffect } from 'react';
import { toaster } from '@/components/ui/toaster';

type ToastProps = {
	isError?: boolean;
	isSuccess?: boolean;
	error?: any;
	successText?: string;
	successTitle?: string;
	isLoading: boolean;
};

const useCustomToast = ({
	isError,
	isSuccess,
	error,
	successText,
	successTitle,
	isLoading,
}: ToastProps) => {
	useEffect(() => {
		if (isLoading) return;

		if (isError) {
			toaster.create({
				title: 'Error',
				description: error?.data?.message || 'An error occurred',
				type: 'error',
				duration: 9000,
			});
		}
	}, [isError, isLoading, error]);

	useEffect(() => {
		if (isLoading) return;

		if (isSuccess) {
			toaster.create({
				title: successTitle || 'Success',
				description: successText || 'Operation completed successfully',
				type: 'success',
				duration: 9000,
			});
		}
	}, [isSuccess, isLoading, successText, successTitle]);

	return null;
};

export default useCustomToast;
