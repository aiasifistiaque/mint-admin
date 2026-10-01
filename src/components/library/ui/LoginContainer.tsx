import { FC, FormEvent, ReactNode } from 'react';
import { Box, Button, Center, CenterProps, Flex, Heading, Image, Text } from '@chakra-ui/react';

type LoginContainerProps = Omit<CenterProps, 'title'> & {
	children: ReactNode;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
	title: ReactNode;
	/** One line under the title saying what this page is for. */
	subtitle?: ReactNode;
	submitLabel?: string;
	/** Leave the submit button out — for a page that only explains something. */
	hideSubmit?: boolean;
	/** Under the button, past a divider: "Back to sign in" and the like. */
	footer?: ReactNode;
	logoSrc?: string;
};

/**
 * The signed-out pages' card (sign in, forgot / reset password, invitations):
 * logo, title, the fields, one full-width button. A card on a tinted page from
 * tablet up; on a phone the card melts into the page so the fields get the width.
 */
const LoginContainer: FC<LoginContainerProps> = ({
	children,
	handleSubmit,
	isLoading,
	title,
	subtitle,
	submitLabel = 'Continue',
	hideSubmit,
	footer,
	logoSrc,
	...props
}) => (
	<Center
		w='full'
		minH='100dvh'
		flex={1}
		px={4}
		py={{ base: 10, md: 16 }}
		bg={{ base: 'bg.panel', md: 'sidebar.light' }}
		_dark={{ bg: { base: 'sidebar.dark', md: 'container.dark' } }}
		{...props}>
		<Flex
			as='form'
			// @ts-ignore — Flex as form
			onSubmit={handleSubmit}
			direction='column'
			gap={6}
			w='full'
			maxW='420px'
			p={{ base: 2, md: 8 }}
			bg={{ base: 'transparent', md: 'bg.panel' }}
			_dark={{ bg: { base: 'transparent', md: 'sidebar.dark' } }}
			borderWidth={{ base: 0, md: 1 }}
			borderColor='border'
			borderRadius='24px'
			boxShadow={{ base: 'none', md: 'lg' }}>
			<Flex
				direction='column'
				align='center'
				textAlign='center'
				gap={4}>
				<Image
					boxSize='48px'
					objectFit='contain'
					src={logoSrc || '/logo.png'}
					alt=''
				/>
				<Box>
					<Heading
						as='h1'
						fontSize={{ base: '22px', md: '24px' }}
						fontWeight='600'
						letterSpacing='-0.01em'
						lineHeight='1.25'>
						{title}
					</Heading>
					{subtitle && (
						<Text
							mt={1.5}
							fontSize='14px'
							color='fg.muted'>
							{subtitle}
						</Text>
					)}
				</Box>
			</Flex>

			<Flex
				direction='column'
				gap={4}>
				{children}
			</Flex>

			{!hideSubmit && (
				<Button
					type='submit'
					size='lg'
					w='full'
					borderRadius='lg'
					loading={isLoading}>
					{submitLabel}
				</Button>
			)}

			{footer && (
				<Box
					pt={5}
					borderTopWidth={1}
					borderColor='border.muted'
					fontSize='13px'
					color='fg.muted'
					textAlign='center'>
					{footer}
				</Box>
			)}
		</Flex>
	</Center>
);

export default LoginContainer;
