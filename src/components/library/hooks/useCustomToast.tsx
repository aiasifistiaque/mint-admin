'use client';

import { Flex, Heading, Text, useToast, CloseButton, FlexProps } from '@chakra-ui/react';
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
				status: 'error',
				duration: DURATION,
				isClosable: IS_CLOSABLE,
				variant: VARIANT,
				position: POSITION,
				render: ({ onClose }) => (
					<ToastBody
						{...errorContainer}
						onClose={onClose}
						title={'Error'}>
						{error?.data?.message}
					</ToastBody>
				),
			});
	}, [isLoading]);

	useEffect(() => {
		if (isLoading) return;

		isSuccess &&
			toast({
				duration: DURATION,
				position: POSITION,
				isClosable: IS_CLOSABLE,
				render: ({ onClose }) => (
					<ToastBody
						{...successContainer}
						onClose={onClose}
						title={successTitle || 'success'}>
						{successText || 'success'}
					</ToastBody>
				),
			});
	}, [isLoading]);

	return null;
};

const ToastBody = ({
	title,
	children,
	onClose,
	...props
}: FlexProps & { title: string; children: string; onClose: any }) => (
	<Flex
		{...props}
		position='relative'>
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
				{title}
			</Heading>
			<Text {...textColor}>{children}</Text>
		</Flex>
		<CloseButton
			onClick={onClose}
			position='absolute'
			top={2}
			right={2}
			zIndex={1}
		/>
	</Flex>
);

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

const errorContainer = {
	...container,
	_light: {
		bg: 'red.500',
		color: '#fafafa',
	},
	_dark: {
		bg: 'red.300',
		color: '#222',
	},
};

export default useCustomToast;
