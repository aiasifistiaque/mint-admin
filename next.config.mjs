/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		turbo: {
			rules: {
				'*.svg': {
					loaders: ['@svgr/webpack'],
					as: '*.js',
				},
			},
		},
	},

	reactStrictMode: false,
	webpack: config => {
		config.cache = true;

		// Handle Quill modules
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		// Ignore specific modules that cause issues
		// config.resolve.fallback = {
		// 	...config.resolve.fallback,
		// 	fs: false,
		// };

		return config;
	},
};

export default nextConfig;
