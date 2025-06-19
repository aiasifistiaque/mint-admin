import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/provider/AppProvider';

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
			{/* React Scan */}
			<head>
				{/* <script src='https://unpkg.com/react-scan/dist/auto.global.js' /> */}
				{/* rest of your scripts go under */}
			</head>
			<body className={GeistSans.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
