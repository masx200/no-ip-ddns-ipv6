import { publicIpv6, IpNotFoundError } from "public-ip";
async function getipv6address() {
    return new Promise((s, j) => {
        publicIpv6().then(s);
        setTimeout(() => {
            j(
                Object.assign(new IpNotFoundError("TIMEOUT_ERR"), {
                    cause: new DOMException("TIMEOUT_ERR", "TIMEOUT_ERR"),
                })
            );
        }, 5000);
    });
}

export { getipv6address as getipv6address };
