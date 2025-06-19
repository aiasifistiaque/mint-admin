'use client';

import dynamic from 'next/dynamic';

import { store } from '@/components/library';
import { theme } from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { ColorModeScript } from '@chakra-ui/react';

// Create a client-only Redux Provider
const ClientOnlyReduxProvider = dynamic(() => import('./ClientReduxProvider'), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ClientOnlyReduxProvider>
			<ChakraProvider theme={theme}>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				{children}
			</ChakraProvider>
		</ClientOnlyReduxProvider>
	);
}
