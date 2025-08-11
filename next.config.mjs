    /** @type {import('next').NextConfig} */
    const nextConfig = {
        reactStrictMode: true,
        swcMinify: true,
        webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
        },
        async headers() {
        return [
            {
            source: "/api/socket",
            headers: [
                { key: "Access-Control-Allow-Origin", value: "*" },
                { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
                { key: "Access-Control-Allow-Headers", value: "Content-Type" },
            ],
            },
        ];
        },
    };
    
    
    export default nextConfig;
