import React, { FC } from 'react';
import {
	Grid,
	Input,
	Text,
	InputProps,
	Button,
	Box,
	Textarea,
	TextareaProps,
	useColorModeValue,
} from '@chakra-ui/react';
import UpdatePasswordModal from '../modals/update-password/UpdatePasswordModal';

type DetailProps = InputProps &
	TextareaProps & {
		title: string;
		children: any;
		editing: boolean;
		isPassword?: boolean;
		type?: 'input' | 'textarea';
	};

const Details: FC<DetailProps> = ({ title, children, editing, type, isPassword, ...props }) => {
	const textBox = (
		<Text
			px={3}
			py={1}
			fontSize='.9rem'>
			{children}
		</Text>
	);

	const passwordBox = (
		<Box>
			<UpdatePasswordModal trigger={<Button size='sm'>Change Password</Button>} />
		</Box>
	);

	const inputTextColor = useColorModeValue('text.500', 'gray.300');

	const styleProps = {
		borderRadius: 'lg',
		color: inputTextColor,
		size: 'sm',
		w: { base: '100%', md: '400px' },
	};

	const inputBox =
		type == 'textarea' ? (
			<Textarea
				{...styleProps}
				value={children}
				{...props}
			/>
		) : (
			<Input
				{...styleProps}
				value={children}
				{...props}
			/>
		);

	return (
		<Grid
			gridTemplateColumns={{ base: '1fr 2fr', md: '1fr 3fr' }}
			w='100%'
			h='50px'>
			<Text
				py={1}
				fontWeight='600'
				fontSize='.9rem'>
				{title}
			</Text>
			{isPassword ? passwordBox : editing ? inputBox : textBox}
		</Grid>
	);
};

export default Details;
