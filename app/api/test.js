import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req, res) {
    console.log(123123);
    if (req.method !== "GET") {
        return res.status(404).json({ message: "Method not supported" });
    }

    return new Promise((resolve) => {
        req.headers.cookie = "";

        const handleLoginResponse = (proxyRes, req, res) => {
            let body = "";

            proxyRes.on("data", (chunk) => {
                body += chunk;
            });
            proxyRes.on("end", () => {
                try {
                    (res)
                        .status(200)
                        .json({ data: res });
                } catch (error) {
                    (res)
                        .status(500)
                        .json({ message: "Error" });
                }
                resolve(true);
            });
        };

        proxy.once("proxyRes", handleLoginResponse);
        proxy.web(req, res, {
            target: 'https://shopee.vn',
            changeOrigin: true,
            selfHandleResponse: true,
        });
    });
}