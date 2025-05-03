// start-cors-proxy.js
const cors_proxy = require("cors-anywhere");

const host = "localhost";
const port = 1337; // ✅ Safe port

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"],
}).listen(port, host, () => {
  console.log(`🚀 CORS Anywhere proxy running at http://${host}:${port}`);
});
