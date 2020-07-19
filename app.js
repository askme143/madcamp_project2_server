const express = require('express');
const app = express();

/* External modules */
const logger = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');

/* Multer functions */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/gallery');
    },
    filename: (req, file, cb) => {
        if (file.fieldname == 'image') {
            cb(null, new Date().valueOf() + 'image');
        } else if (file.fieldname == 'fb_id') {
            cb(null, new Date().valueOf() + 'fb_id');
        } else if (file.fieldname == 'filename') {
            cb(null, new Date().valueOf() + 'filename');
        } else {
            cb(null, 'unknown');
        }
    }
})
const multerGallery = multer({ storage: storage });

/* My modules */
const apiUser = require('./routes/api/user');
const apiContact = require('./routes/api/contact');
const apiGallery = require('./routes/api/gallery');

/* Put functions in the middleware */
/* logger */
app.use(logger('dev'));

/* Body parser */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* My modules */
app.post('/signup', apiUser.signUpUser);
app.post('/login', apiUser.checkUser);

app.post('/contact_put', apiContact.putContacts);
app.post('/contact_get', apiContact.getContacts);
app.post('/contact_update', apiContact.putContacts);
app.post('/contact_update', apiContact.getContacts);

app.use('/gallery/upload', multerGallery.fields([{name: 'image'}, {name: 'fb_id'}, {name: 'filename'}]), function(req, res, next){
    console.log(req.files)
    next();
});
app.post('/gallery/upload', apiGallery.uploadImage);
app.post('/gallery/download', apiGallery.downloadImage);

module.exports = app;