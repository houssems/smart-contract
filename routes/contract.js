const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/add', upload.single('file'), function (req, res) {

    const title = req.body.title;
    const description = req.body.description;
    const file = req.file;

    console.log(title, description, file);

    // todo save file into DB -> then send POST request to Blockchain
});

module.exports = router;