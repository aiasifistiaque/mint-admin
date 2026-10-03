import mainApi from './mainApi';

/**
 * A model's Password field, revealed (backend crud/revealSecret.controller.ts):
 * the person's own sign-in password goes up, the stored value comes back. A
 * wrong password is a 400 with `code: 'wrong_password'`. Never cached.
 */
export const secretApi = mainApi.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		revealSecret: builder.mutation<{ value: string }, { path: string; id: string; field: string; password: string }>({
			query: ({ path, id, field, password }) => ({ url: `${path}/${id}/reveal`, method: 'POST', body: { field, password } }),
		}),
	}),
});

export const { useRevealSecretMutation } = secretApi;
