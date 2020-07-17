const App = require('./src/Application');
const app = App();

const bodyParser = require('./middlewares/body-parser');

const apiUser = require('./routes/api/user');

app.use(bodyParser);
app.post('/login', apiUser.index);

module.exports = app;