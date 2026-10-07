import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/provider/AppProvider';

import 'swiper/css';
import { GeistSans } from 'geist/font/sans';
import Script from 'next/script';
import { THEME_BOOT_SCRIPT } from '@/theme/themeBoot';
import { IS_TENANT_PANEL } from '@/components/library/config/lib/constants/panel';

// The tenant panel (same app, NEXT_PUBLIC_PANEL=tenant) is MINT to its users:
// pages set their part ('Sign in' → 'Sign in · MINT'), and panel pages set the
// tab's title from Layout with the project's name (panel.ts tabTitle).
export const metadata: Metadata = IS_TENANT_PANEL
	? { title: { default: 'MINT', template: '%s · MINT' }, description: 'Your MINT workspace — projects, data, websites and APIs.' }
	: { title: { default: 'ADMIN | MINT | TC', template: '%s | ADMIN | MINT | TC' }, description: 'MINT' };

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
				{/* The admin's colour theme, replayed from the last visit before
				    first paint (see theme/applyTheme.ts). next/script rather than a
				    bare <script>: React treats a plain one here as a hydration
				    mismatch. */}
				<Script
					id='admin-theme-boot'
					strategy='beforeInteractive'>
					{THEME_BOOT_SCRIPT}
				</Script>
			</head>
			<body className={GeistSans.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
