const assert = require("assert");
const got = require("got");
var ip = require("ip");
async function getipv6address() {
    const resp = await got({
        method: "GET",
        url: "http://ip1.dynupdate6.no-ip.com/",
        timeout: 5 * 1000,
        headers: {
            Accept: ` text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
            "Accept-Encoding": `gzip, deflate`,
            "Accept-Language": `zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7`,
            "Cache-Control": `max-age=0`,
            Connection: ` keep-alive`,
            Host: ` ip1.dynupdate6.no-ip.com`,
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": ` Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66`,
        },
    });
    const { headers, body, statusCode } = resp;
    assert(statusCode === 200);
   // assert("text/html" === headers["content-type"]);
    assert(ip.isV6Format(String(body)));
    return String(body);
}
exports.getipv6address = getipv6address;
// /*
//  fetch("http://ip1.dynupdate6.no-ip.com/", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
//     "cache-control": "max-age=0",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrerPolicy": "strict-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors"
// });
//  */

// HTTP/1.1 200 OK
// Date: Mon, 28 Dec 2020 02:43:10 GMT
// Content-Type: text/html
// Content-Length: 38
// Connection: keep-alive
// server: envoy

// 240e:388:892e:7300:f18a:4950:3d1c:4b86
