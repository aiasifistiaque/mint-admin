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
		return config;
	},
};

export default nextConfig;
