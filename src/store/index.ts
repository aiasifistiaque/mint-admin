import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TOKEN_NAME } from '@/components/library';

import {
	routeSlice,
	tableSlice,
	cartSlice,
	authSlice,
	builderSlice,
} from '@/components/library/store';

import mainApi from '@/components/library/store/services/mainApi';

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		route: routeSlice.reducer,
		table: tableSlice.reducer,
		cart: cartSlice.reducer,
		builder: builderSlice.reducer,
		[mainApi.reducerPath]: mainApi.reducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(mainApi.middleware),
});

store.subscribe(() => {
	const state = store.getState();
	if (typeof window !== 'undefined') {
		if (state.auth.token) {
			localStorage.setItem(TOKEN_NAME, state.auth.token);
		} else {
			localStorage.removeItem(TOKEN_NAME);
		}
	}
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
