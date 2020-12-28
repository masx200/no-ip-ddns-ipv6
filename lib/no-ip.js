const { getipv6address } = require("./getipv6address");
var axios = require("axios");
var net = require("net");
// var util = require("util");
var ms = require("ms");
// var debug = require("debug")("no-ip");

var EventEmitter = require("events").EventEmitter;
var pckg = require("../package.json");
var ERR_DESCRIPTION = require("./errors.js");
const { validateEmail } = require("./validateEmail");

var DEFAULT_REFRESH_INTERVAL = ms("10m"); //

class NoIP extends EventEmitter {
    constructor(opts) {
        // EventEmitter.call(this);
        super();
        opts = opts || {};
        if (!opts.hostname || !opts.pass) {
            throw Error("Missing params!");
        }
        if (!validateEmail(opts.user)) {
            throw Error("Provide a valid Email");
        }

        this.options = {
            responseType: "text",
            headers: {
                "user-agent":
                    opts.userAgent ||
                    "Node-NoIP/v" + pckg.version + " " + opts.user,
            },
            auth: {
                username: opts.user,
                password: opts.pass,
            },
            params: {
                hostname: opts.hostname,
            },
        };

        this.loop = null;
    }
    setOffline(isOffline) {
        this.options.params.offline = isOffline ? "YES" : "NO";
        return this; /* method chaining */
    }
    setIp(ip) {
        if (net.isIP(ip)) {
            // set custom IP
            this.options.params.myip = ip;
        }
        return this; /* method chaining */
    }
    async update(ip) {
        var self = this;
        this.setIp(ip);

        let myipv6 = undefined;
        try {
            myipv6 = await getipv6address();
            console.log("ipv6 public address:", myipv6);
            this.options.params.myipv6 = myipv6;
        } catch (error) {
            this.options.params.myipv6 = undefined;
            console.error(error);
        }
        return axios
            .get("https://dynupdate.no-ip.com/nic/update", this.options)
            .then(function (response) {
                console.log(
                    String(
                        "Got response: " +
                            response.status +
                            "\n" +
                            response.data
                    ).trim()
                );
                var data = response.data.trim();
                var f = data.match(/good|nochg/g);
                if (f) {
                    // Success
                    self.emit("success", f[0] === "good", data.split(" ")[1]);
                } else {
                    // Error
                    self.emit("error", {
                        status: data,
                        desc: ERR_DESCRIPTION[data] || "No description",
                    });
                }
            })
            .catch(function (err) {
                console.warn("HTTP error:", err);
                var data = err.response ? err.response.data.trim() : null;
                if (data) {
                    self.emit("error", {
                        status: data,
                        desc: ERR_DESCRIPTION[data] || "No description",
                    });
                } else {
                    self.emit("error", err);
                }
            });
    }
    start(interval) {
        interval = Math.max(
            30 * 1000,
            interval ? interval : DEFAULT_REFRESH_INTERVAL
        );
        console.log("interval", interval);
        var self = this;
        this.stop();
        console.log("Automatic update started");
        this.update();
        this.loop = setInterval(function () {
            self.update();
        }, interval);
    }
    stop() {
        console.log("Automatic update stopped");
        clearInterval(this.loop);
    }
}

// util.inherits(NoIP, EventEmitter);

module.exports = NoIP;
