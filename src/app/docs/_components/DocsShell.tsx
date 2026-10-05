'use client';

import { FC, ReactNode, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { AuthWrapper } from '@/components/library';
import { IS_TENANT_PANEL, docsPath } from '@/components/library/config/lib/constants/panel';
import Footer from '@/components/library/nav/Footer';
import DocsNavbar, { DocsNav } from './DocsNavbar';

/**
 * The frame of every /docs page: the docs navbar, the page, the footer — and
 * no admin sidebar, so a guide reads as documentation rather than as another
 * admin screen.
 *
 * `nav` swaps the navbar's links — the user guides (/user-docs) use it.
 *
 * In the tenant panel a /docs guide (no `nav`) isn't shown: it goes straight
 * to its user guide (docsPath) — before the sign-in check, which would
 * otherwise send a signed-out reader to the login page first.
 *
 * `requireLogin` keeps a guide behind sign-in, as it was inside the admin
 * layout. The docs home and the sign-in & security guide leave it off: the
 * latter is linked from the sign-in step, before anyone is signed in.
 */
const DocsShell: FC<{ current: string; requireLogin?: boolean; nav?: DocsNav; children: ReactNode }> = ({
	current,
	requireLogin = false,
	nav,
	children,
}) => {
	const toUserGuide = IS_TENANT_PANEL && !nav;
	useEffect(() => {
		// The user guides are another site (DOCS_URL): a full page load.
		if (toUserGuide) window.location.replace(docsPath(`${window.location.pathname}${window.location.hash}`));
	}, [toUserGuide]);
	if (toUserGuide) return null;

	const page = (
		<Box
			minH='100vh'
			bg='bg'
			display='flex'
			flexDirection='column'>
			<DocsNavbar
				current={current}
				nav={nav}
			/>
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
