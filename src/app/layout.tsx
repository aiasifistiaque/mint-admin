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
	// next-themes sets `className`/`style` on this tag after mount to match the
	// resolved color mode, which will never match the plain server markup —
	// that's expected, not a bug, so hydration warnings for this one element
	// are suppressed rather than "fixed" by faking SSR theme detection.
	// See https://github.com/pacocoursey/next-themes#with-app
	return (
		<html
			lang='en'
			suppressHydrationWarning>
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
