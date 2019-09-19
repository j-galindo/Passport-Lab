const express = require('express');
const router = express.Router();
const user = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

/* GET home page */
router.get('/signup', (req, res, next) => {
    res.render('user/signup');
});

router.post('/signup', (req, res, next) => {
    const username = req.body.theUsername;
    const password = req.body.thePassword;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);


    user.create({
            username: username,
            password: hash
        })
        .then(() => {
            res.redirect('/')
        })
        .catch((error) => {
            next(err)
        })
});


//LOGIN
router.get('/login', (req, res, next) => {
    res.render('user/login');


});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.post('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/');
})

router.get('/secret', (req, res, next) => {

    if (req.user) {

        res.render('user/secret', { theUser: req.user })
    } else {
        res.redirect('/')
    }

})

router.post('/user/delete', (req, res, next) => {

    user.findByIdAndRemove(req.user._id)
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })

})




module.exports = router;