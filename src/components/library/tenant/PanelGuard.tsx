'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IS_TENANT_PANEL, setProjectId } from '../config/lib/constants/panel';
import { ADMIN_ONLY_PAGES } from './pages';
import { useWorkspace } from './useWorkspace';

/**
 * The tenant panel's page rules (mounted once in the root providers; renders
 * nothing in the super-admin panel):
 * - the super admin's own pages (pages.ts) go home;
 * - a stored project this account can no longer see is forgotten.
 */
const PanelGuard = () => {
	const pathname = usePathname() || '/';
	const router = useRouter();
	const first = pathname.split('/')[1] || '';
	// Signed-out pages have no account to read.
	const { staleProject } = useWorkspace({ skip: first === 'auth' });

	useEffect(() => {
		if (!IS_TENANT_PANEL) return;
		if (ADMIN_ONLY_PAGES.has(first)) router.replace('/');
	}, [first]);

	useEffect(() => {
		if (!IS_TENANT_PANEL || !staleProject) return;
		setProjectId(null);
		window.location.href = '/projects';
	}, [staleProject]);

	return null;
};

export default PanelGuard;
