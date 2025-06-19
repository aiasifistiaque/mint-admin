'use client';
import { Box, Button, Flex, FlexProps, ButtonProps, useToast } from '@chakra-ui/react';
import { FC, useEffect, ReactNode, FormEvent } from 'react';

type FormProps = ButtonProps &
	FlexProps & {
		children: ReactNode;
		onSubmit: (e: FormEvent<HTMLFormElement>) => void;
		buttonText?: string;
		isError?: boolean;
		error?: any;
		isSuccess?: boolean;
		success?: string;
		isLoading?: boolean;
		button?: ReactNode;
	};

const Form: FC<FormProps> = ({
	children,
	isLoading,
	isError,
	error,
	buttonText = 'Submit',
	onSubmit,
	success,
	isSuccess,
	button,
	...props
}) => {
	const toast = useToast();

	useEffect(() => {
		if (isLoading) return;
		const title = isError ? 'An error occurred.' : 'Success';
		const description = isError
			? error?.data?.message || 'Something went wrong.'
			: success || 'Login successful';
		const status = isError ? 'error' : 'success';

		if (isError || isSuccess)
			toast({
				title,
				description,
				status,
				duration: 5000,
				isClosable: true,
				variant: 'left-accent',
			});
	}, [isLoading]);

	return (
		<Flex
			flexDir='column'
			w='full'
			as='form'
			onSubmit={onSubmit}>
			{children}

			<Box pt={4}>
				{button ? (
					button
				) : (
					<Button
						type='submit'
						isLoading={isLoading}
						{...props}>
						{buttonText}
					</Button>
				)}
			</Box>
		</Flex>
	);
};

export default Form;
