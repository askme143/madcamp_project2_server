var mongoClient = require('mongodb').MongoClient;

const databaseURL = 'mongodb://localhost:27017';
var database;

mongoClient.connect(databaseURL,
    (err, db) => {
        if (err) {
            console.log('db connect error');
            return;
        }

        console.log('db was connected : ' + databaseURL);
        database = db;
    }
);

module.exports = database;