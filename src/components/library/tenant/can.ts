/**
 * The tenant API's permission rule (backend library/functions/
 * tenantPermissions.function.ts `grants`), for showing only what a role can
 * use. The server checks again on every request.
 */
const RECORD_KEY = /^(view|create|edit|delete)-(.+)$/;

export const can = (permissions: string[] = [], key: string) => {
	if (permissions.includes('*') || permissions.includes(key)) return true;
	const record = key.match(RECORD_KEY);
	if (!record) return false;
	if (permissions.includes('data:*')) return true;
	return record[1] === 'view' && permissions.includes('data:view');
};
