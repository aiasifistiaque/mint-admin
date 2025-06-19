'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Center, CloseButton, Divider, Flex, Heading } from '@chakra-ui/react';
import { Navbar, THEME } from '../index';

type CreateNavProps = {
	title: string;
	path: string;
	isLoading: boolean;
};

const CreateNav: FC<CreateNavProps> = ({ title, path, isLoading }) => {
	const router = useRouter();
	const handleBackClick = () => {
		router.replace(`/${path}`);
	};

	const headings = (
		<>
			<CloseButton
				colorScheme='brand'
				color='white'
				onClick={handleBackClick}
			/>
			<Divider
				h={6}
				orientation='vertical'
			/>
			<Heading
				color='white'
				size='xs'>
				{title}
			</Heading>
		</>
	);

	const buttons = (
		<>
			<Button
				onClick={handleBackClick}
				size='sm'
				isLoading={isLoading}
				colorScheme='gray'>
				Discard
			</Button>
			<Button
				type='submit'
				size='sm'
				isLoading={isLoading}>
				Save
			</Button>
		</>
	);

	return (
		<Navbar
			bg={THEME == 'basic' ? 'navbar.400' : 'navbar.light'}
			px={6}
			justify='space-between'>
			<Flex
				gap={3}
				align='center'
				flex={1}>
				{headings}
			</Flex>
			<Center
				flex={1}
				justifyContent='flex-end'
				gap={2}>
				{buttons}
			</Center>
		</Navbar>
	);
};

export default CreateNav;
