/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
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
