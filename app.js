const App = require('./src/Application');
const app = App();

const bodyParser = require('./middlewares/body-parser');

app.use(bodyParser);

module.exports = app;