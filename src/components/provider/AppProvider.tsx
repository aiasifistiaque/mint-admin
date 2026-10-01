'use client';

import { store } from '@/components/library';
import { system } from '@/theme';
import { Provider } from 'react-redux';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import { Toaster } from '@/components/ui/toaster';
import ThemeSync from '@/components/library/theme/ThemeSync';
import SessionGuard from './SessionGuard';
import PanelGuard from '@/components/library/tenant/PanelGuard';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<ChakraProvider>
				<ThemeSync />
				<SessionGuard />
				{/* The tenant panel's page rules; nothing in the super-admin panel. */}
				<PanelGuard />
				{children}
				<Toaster />
			</ChakraProvider>
		</Provider>
	);
}
