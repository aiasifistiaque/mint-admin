'use client';
import { useGetSelfQuery } from '../store/services/authApi';

export type ModalLayout = 'modal' | 'drawer';

// Backed by the admin's own document (`modalLayout`, defaults to 'drawer' —
// see backend/library/models/admin/model.ts) rather than localStorage, so the
// preference follows the admin between browsers/devices. `useGetSelfQuery({})`
// is already called elsewhere in the app (Sidebar, /settings), and RTK Query
// dedupes identical queries into one cache entry, so calling it again here —
// even from many Dialog/MenuModal instances on a page — costs no extra
// requests and stays in sync: `updateSelf` invalidates the `self` tag, which
// refetches this same cache entry and re-renders every subscriber.
// `data` is `undefined` on both the server and the client's first render (the
// query only resolves after mount), so both agree on the 'drawer' fallback —
// no hydration mismatch.
const useModalLayout = (): ModalLayout => {
	const { data } = useGetSelfQuery({});
	return data?.modalLayout === 'modal' ? 'modal' : 'drawer';
};

export default useModalLayout;
