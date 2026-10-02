import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

// The app's top-level pages (src/app/<page>). In the tenant panel a first
// segment that isn't one of them is a project: /<project>/<page> (src/proxy.ts,
// panel.ts). Read here so the list never falls behind the folders.
const APP_PAGES = readdirSync(fileURLToPath(new URL('./src/app', import.meta.url)), { withFileTypes: true })
	.filter(d => d.isDirectory() && /^[a-z0-9]/.test(d.name))
	.map(d => d.name);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: { NEXT_PUBLIC_APP_PAGES: APP_PAGES.join(',') },
	// The tenant panel (NEXT_PUBLIC_PANEL=tenant) can run next to the admin in dev
	// from this same folder — each needs its own build output.
	distDir: process.env.NEXT_DIST_DIR || '.next',
	experimental: {
		// Turbopack's production scope hoisting (Next 16.0.10) miscompiles the
		// library barrels: a merged module imports a re-exported component via
		// the barrel's own module id, so e.g. `VInput` from '@/components/library'
		// is `barrel.default` = undefined (React #130, blank /auth/login). Which
		// export breaks moves around as imports change. Dev never hoists, so it
		// only shows after `next build`. Re-test before removing on a Next upgrade.
		turbopackScopeHoisting: false,
	},
	turbopack: {
		root: '/Users/asifistiaque/Desktop/proj/e-mint/admin',
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	webpack: (config, { webpack }) => {
		config.cache = true;

		// Handle Quill modules
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		// Ignore specific modules that cause issues
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
		};

		return config;
	},
};

export default nextConfig;
