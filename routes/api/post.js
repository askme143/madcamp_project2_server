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
            "posix":Number(new Date().valueOf())};
    
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
    var result=postCollection.sort({"posix" : -1});

    result.toArray((error,documents) => {
        if (error) { throws (error);
        } else{
            console.log("Get all Posts");
            res.statusCode=200;
            res.setHeader("Content-Type","");
            res.send({"all posts" : documents, "post_id" : db.post.ObjectId.valueOf() });
        }
    })
}

const getBigPost = ( req, res, next ) => {
    console.log("> Get Big Post");

    const {fb_id, post_id} = req.body;

    var postCollection = db.db('myDB').collection('post');
    var result = postCollection.findOne({"fb_id" : fb_id, "_id" : post_id});

    result.toArray((error,documents)=> {
        if (error){ throws (error);
        } else{
            console.log("Get Big Post");
            res.statusCode=200;
            res.setHeader("Content-Type","");
            res.send({"big post" : documents});
        } 
    })
}

const getMyPost = (req, res, next) => {
    console.log("> Get my posts");

    const {fb_id} = req.body;
    var postCollection = db.db('myDB').collection('post');

    var result = postCollection.find({"fb_id" : fb_id}).sort({"posix" : -1})
    
    result.toArray((error,documents)=> {
        if (error){ throws (error);
        } else{
            console.log("Get My Posts");
            res.statusCode=200;
            res.setHeader("Content-Type","");
            res.send({"my posts" : documents});
        } 
    })
}

module.exports = {
    uploadPost,
    getPost,
    getBigPost,
    getMyPost
}