import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'image-cdn-*.spotifycdn.com',
			},
			{
				protocol: 'https',
				hostname: '*.scdn.co',
			},
		],
	},
};

export default nextConfig;
