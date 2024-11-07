'use client';

import { store } from '@/store';
import { theme } from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { ColorModeScript } from '@chakra-ui/react';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		// <CacheProvider>
		// </CacheProvider>
		<Provider store={store}>
			<ChakraProvider theme={theme}>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				{children}
			</ChakraProvider>
		</Provider>
	);
}
