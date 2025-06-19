import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

type ToastProps = {
	isError?: boolean;
	isSuccess?: boolean;
	error?: any;
	successText?: string;
	successTitle?: string;
};

const Toast: React.FC<ToastProps> = ({ isError, isSuccess, error, successText, successTitle }) => {
	const toast = useToast();

	useEffect(() => {
		isError &&
			toast({
				title: 'Error',
				description: error?.data?.message || 'Error Loading Data',
				status: 'error',
				duration: 9000,
				isClosable: true,
				variant: 'left-accent',
			});
	}, [isError]);

	useEffect(() => {
		isSuccess &&
			toast({
				title: successTitle || 'Success',
				description: successText || 'success',
				status: 'success',
				duration: 9000,
				isClosable: true,
				variant: 'left-accent',
			});
	}, [isSuccess, isError]);

	return null;
};

export default Toast;
