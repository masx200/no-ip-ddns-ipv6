#!/usr/bin/env node

import argv from "../lib/argv.js";
import NoIP from "../lib/no-ip.js";
console.log(argv);
var noip = new NoIP({
    hostname: argv.hostname,
    user: argv.username,
    pass: argv.password,
});

noip.on("error", function (err) {
    console.warn(err);
});

noip.on("success", function (isChanged, ip) {
    console.log("success", isChanged, ip);
});

noip.setOffline(argv.offline);

if (argv.ip) {
    noip.setIp(argv.ip);
}

if (argv.start) {
    noip.start(argv.interval);
    console.log("No-ip client started...");
} else {
    noip.update();
}
