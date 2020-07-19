const { fakeServer } = require('sinon');

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

const fs = require("fs");

const uploadImage = (req, res, next) => {
    console.log("> Uploading image");

    const {image, fb_id} = req.files;

    const facebookID = fb_id[0].originalname;
    const original_name = image[0].originalname;
    const saved_name = image[0].filename;
    const image_doc = {"fb_id": facebookID,
                        "original_name": original_name,
                        "saved_name" : saved_name,
                        "posix" : new Date().valueOf() + ""};

    fs.unlink(fb_id[0].path, ()=>{});

    const gallery = db.db('myDB').collection('gallery');
    gallery.insertOne(image_doc, (error, result) => {
        if (error) throw error;

        console.log("UploadImage: Upload \"" + original_name +"\"");
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.send("success");
    })
}

const downloadImage = (req, res, next) => {
    console.log("> Downloading image");

    
}

module.exports = {
    uploadImage,
    downloadImage
}