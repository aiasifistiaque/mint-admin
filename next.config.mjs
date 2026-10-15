import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

// The app's top-level pages (src/app/<page>). In the tenant panel a first
// segment that isn't one of them is a project: /<project>/<page> (src/proxy.ts,
// panel.ts). Read here so the list never falls behind the folders.
const APP_PAGES = readdirSync(fileURLToPath(new URL('./src/app', import.meta.url)), { withFileTypes: true })
	.filter(d => d.isDirectory() && /^[a-z0-9]/.test(d.name))
	.map(d => d.name);

// The user guides moved to their own site (mint-docs). Same paths without the
// /user-docs prefix and the same #anchors, so every old link and bookmark lands
// on the same section (the browser keeps the #anchor across a redirect).
const DOCS_URL = (process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.mintapp.shop').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: { NEXT_PUBLIC_APP_PAGES: APP_PAGES.join(',') },
	// No image optimizer (billed per image on Vercel): plain <img> / Chakra Image only.
	images: { unoptimized: true },
	async redirects() {
		return [
			{ source: '/user-docs', destination: DOCS_URL, permanent: false },
			{ source: '/user-docs/:path*', destination: `${DOCS_URL}/:path*`, permanent: false },
			// The backend's tenant sidebar links the API builder's pages (backend docs/api-builder), which live in
			// mint-tenant. Until the tenant panel moves there, this build's one-page Public API answers for them.
			{ source: '/public-api/:sub+', destination: '/public-api', permanent: false },
			{ source: '/:project/public-api/:sub+', destination: '/:project/public-api', permanent: false },
			// …and a project's Build → Components (backend docs/cms CMS-03), likewise mint-tenant's: the model
			// builder here. Never the admin's own /components page or its /docs/components guide.
			{ source: '/:project((?!docs$)[^/]+)/components/:sub*', destination: '/:project/model-builder', permanent: false },
			// …and its content manager's home (CMS-07), only in mint-tenant: the project's dashboard here.
			{ source: '/:project((?!docs$)[^/]+)/content', destination: '/:project/dashboard', permanent: false },
		];
	},
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
