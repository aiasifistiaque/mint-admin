import mainApi from './mainApi';

/**
 * The tenant panel's own calls (backend routes-tenant; docs:
 * backend/docs/multi-tenancy): organizations, members, roles, invitations
 * and projects. Everything else the tenant panel does goes through the same
 * hooks as the admin panel — `auth/self`, tables, the builder — at the tenant
 * API (config/lib/constants/panel.ts picks the base per request).
 */

export type OrgRef = { _id: string; name: string; slug: string; logo?: string; role?: string; system?: SystemRole };
export type SystemRole = 'owner' | 'admin' | 'member' | null;

export type Onboarding = {
	businessName?: string;
	industry?: string;
	teamSize?: string;
	role?: string;
	website?: string;
	country?: string;
	heardFrom?: string;
	heardFromOther?: string;
	goals?: string[];
};

export type Organization = {
	_id: string;
	name: string;
	slug: string;
	logo?: string;
	plan?: string;
	owner: string;
	onboarding?: Onboarding;
	counts?: { members: number; projects: number; websites: number };
	createdAt?: string;
};

export type ProjectType = 'app' | 'website';
/** Whose media library a project uses (WO-23). */
export type MediaScope = 'project' | 'organization';

/** Which projects a member (or invitation) opens (WO-22): every one, or these ids. */
export type ProjectAccess = { allProjects: boolean; projects: string[] };

export type TenantProject = {
	_id: string;
	name: string;
	slug: string;
	publicSlug: string;
	type: ProjectType;
	description?: string;
	icon?: string;
	color?: string;
	domains?: string[];
	mediaScope?: MediaScope;
	isActive: boolean;
	models?: number;
	createdAt?: string;
};

export type Member = ProjectAccess & {
	_id: string;
	user: { _id: string; name: string; email: string; image?: string; twoFactorEnabled?: boolean };
	role: { _id: string; name: string; system: SystemRole };
	status: 'active' | 'removed';
	joinedAt: string;
};

export type OrgRole = {
	_id: string;
	name: string;
	description?: string;
	permissions: string[];
	system: SystemRole;
	members: number;
};

export type Invitation = ProjectAccess & {
	_id: string;
	email: string;
	name?: string;
	role?: { _id: string; name: string };
	invitedBy?: { _id: string; name: string } | null;
	expiresAt: string;
	expired: boolean;
	lastSentAt?: string;
	createdAt: string;
};

/** The standard permissions (WO-21), in their groups: Records, Projects, Organization. */
export type PermissionCatalog = {
	organization: { key: string; group: string; label: string; description: string }[];
};

export type InvitationInfo = {
	email: string;
	name?: string;
	organization: { name: string; logo?: string };
	role?: string;
	allProjects: boolean;
	projects: string[];
	existingAccount: boolean;
	/** The reader is signed in to the invited account: joining takes one click. */
	signedInAsInvitee?: boolean;
	expiresAt: string;
};

/** An invitation to the signed-in account's (verified) email, shown in the app (WO-24). */
export type MyInvitation = {
	_id: string;
	organization: { _id: string; name: string; logo?: string };
	role?: string;
	invitedBy?: string;
	allProjects: boolean;
	projects: string[];
	expiresAt: string;
};

export type RegisterBody = {
	name: string;
	email: string;
	password: string;
	organization: string;
	onboarding?: Onboarding;
};

export type AnalyticsTotals = { pageviews: number; visitors: number; sessions: number; pagesPerSession: number; bounceRate: number };
export type AnalyticsDim = 'paths' | 'referrers' | 'devices' | 'browsers' | 'os' | 'countries' | 'clicks' | 'events';
export type AnalyticsRange = { from?: string; to?: string };
export type PublicApi = { enabled: boolean; actions: ('list' | 'get' | 'create' | 'update' | 'delete')[]; auth: 'none' | 'customer'; ownerOnly: boolean };

const rangeQuery = (r: AnalyticsRange = {}) => new URLSearchParams(Object.entries(r).filter(([, v]) => v) as [string, string][]).toString();

const ORG = ['tenant-org', 'self'];

