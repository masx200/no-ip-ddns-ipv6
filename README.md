# no-ip-ddns-ipv6

Noip.com Dynamic DNS update client built in Node.js ,support ipv6

自动查询公共 ipv6 地址,提交域名解析

自动更新的最短间隔时间为 30 秒

Public IPV6 addresses are automatically Enquiried, and

the minimum time between submission of domain name resolution and automatic updates is 30 seconds

thanks to @roccomuso

https://github.com/roccomuso/no-ip

# no-ip [![Build Status](https://travis-ci.org/roccomuso/no-ip.svg?branch=master)](https://travis-ci.org/roccomuso/no-ip) [![NPM Version](https://img.shields.io/npm/v/no-ip.svg)](https://www.npmjs.com/package/no-ip) [![Dependency Status](https://david-dm.org/roccomuso/no-ip.png)](https://david-dm.org/roccomuso/no-ip) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) <span class="badge-patreon"><a href="https://patreon.com/roccomuso" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>

> [Noip.com](https://noip.com) Dynamic DNS update client built in Node.js. **It makes easy to remote access your connected devices**!

## Install

The easiest way to get **no-ip** is with npm:

```shell
npm install @masx200/no-ip-ddns-ipv6 --save
```

or having it globally installed and used as a standalone tool:

```shell
npm install -g @masx200/no-ip-ddns-ipv6
```

## Example usage

```javascript
var NoIP = require("@masx200/no-ip-ddns-ipv6");

var noip = new NoIP({
    hostname: "hello-world.ddns.net",
    user: "hello@world.com",
    pass: "s3cr3tz",
});

noip.on("error", function (err) {
    console.log(err);
});

noip.on("success", function (isChanged, ip) {
    console.log(isChanged, ip);
});

noip.update(); // Manual update, you can also provide a custom IP address

// noip.start() // start an automatic renewal every 1h by default or provide a custom ms.
// noip.stop() // stop the previously started automatic update
```

## Events

`.on('success', callback)`: The callback accepts two params `isChanged` and `ip` that gives you the current IP address your domain is currently pointing to and a boolean value indicating if an update was performed.

`.on('error', callback)`: Called when an [error](https://www.noip.com/integrate/response) occurs.

## Methods

`.update([ip])`: Send an update request. Optionally you can provide a custom IP.

`.start([ms])`: Start an automatic renewal every 1h by default or provide a custom [ms](https://github.com/zeit/ms).

`.stop()`: Stop the automatic update.

`.setOffline([boolean])`: Sets the current host to offline status. Offline settings are an Enhanced / No-IP Plus feature. You should call the `update` method after this flag have been set.

`.setIp([ip])`: Set a custom IP Address for the update requests.

## Standalone usage

If used standalone, I recommend you to start it with some process manager, like [PM2](https://github.com/Unitech/pm2).

```shell
 npx @masx200/no-ip-ddns-ipv6 -h hello-world.ddns.net -u hello -p s3cr3t -s
```

That start automatic DNS renewal once an hour.
To see supported parameters and usage examples just type:

```shell
 npx @masx200/no-ip-ddns-ipv6 --help
```

```txt
Usage: no-ip-ddns-ipv6 -h [hostname] -u [user] -p [password] -t [interval(ms)] -i
[customIP] -s

Options:
  --help, -H      Show help                                            [boolean]
  --hostname, -h  Your hostname                              [string] [required]
  --username, -u  Username for the noip.com DDNS account     [string] [required]
  --password, -p  You account password                       [string] [required]
  --ip, -i        Set a custom IP Address                               [string]
  --offline, -o   Sets the current host to offline status.             [boolean]
  --interval, -t  Renewal interval, in milliseconds. [number] [default: 3600000]
  --start, -s     Start automatic renewal once an hour by default      [boolean]

Examples:
  no-ip-ddns-ipv6 -h hello-world.ddns.net -u hello    -p s3cr3t -s

  Start automatic DNS renewal once an hour

  no-ip-ddns-ipv6 -h hello-world.ddns.net -u hello    -p s3cr3t

              Send a single update request using your current IP address

  no-ip-ddns-ipv6 -h hello-world.ddns.net -u hello    -p s3cr3t -i 173.26.2.66

   Send a single update request using a custom IP Address

  no-ip-ddns-ipv6 -h hello-world.ddns.net -u hello   -p s3cr3t -t 604800000 -s

   Start automatic DNS renewal once a week
```

<!-- # Debug

This module makes use of the node [DEBUG](https://github.com/visionmedia/debug) module.
You can enable it setting the `DEBUG` env var to `no-ip` before the app starts:

    $ DEBUG=no-ip -->

## Author

Rocco Musolino ([@roccomuso](https://twitter.com/roccomuso))

## License

MIT

# NOIP.COM API

https://www.noip.com/integrate/ip-detection

https://www.noip.com/integrate/request
