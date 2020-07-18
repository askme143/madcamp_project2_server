const express = require('express');
const app = express();

/* External modules */
const logger = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');

/* Multer functions */
const multerGallery = multer({
    dest: './upload/gallery',
    limits: {fileSize: 16 * 1024 * 1000}
});

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

app.post('/gallery/upload', multerGallery);
app.post('/gallery/upload', apiGallery.uploadImage);
app.post('/gallery/download', apiGallery.downloadImage);

module.exports = app;