'use client';

import { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { AuthWrapper } from '@/components/library';
import Footer from '@/components/library/nav/Footer';
import DocsNavbar from './DocsNavbar';

/**
 * The frame of every /docs page: the docs navbar, the page, the footer — and
 * no admin sidebar, so a guide reads as documentation rather than as another
 * admin screen.
 *
 * `requireLogin` keeps a guide behind sign-in, as it was inside the admin
 * layout. The docs home and the sign-in & security guide leave it off: the
 * latter is linked from the sign-in step, before anyone is signed in.
 */
const DocsShell: FC<{ current: string; requireLogin?: boolean; children: ReactNode }> = ({
	current,
	requireLogin = false,
	children,
}) => {
	const page = (
		<Box
			minH='100vh'
			bg='bg'
			display='flex'
			flexDirection='column'>
			<DocsNavbar current={current} />
			<Box
				as='main'
				flex={1}
				w='full'
				// 1040px of content inside the padding — the width every guide was
				// written for (the "On this page" list plus a 760px column).
				maxW={{ base: 'full', md: '1120px' }}
				mx='auto'
				px={{ base: 4, md: 10 }}
				py={{ base: 6, md: 8 }}>
				{children}
			</Box>
			<Footer />
		</Box>
	);
	return requireLogin ? <AuthWrapper>{page}</AuthWrapper> : page;
};

export default DocsShell;
