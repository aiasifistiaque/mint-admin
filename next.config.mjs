/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
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
