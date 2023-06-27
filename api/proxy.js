const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = (req, res) => {
    let target = ''
    if (req.url.startsWith('/wujin')) {
        target = 'https://api.wujinapi.me/api.php/provide/vod/'
    }
    if (req.url.startsWith('/gaoqing')) {
        target = 'https://api.1080zyku.com/inc/apijson.php/'
    }
    // 创建代理对象并转发请求
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            // 通过路径重写，去除请求路径中的 `/api`
            '^/wujin/': '/',
            '^/gaoqing': '/'
        },
    })(req, res)
}
