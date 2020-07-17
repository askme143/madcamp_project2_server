const path = require('path');
const http = require('http');
const Middleware = require('./Middleware');

const Application = () => {
    const _middleware = Middleware();

    const listen = (port = 80, hostname = '0.0.0.0', fn) => {
        _server.listen(port, hostname, fn);
    }

    const _server = http.createServer((req, res) => {
        _middleware.run(req, res);
    })

    const use = (path, fn) => {
        if (typeof path === 'string' && typeof fn === 'function') {
            fn._path = path;
        } else if (typeof path == 'function') {
            fn = path;
        } else {
            throw Error('Usage: use(path, fn) or use(fn)');
        }

        _middleware.add(fn);
    }

    return {
        _middleware,
        _server,
        use,
        listen
    }
};

module.exports = Application;