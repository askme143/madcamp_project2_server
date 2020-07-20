var mongoClient = require('mongodb').MongoClient;

const databaseURL = 'mongodb://localhost:27017';
var db;

mongoClient.connect(databaseURL,
    (error, database) => {
        if (error) {
            console.log('db connect error');
            return;
        }

        console.log('db was connected : ' + databaseURL);
        db = database;
    }
);

const getContacts = (req, res, next) => {
    console.log("> Get contacts");

    const {fb_id} = req.body;

    var contactCollection = db.db('myDB').collection('contact');
    var result = contactCollection.find({"fb_id": fb_id}).sort({"name" : 1});

    result.toArray((error, documents) => {
        if (error) {
            throws (error);
        } else {
            console.log("Send contacts");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.send({"contacts" : documents});
        }
    })
}

const putContacts = (req, res, next) => {
    console.log("> Put contacts");

    const {fb_id, contacts} = req.body;
    var contactCollection = db.db('myDB').collection('contact');

    for (var i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        console.log(contact);

        contactCollection.insertOne(contact, (err, result) => {});
    }

    var result = contactCollection.find({"fb_id_owner": fb_id});

    result.toArray((error, documents) => {
        if (error) {
            throws (error);
        } else {
            console.log("Send contacts");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.send({"contacts" : documents});
        }
    })
}

module.exports = {
    getContacts,
    putContacts
};