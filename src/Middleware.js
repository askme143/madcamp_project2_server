const Middleware = () => {
    const _middlewares = [];
    let _req, _res

    const add = fn => {
        _middlewares.push(fn);
    }

    const run = (req, res) => {
        _req = req;
        _res = res;

        _run(0);
    }

    const _run = (n, err) => {
        if (n < 0 || n >= _middlewares.length) return;

        const nextMw = _middlewares[n];
        const next = err => _run(n + 1, err);

        if (err) {
            const isNextErrorMw = nextMw.length === 4

            return isNextErrorMw ? nextMw(err, _req, _res, next) : _run(n + 1, err);
        }

        nextMw(_req, _res, next);
    }

    return {
        _middlewares,
        run,
        add
    }
}

module.exports = Middleware;