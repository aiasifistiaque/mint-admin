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
		optimizeCss: true,

		// Enable faster refresh
		// webVitalsAttribution: ['CLS', 'LCP'],
		// Optimize package imports for better tree shaking
		optimizePackageImports: [
			'@chakra-ui/react',
			'lucide-react',
			'react-icons',
			'@reduxjs/toolkit',
			'framer-motion',
			'axios',
		],
		reactCompiler: true,
		// Enable faster refresh
		// webVitalsAttribution: ['CLS', 'LCP'],
		// Enable parallel compilation
		// workerThreads: false,
		// Optimize CSS imports
		// optimizeCss: true,
		// turbo: {
		// 	rules: {
		// 		'*.svg': {
		// 			loaders: ['@svgr/webpack'],
		// 			as: '*.js',
		// 		},
		// 	},
		// },
	},
	// Enable compiler optimizations
	// compiler: {
	// 	removeConsole: process.env.NODE_ENV === 'production',
	// 	// Remove React dev tools in production
	// 	reactRemoveProperties: process.env.NODE_ENV === 'production',
	// },

	// Output optimization
	// output: 'standalone',

	// Image optimization
	// images: {
	// 	unoptimized: process.env.NODE_ENV === 'development',
	// },

	reactStrictMode: false,
	webpack: config => {
		// config.cache = true;
		// Enable persistent ca
		// ching for faster rebuilds
		config.cache = {
			type: 'filesystem',
			cacheDirectory: '.next/cache/webpack',
			maxAge: 5184000000, // 60 days
		};

		// Optimize module resolution
		// config.resolve.modules = ['node_modules'];
		// config.resolve.alias = {
		// 	...config.resolve.alias,
		// 	// Add aliases for frequently imported paths
		// 	'@components': './src/components',
		// 	'@lib': './src/components/library',
		// };

		// Performance optimizations
		// config.watchOptions = {
		// 	ignored: /node_modules/,
		// 	aggregateTimeout: 300,
		// };

		// Optimize chunk splitting
		// config.optimization = {
		// 	...config.optimization,
		// 	splitChunks: {
		// 		chunks: 'all',
		// 		maxSize: 244000,
		// 		cacheGroups: {
		// 			default: false,
		// 			vendors: false,
		// 			// Separate vendor chunks
		// 			vendor: {
		// 				name: 'vendor',
		// 				chunks: 'all',
		// 				test: /node_modules/,
		// 				priority: 20,
		// 			},
		// 			// Separate common chunks
		// 			common: {
		// 				name: 'common',
		// 				chunks: 'all',
		// 				minChunks: 2,
		// 				priority: 10,
		// 				reuseExistingChunk: true,
		// 				enforce: true,
		// 			},
		// 		},
		// 	},
		// };

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
