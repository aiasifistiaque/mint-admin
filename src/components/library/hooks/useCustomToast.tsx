'use client';

import { Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Icon } from '../icon';

type ToastProps = {
	isError?: boolean;
	isSuccess?: boolean;
	error?: any;
	successText?: string;
	successTitle?: string;
	isLoading: boolean;
};

const VARIANT = 'solid';
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
		// isSuccess &&
		// 	toast({
		// 		title: successTitle || 'Success',
		// 		description: successText || 'success',
		// 		status: 'success',
		// 		duration: DURATION,
		// 		isClosable: IS_CLOSABLE,
		// 		variant: 'solid',
		// 		position: POSITION,
		// 	});
		isSuccess &&
			toast({
				duration: DURATION,
				position: POSITION,
				isClosable: IS_CLOSABLE,
				render: () => (
					<Flex {...successContainer}>
						<Flex pt={1}>
							<Icon
								name='check'
								color='inherit'
							/>
						</Flex>

						<Flex
							gap={1}
							flexDir='column'>
							<Heading
								{...textColor}
								size='sm'>
								{successTitle || 'Success'}
							</Heading>
							<Text {...textColor}>{successText || 'success'}</Text>
						</Flex>
					</Flex>
				),
			});
	}, [isLoading]);

	return null;
};

const textColor = {
	_light: { color: 'text.dark' },
	_dark: { color: 'text.light' },
};
const container = {
	borderRadius: '8px',
	p: 4,
	gap: 3,
};

const successContainer = {
	...container,
	_light: {
		bg: '#171717',
		color: '#fafafa',
	},
	_dark: {
		bg: '#eee',
		color: '#222',
	},
};

export default useCustomToast;
