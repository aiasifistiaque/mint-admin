'use client';

import { useGetSelfQuery } from '../store';
import { IS_TENANT_PANEL, getProjectId, setProjectId } from '../config/lib/constants/panel';
import type { OrgRef, TenantProject } from '../store/services/tenantApi';
import { can } from './can';

/**
 * Where the tenant panel is working: the account, its organization (and the
 * others it can switch to), its role, and the project open in this browser.
 * Read from `auth/self`, which the tenant API fills with all of it.
 */
export const useWorkspace = ({ skip = false }: { skip?: boolean } = {}) => {
	const { data: self, isLoading, isFetching } = useGetSelfQuery({}, { skip: skip || !IS_TENANT_PANEL });
	const projects: TenantProject[] = self?.projects || [];
	const projectId = getProjectId();
	const project = projects.find(p => p._id === projectId) || null;
	const permissions: string[] = self?.permissions || [];
	return {
		self,
		isLoading,
		isFetching,
		organization: self?.organization || null,
		organizations: (self?.organizations || []) as OrgRef[],
		role: self?.role || null,
		permissions,
		can: (key: string) => can(permissions, key),
		projects,
		project,
		/** A project id is stored but this account can't see it (deleted, archived, another organization). */
		staleProject: !!projectId && !!self && !project,
	};
};

/** Opens a project: it becomes this browser's working project, and the panel starts over in it. */
export const openProject = (id: string, to = '/') => {
	setProjectId(id);
	window.location.href = to;
};

/** Back to the organization, no project open. */
export const leaveProject = (to = '/projects') => {
	setProjectId(null);
	window.location.href = to;
};
