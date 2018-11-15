const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const roles = require('../models/user/roles');
const blockchain = require('../services/blockchain.service');
const uuidv4 = require('uuid/v4');

// Register
router.get('/register', function (req, res) {
    res.render('register');
});


// Login
router.get('/login', function (req, res) {
    res.render('login');
});

// Register
router.post('/register', async function (req, res) {
    var role = req.body.role;
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var title = req.body.title;
    var mobile = req.body.mobile;


    req.checkBody('firstname', 'Firstname is required').notEmpty();
    req.checkBody('lastname', 'Lastname is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('mobile', 'Mobile is required').notEmpty();
    req.checkBody('mobile', 'Mobile has to be only numbers and (+) sign').matches(/^[0-9-+]+$/);


    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {

        const user = await blockchain.findUserBy(email);
        console.log(user);

        if (user) {
            res.render('register', {
                user: user,
                mail: email
            });
        } else {

            const userObject = {
                email, firstname, lastname, title, mobile,
                ID: uuidv4()
            };

            const userRegistered = await blockchain.registerUser(userObject, role);
            if (userRegistered.ID) {
                console.log(userRegistered);
                req.flash('success_msg', 'You are registered and can now login');
                res.redirect('/users/login');
            } else {
                res.render('register', {errors: err});
            }
        }

    }
});

passport.use(new LocalStrategy(
    async function (username, password, done) {

        const user = await blockchain.findUserBy(username);
        if (!user)
            return done(null, false, {message: 'Unknown User'});

        // todo change with password from blockchain
        if (password !== '123')
            return done(null, false, {message: 'Invalid password'});

        return done(null, user);
    }));

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(async function (email, done) {

    const user = await blockchain.findUserBy(email);
    if (user.ID)
        done(null, user);
    else
        done(user, false);
});
router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    function (req, res) {
        res.redirect('/');
    });


router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

router.get('/all', async function (req, res) {

    const role = req.query.role || roles.signer;
    if (roles.canSearch.indexOf(role) === -1) {
        res.json([]);
    } else {
        let users;
        switch (role) {
            case roles.signer:
                users = await blockchain.getSignatoryList();
                break;
            case roles.contractor:
                users = await blockchain.getIssuerList();
                break;

            default:
                users = await blockchain.getSignatoryList();
        }

        if (typeof users === 'object') {
            res.json(users);
        } else {
            res.json([]);
        }
    }
});
module.exports = router;