export const tenantApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		/* ---------------------------------------------------------- sign-up */
		tenantRegister: builder.mutation<{ token: string }, RegisterBody>({
			query: body => ({ url: 'auth/register', method: 'POST', body }),
		}),

		/* ---------------------------------------------------- organizations */
		getOrganization: builder.query<Organization, void>({
			query: () => 'org',
			providesTags: ['tenant-org'],
		}),
		updateOrganization: builder.mutation<Organization, { name?: string; logo?: string; onboarding?: Onboarding }>({
			query: body => ({ url: 'org', method: 'PUT', body }),
			invalidatesTags: ORG,
		}),
		getMyOrganizations: builder.query<{ doc: OrgRef[] }, void>({
			query: () => 'org/list',
			providesTags: ['tenant-org'],
		}),
		createOrganization: builder.mutation<{ token: string; organization: Organization }, { name: string; onboarding?: Onboarding }>({
			query: body => ({ url: 'org', method: 'POST', body }),
		}),
		switchOrganization: builder.mutation<{ token: string }, string>({
			query: id => ({ url: `org/switch/${id}`, method: 'POST' }),
		}),
		transferOwnership: builder.mutation<{ message: string }, { member: string }>({
			query: body => ({ url: 'org/transfer-ownership', method: 'POST', body }),
			invalidatesTags: [...ORG, 'tenant-members', 'tenant-roles'],
		}),

		/* ---------------------------------------------------------- members */
		getMembers: builder.query<{ doc: Member[]; total: number }, void>({
			query: () => 'org/members',
			providesTags: ['tenant-members'],
		}),
		updateMember: builder.mutation<Member, { id: string; role?: string } & Partial<ProjectAccess>>({
			query: ({ id, ...body }) => ({ url: `org/members/${id}`, method: 'PUT', body }),
			invalidatesTags: ['tenant-members', 'tenant-roles'],
		}),
		removeMember: builder.mutation<{ message: string }, string>({
			query: id => ({ url: `org/members/${id}`, method: 'DELETE' }),
			invalidatesTags: ['tenant-members', 'tenant-roles', 'tenant-org'],
		}),

		/* ------------------------------------------------------------ roles */
		getOrgRoles: builder.query<{ doc: OrgRole[] }, void>({
			query: () => 'org/roles',
			providesTags: ['tenant-roles'],
		}),
		getOrgPermissions: builder.query<PermissionCatalog, void>({
			query: () => 'org/permissions',
			providesTags: ['tenant-roles', 'tenant-projects'],
		}),
		createOrgRole: builder.mutation<OrgRole, { name: string; description?: string; permissions: string[] }>({
			query: body => ({ url: 'org/roles', method: 'POST', body }),
			invalidatesTags: ['tenant-roles'],
		}),
		updateOrgRole: builder.mutation<OrgRole, { id: string; name: string; description?: string; permissions: string[] }>({
			query: ({ id, ...body }) => ({ url: `org/roles/${id}`, method: 'PUT', body }),
			invalidatesTags: ['tenant-roles', 'self'],
		}),
		deleteOrgRole: builder.mutation<{ message: string }, string>({
			query: id => ({ url: `org/roles/${id}`, method: 'DELETE' }),
			invalidatesTags: ['tenant-roles'],
		}),

		/* ------------------------------------------------------ invitations */
		getInvitations: builder.query<{ doc: Invitation[] }, void>({
			query: () => 'org/invitations',
			providesTags: ['tenant-invitations'],
		}),
		inviteMember: builder.mutation<Invitation, { email: string; name?: string; role: string } & Partial<ProjectAccess>>({
			query: body => ({ url: 'org/invitations', method: 'POST', body }),
			invalidatesTags: ['tenant-invitations'],
		}),
		resendInvitation: builder.mutation<{ message: string }, string>({
			query: id => ({ url: `org/invitations/${id}/resend`, method: 'POST' }),
			invalidatesTags: ['tenant-invitations'],
		}),
		cancelInvitation: builder.mutation<{ message: string }, string>({
			query: id => ({ url: `org/invitations/${id}`, method: 'DELETE' }),
			invalidatesTags: ['tenant-invitations'],
		}),
		getTenantInvitation: builder.query<InvitationInfo, string>({
			query: token => `invitations/${token}`,
		}),
		acceptTenantInvitation: builder.mutation<{ token: string; message: string }, { token: string; name?: string; phone?: string; password?: string }>({
			query: ({ token, ...body }) => ({ url: `invitations/${token}/accept`, method: 'POST', body }),
		}),

		/* ------------------------------------ invitations for me (WO-24) */
		getMyInvitations: builder.query<{ verified: boolean; email: string; doc: MyInvitation[] }, void>({
			query: () => 'invitations/for-me',
			providesTags: ['tenant-invitations', 'self'],
		}),
		acceptMyInvitation: builder.mutation<{ token: string; message: string }, string>({
			query: id => ({ url: `invitations/for-me/${id}/accept`, method: 'POST' }),
		}),
		declineMyInvitation: builder.mutation<{ message: string }, string>({
			query: id => ({ url: `invitations/for-me/${id}`, method: 'DELETE' }),
			invalidatesTags: ['tenant-invitations'],
		}),
		sendEmailCode: builder.mutation<{ message: string; verified?: boolean }, void>({
			query: () => ({ url: 'auth/verify-email/send', method: 'POST' }),
		}),
		verifyEmail: builder.mutation<{ message: string; verified: boolean }, { code: string }>({
			query: body => ({ url: 'auth/verify-email', method: 'POST', body }),
			invalidatesTags: ['self', 'tenant-invitations'],
		}),

		/* --------------------------------------------------------- projects */
		getProjects: builder.query<{ doc: TenantProject[] }, { archived?: boolean } | void>({
			query: arg => `projects${arg && arg.archived ? '?archived=1' : ''}`,
			providesTags: ['tenant-projects'],
		}),
		createProject: builder.mutation<
			TenantProject,
			{ name: string; type: ProjectType; description?: string; domains?: string[]; color?: string; icon?: string; mediaScope?: MediaScope }
		>({
			query: body => ({ url: 'projects', method: 'POST', body }),
			invalidatesTags: ['tenant-projects', 'self', 'tenant-org'],
		}),
		updateProject: builder.mutation<TenantProject, { id: string } & Partial<Omit<TenantProject, '_id'>>>({
			query: ({ id, ...body }) => ({ url: `projects/${id}`, method: 'PUT', body }),
			invalidatesTags: ['tenant-projects', 'self', 'tenant-org'],
		}),
		deleteProject: builder.mutation<{ message: string }, { id: string; force?: boolean }>({
			query: ({ id, force }) => ({ url: `projects/${id}${force ? '?force=1' : ''}`, method: 'DELETE' }),
			invalidatesTags: ['tenant-projects', 'self', 'tenant-org'],
		}),

		/* ------------------------------------- inside the open project */
		getAnalyticsSummary: builder.query<{ current: AnalyticsTotals; previous: AnalyticsTotals; from: string; to: string }, AnalyticsRange>({
			query: r => `analytics/summary?${rangeQuery(r)}`,
			providesTags: ['tenant-analytics'],
		}),
		getAnalyticsSeries: builder.query<{ days: { date: string; pageviews: number; visitors: number }[] }, AnalyticsRange>({
			query: r => `analytics/timeseries?${rangeQuery(r)}`,
			providesTags: ['tenant-analytics'],
		}),
		getAnalyticsTop: builder.query<{ rows: { value: string; count: number; visitors: number }[] }, AnalyticsRange & { dim: AnalyticsDim; limit?: number }>({
			query: ({ dim, limit, ...r }) => `analytics/top?dim=${dim}&limit=${limit || 8}&${rangeQuery(r)}`,
			providesTags: ['tenant-analytics'],
		}),
		updatePublicApi: builder.mutation<{ publicApi: PublicApi }, { id: string } & PublicApi>({
			query: ({ id, ...body }) => ({ url: `builder/models/${id}/public-api`, method: 'PUT', body }),
			invalidatesTags: ['builder'],
		}),
	}),
});

