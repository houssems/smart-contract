const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const userModel = require('../models/user/user');

router.post('/add', upload.single('file'), function (req, res) {

    const title = req.body.title;
    const description = req.body.description;
    const file = req.file;

    var user = req.user;
    console.log(title, description, file, user);
    userModel.update({_id: req.user._id}, {
        contract: {
            name: title,
            description: description,
            file: file.toString('base64')
        }
    }, function (err, numberAffected, rawResponse) {
        console.log(err, rawResponse);
        // todo send POST request to Blockchain
        res.json(numberAffected);
    });
    // });


    // todo save file into DB -> then send POST request to Blockchain
});

module.exports = router;