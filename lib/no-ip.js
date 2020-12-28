var axios = require("axios");
var net = require("net");
var util = require("util");
var ms = require("ms");
// var debug = require("debug")("no-ip");

var EventEmitter = require("events").EventEmitter;
var pckg = require("../package.json");
var ERR_DESCRIPTION = require("./errors.js");

var DEFAULT_REFRESH_INTERVAL = ms("5m"); // 

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

class NoIP extends EventEmitter {
    constructor(opts) {
        // EventEmitter.call(this);
        super()
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
                "user-agent": opts.userAgent ||
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
    update(ip) {
        var self = this;
        this.setIp(ip);
        axios
            .get("https://dynupdate.no-ip.com/nic/update", this.options)
            .then(function (response) {
                console.log("Got response:", response.status, response.data);
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
        var self = this;
        this.stop();
        console.log("Automatic update started");
        this.update();
        this.loop = setInterval(
            function () {
                self.update();
            },
            interval ? ms(interval) : DEFAULT_REFRESH_INTERVAL
        );
    }
    stop() {
        console.log("Automatic update stopped");
        clearInterval(this.loop);
    }
}

util.inherits(NoIP, EventEmitter);






module.exports = NoIP;