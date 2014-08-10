module.exports = {
    live: {
        options: {
            hostname: 'localhost',
            port: 9900,
            base: ['./target/build'],
            open: 'http://localhost:9900/index.html',
            keepalive: true,
            middleware: function (connect, options) {
                var config = [ // Serve static files.
                    connect.static(options.base[0]),
                    // Make empty directories browsable.
                    connect.directory(options.base[0])
                ];
                var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                config.unshift(proxy);
                return config;
            }
        },
        proxies: [
            {
                context: ['/ams', '/api'],
                host: 'www.maas38.com'
            }
        ]
    },
    development: {
        options: {
            hostname: 'localhost',
            port: 9901,
            base: ['./'],
            open: 'http://localhost:9901/src/_docs/index.html',
            keepalive: false,
            livereload: true,
            middleware: function (connect, options) {
                var config = [
                    connect.static(options.base[0]),
                    connect.directory(options.base[0])
                ];
                return config;
            }
        }
    },
    test: {
        options: {
            hostname: 'localhost',
            port: 9902,
            base: ['./'],
            open: 'http://localhost:9902/test/mocha/index.html',
            keepalive: true,
            middleware: function (connect, options) {
                var config = [
                    connect.static(options.base[0]),
                    connect.directory(options.base[0])
                ];
                return config;
            }
        }
    }
};