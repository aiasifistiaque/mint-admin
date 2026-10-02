'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IS_TENANT_PANEL, docsPath, setProjectId } from '../config/lib/constants/panel';
import { ADMIN_ONLY_PAGES, TENANT_ONLY_PAGES } from './pages';
import { useWorkspace } from './useWorkspace';

/**
 * Which panel a page belongs to (mounted once in the root providers):
 * - in the tenant panel the super admin's own pages (pages.ts) go home, and
 *   in the super-admin panel the tenant panel's do;
 * - in the tenant panel a /docs guide opens its user guide (/user-docs);
 * - a stored project this account can no longer see is forgotten.
 */
const PanelGuard = () => {
	const pathname = usePathname() || '/';
	const router = useRouter();
	const first = pathname.split('/')[1] || '';
	// Signed-out pages (and the public guides) have no account to read.
	const { staleProject } = useWorkspace({ skip: first === 'auth' || first === 'user-docs' || !IS_TENANT_PANEL });

	useEffect(() => {
		if (IS_TENANT_PANEL && first === 'docs') router.replace(docsPath(`${pathname}${window.location.hash}`));
		else if (IS_TENANT_PANEL ? ADMIN_ONLY_PAGES.has(first) : TENANT_ONLY_PAGES.has(first)) router.replace('/');
	}, [first]);

	useEffect(() => {
		if (!IS_TENANT_PANEL || !staleProject) return;
		setProjectId(null);
		window.location.href = '/projects';
	}, [staleProject]);

	return null;
};

export default PanelGuard;
