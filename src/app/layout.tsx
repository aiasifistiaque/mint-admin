import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/library/providers/Providers';
import 'swiper/css';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
	title: 'ADMIN | MINT | TC',
	description: 'MINT',
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={GeistSans.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
