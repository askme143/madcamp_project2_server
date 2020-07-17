const App = require('./src/Application');
const app = App();

const bodyParser = require('./middlewares/body-parser');
  
const posts = [
    {title: 'post 3', body: 'this is post 3'},
    {title: 'post 2', body: 'this is post 2'},
    {title: 'post 1', body: 'this is post 1'}
];

const index = (req, res, next) => {
    console.log("hello?");
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(posts));
};

app.use(bodyParser);
app.use('/login', index);

module.exports = app;