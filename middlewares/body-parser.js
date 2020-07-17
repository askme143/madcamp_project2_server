const bodyParser = (req, res, next) => {
    let body = [];

    req.on('data', chunk => {
        body.push(chunk);
        console.log('data', chunk);
    })

    req.on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('end', body)

        body = body.split('&').reduce((body, pair) => {
            if (!pair) return body;

            const keyValue = pair.split('=');
            body[keyValue[0]] = keyValue[1];
            
            return body;
        }, {});

        req.body = body;
        next();
    })
}

module.exports = bodyParser;