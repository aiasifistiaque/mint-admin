'use client';

import { useEffect, useState, useCallback } from 'react';

const MOBILE_BREAKPOINT = 800;
const DEBOUNCE_DELAY = 200;

// Flips true the first time any component's mount effect below has run —
// i.e. once the initial SSR hydration pass is behind us. Components that
// mount later (a lazily-mounted dialog, for instance) can then read the
// real viewport width on their very first render instead of lying `false`
// for a frame: two independent useIsMobile() instances briefly disagreeing
// (one already corrected, one still on its stale first render) is how a
// dialog picked Drawer.Root while its header still rendered Dialog.Header.
let hasHydrated = false;

function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

const useIsMobile = () => {
	const getIsMobile = () =>
		typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false;

	// Before hydration has settled, start `false` (matches the server, which
	// has no `window`) so the first client render agrees with the SSR markup.
	// After that point `hasHydrated` is true and it's safe to read the real
	// value immediately — see the comment on `hasHydrated` above.
	const [isMobile, setIsMobile] = useState(() => (hasHydrated ? getIsMobile() : false));

	const handleResize = useCallback(
		debounce(() => {
			setIsMobile(getIsMobile());
		}, DEBOUNCE_DELAY),
		[]
	);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Set initial value
		hasHydrated = true;
		setIsMobile(getIsMobile());

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, [handleResize]);

	return isMobile;
};

export default useIsMobile;
