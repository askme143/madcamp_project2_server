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

    const {fb_id} = req.body;
    const image = req.file;

    const original_name = image.originalname;
    const saved_name = image.filename;
    const imageDoc = {"fb_id": fb_id,
                        "original_name": original_name,
                        "saved_name" : saved_name,
                        "posix" : Number(new Date().valueOf())};

    const gallery = db.db('myDB').collection('gallery');
    gallery.insertOne(imageDoc, (error, result) => {
        if (error) throw error;

        console.log("UploadImage: Upload \"" + original_name +"\"");
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.send("success");
    })
}

function streamToString (stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

const downloadImage = function (req, res, next) {
    console.log("> Downloading image");

    const gallery = db.db('myDB').collection('gallery');
    
    const {fb_id, skip_number, require_number} = req.body;
    var result;
    if (Number(require_number) == 0) {
        result = gallery.find({"fb_id" : fb_id})
                            .sort({"posix" : -1})
                            .skip(Number(skip_number));
    }
    else {
        result = gallery.find({"fb_id" : fb_id})
                            .sort({"posix" : -1})
                            .skip(Number(skip_number)).limit(Number(require_number));
    }
    
    var returnJson = {};
    returnJson['images'] = [];

    result.toArray((error, documents) => {
        if (error) throw error;

        for (var i = 0; i < documents.length; i++) {
            const imageString = fs.readFileSync("/root/server_try/upload/gallery/" + documents[i].saved_name).toString("base64");
            const image = {
                'image' : imageString
            }

            returnJson['images'].push(image);
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send(returnJson);
    })
}

const deleteImage = (req, res, next) => {
    console.log("> Delete Image");

    const gallery = db.db('myDB').collection('gallery');

    const {fb_id, indexes}  = req.body;

    console.log(indexes);
    const result = gallery.find({"fb_id" : fb_id})
    result.toArray((error, documents) => {
        if (error) throw error;
        console.log(documents.length);

        var posixes = [];
        for (var i = 0; i < indexes.length; i++) {
            console.log(indexes[i]);
            console.log(documents[indexes[i]]);
            posixes.push(documents[indexes[i]].posix);
            fs.unlink("/root/server_try/upload/gallery/" + documents[indexes[i]].saved_name, ()=>{});
        }

        gallery.deleteMany({"posix": {"$in": posixes}}, (error, result) => {
            if (error) throw error;

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.send("success");
        })
    })
}

module.exports = {
    uploadImage,
    downloadImage,
    deleteImage
}