import { FC, ReactNode } from 'react';
import {
	Center,
	Button,
	Heading,
	Image,
	FlexProps,
	CenterProps,
	ButtonProps,
} from '@chakra-ui/react';

type AttendanceProps = FlexProps & {
	children: ReactNode;
	handleSubmit: any;
	isLoading: boolean;
	logoSrc?: string;
};

const Attendance: FC<AttendanceProps> = ({
	children,
	handleSubmit,
	isLoading,
	logoSrc,
	title,
	...props
}) => {
	return (
		<Center
			{...containerCss}
			{...props}>
			<form
				onSubmit={handleSubmit}
				style={{ width: '100%' }}>
				<Center {...innerContainerCss}>
					<Center
						pb={{ base: 16, md: 8 }}
						flexDir='column'
						gap={4}>
						<Heading>{title}</Heading>

						<Image
							h='64px'
							w='64px'
							src={logoSrc || '/logo.png'}
							alt='logo'
						/>
					</Center>
					{children}
					<Button
						{...submitButtonCss}
						isLoading={isLoading}>
						Submit
					</Button>
				</Center>
			</form>
		</Center>
	);
};

const containerCss: CenterProps = {
	w: '100vw',
	flex: 1,
	h: '100vh',
	gap: 2,
	bg: 'sidebar.light',
	_dark: { bg: 'container.dark' },
	px: 4,
	flexDirection: 'column',
};

const innerContainerCss: CenterProps = {
	bg: 'white',
	_dark: { bg: 'sidebar.dark' },
	p: { base: 4, md: 8 },
	flexDir: 'column',
	gap: 3,
	w: { base: 'full', md: '400px' },
	mx: { md: 'auto' },
	boxShadow: 'lg',
	borderRadius: '24px',
	h: { base: '80vh', md: '70vh' },
};

const submitButtonCss: ButtonProps = {
	mt: 4,
	w: 'full',
	borderRadius: 'lg',
	size: 'md',
	type: 'submit',
};

export default Attendance;
