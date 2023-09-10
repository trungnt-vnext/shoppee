/** @type {import('next').NextConfig} */

const { createProxyMiddleware } = require('http-proxy-middleware');


const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://shopee.vn/:path*',
            },
        ];
    },
}



module.exports = nextConfig