export const {
	useTenantRegisterMutation,
	useGetOrganizationQuery,
	useUpdateOrganizationMutation,
	useGetMyOrganizationsQuery,
	useCreateOrganizationMutation,
	useSwitchOrganizationMutation,
	useTransferOwnershipMutation,
	useGetMembersQuery,
	useUpdateMemberMutation,
	useRemoveMemberMutation,
	useGetOrgRolesQuery,
	useGetOrgPermissionsQuery,
	useCreateOrgRoleMutation,
	useUpdateOrgRoleMutation,
	useDeleteOrgRoleMutation,
	useGetInvitationsQuery,
	useInviteMemberMutation,
	useResendInvitationMutation,
	useCancelInvitationMutation,
	useGetTenantInvitationQuery,
	useAcceptTenantInvitationMutation,
	useGetMyInvitationsQuery,
	useAcceptMyInvitationMutation,
	useDeclineMyInvitationMutation,
	useSendEmailCodeMutation,
	useVerifyEmailMutation,
	useGetProjectsQuery,
	useCreateProjectMutation,
	useUpdateProjectMutation,
	useDeleteProjectMutation,
	useGetAnalyticsSummaryQuery,
	useGetAnalyticsSeriesQuery,
	useGetAnalyticsTopQuery,
	useUpdatePublicApiMutation,
} = tenantApi;
