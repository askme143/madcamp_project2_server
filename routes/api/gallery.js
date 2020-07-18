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

const uploadImage = (req, res, next) => {
    console.log("Uploading image");

    const {fb_id, name, posix_time} = req.body;
    const fileObject = req.files.image;

    if (fileObject.trucated) {
        var error = new Error("Upload image larger than 16MB");
        throw error;
    }

    const orgFileName = fileObj.originalname;
    const filesize = fileObj.size;
    const savePath = __dirname + "/../upload/ " + saveFileName;
}

const downloadImage = (req, res, next) => {
    console.log("Downloading image");
}

module.exports = {
    uploadImage,
    downloadImage
}