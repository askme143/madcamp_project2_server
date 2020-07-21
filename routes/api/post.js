const { post } = require('../../app');

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
const ObjectId = require('mongodb').ObjectID;

const uploadPost = (req, res, next) => {
    console.log("> Upload post");

    const {location, detail, price, name, like_count, writer, fb_id} = req.body;
    const images = req.files;
    console.log(images);

    console.log(location, detail, price, name, like_count, writer, fb_id);

    const saved_names = [];
    for (var i = 0; i < images.length; i++) {
        saved_names.push(images[i].filename);
    }

    postDoc = {"fb_id":fb_id,
            "name":name,
            "price":price,
            "location":location,
            "detail":detail,
            "writer":writer,
            "like_count":like_count,
            "saved_names":saved_names,
            "posix":Number(new Date().valueOf())
        };
    
    const postCollection = db.db('myDB').collection('post');

    postCollection.insertOne(postDoc, (error, result) => {
        if (error) throw error;

        res.statusCode=200;
        res.setHeader('Content-Type','text/plain');
        res.send("success");
    })
}

const getPost = ( req, res, next ) => { 
    console.log("> Get posts");

    const {fb_id} = req.body;

    var postCollection = db.db('myDB').collection('post');
    var result = postCollection.find({}).sort({"posix" : -1});

    result.toArray((error,documents) => {
        if (error) {
            throws (error);
        } else{
            var returnJson = {}; 
            returnJson['posts'] = [];
            
            for (var i = 0; i < documents.length; i++){
                const post = {
                    'images' : [],
                    'name' : documents[i].name,
                    'price' : documents[i].price,
                    'location' : documents[i].location,
                    'detail' : documents[i].detail,
                    'writer' : documents[i].writer,
                    'like_count' : documents[i].like_count,
                    '_id' : documents[i]._id
                }
                console.log(documents[i]);
                for (var j = 0; j < documents[i].saved_names.length; j++){
                    const imageString = fs.readFileSync("/root/server_try/upload/post/" + documents[i].saved_names[j]).toString("base64");
                    post.images.push(imageString);
                }
                returnJson['posts'].push(post);
            }
            console.log(documents);
            console.log("Get all Posts");
            res.statusCode=200;
            res.setHeader("Content-Type","application/json");
            res.send(returnJson);
        }
    })
}

const getBigPost = ( req, res, next ) => {
    console.log("> Get Big Post");

    const {fb_id, post_id} = req.body;

    var postCollection = db.db('myDB').collection('post');
    postCollection.findOne({"_id" : ObjectId(post_id)}, (error, document) => {
        if (error){ 
            throws (error);
        } else{
            const post = {
                'images' : [],
                'name' : document.name,
                'price' : document.price,
                'location' : document.location,
                'detail' : document.detail,
                'writer' : document.writer,
                'like_count' : document.like_count,
                '_id' : document._id
            }
            for (var i = 0; i < document.saved_names.length; i++) {
                const imageString = fs.readFileSync("/root/server_try/upload/post/" + document.saved_names[i]).toString("base64");
                post.images.push(imageString);
            }

            res.statusCode=200;
            res.setHeader("Content-Type","application/json");
            res.send(post);
        }
    });
}

module.exports = {
    uploadPost,
    getPost,
    getBigPost
}