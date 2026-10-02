/**
 * The one place that knows how a linked repo maps onto a console URL.
 *
 * Both platforms are addressed as `/<console>/<accountId>/<segment>/<project>`
 * but they disagree on the words and on which identifier the route wants:
 * Vercel routes by project **id**, Heroku by app **name**. Getting that wrong
 * produces a 404 that looks like a missing project rather than a bad link, so
 * it is derived here and nowhere else.
 */

export type Platform = 'vercel' | 'heroku';

export type HostingLink = {
	hostedPlatform?: Platform | null;
	hostingAccount?: any;
	hostedProjectId?: string | null;
	hostedProjectName?: string | null;
};

export const PLATFORMS: { value: Platform; label: string }[] = [
	{ value: 'vercel', label: 'Vercel' },
	{ value: 'heroku', label: 'Heroku' },
];

/** The admin list route for a platform's accounts. */
export const accountPath = (platform: Platform): string =>
	platform === 'vercel' ? 'vercels' : 'herokus';

/** The Mongoose model name stored on the repo so `refPath` can populate it. */
export const accountModel = (platform: Platform): string =>
	platform === 'vercel' ? 'VercelAccount' : 'HerokuAccount';

/** Whichever email field that platform's account record happens to use. */
export const accountEmail = (account: any): string =>
	account?.userEmail || account?.accountEmail || account?.label || account?.code || 'Unnamed account';

/** The console page for a linked project, or null when the link is incomplete. */
export const projectHref = (repo?: HostingLink | null): string | null => {
	if (!repo?.hostedPlatform) return null;

	const accountId = repo.hostingAccount?._id || repo.hostingAccount;
	if (!accountId) return null;

	if (repo.hostedPlatform === 'vercel') {
		// Vercel's project route resolves an id or a name; the id is stable
		// across renames, so it wins when both are stored.
		const ref = repo.hostedProjectId || repo.hostedProjectName;
		return ref ? `/vercels/${accountId}/projects/${ref}` : null;
	}

	// Heroku's app route is keyed on the app name, not its UUID.
	const name = repo.hostedProjectName;
	return name ? `/herokus/${accountId}/apps/${name}` : null;
};

export const platformLabel = (platform?: string | null): string =>
	PLATFORMS.find(p => p.value === platform)?.label || '—';
