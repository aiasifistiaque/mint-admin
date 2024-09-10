import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/library/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'MINT',
	description: 'MINT',
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
		userScalable: false,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
