const express = require('express')
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage
}).single('image');

// get all users
router.get('/', (req, res) => {
    // res.render('index', { title: "Home Page" })
    User.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('index', {
                title: "Home Page",
                users: users,
            })

            // console.log(`${users}`)
        }
    })
});

// get page add 
router.get('/add', (req, res) => {
    // res.send("all users");
    res.render('add_user', { title: "Add users" });
});

// add user
router.post('/add', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "user added successfully!"
            };
            res.redirect('/');
        }
    })
});

// get user update
router.get('/edit/:id', (req, res) => {
    // res.send("all users");
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            res.redirect('/');
        } else {
            if (user == null) {
                res.redirect('/');
            } else {
                res.render('edit_user', {
                    title: "Edit user",
                    user: user,
                })
                console.log(`${user}`)
            }
        }
    })

});

// update user by id
router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = ""

    if (req.file) {
        new_image = req.file.filename
        try {
            fs.unlinkSync("../public/images" + req.body.old_image)
        } catch (error) {
            console.log(error)
        }
    } else {
        new_image = req.body.old_image
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "user update successfully!",
            };
            res.redirect('/');
        }
    })

});

// delete user by id
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result) => {
        if (result.image != '') {
            try {
                fs.unlinkSync(path.join(__dirname, '../public/images/' + result.image));
            } catch (error) {
                console.log(error)
            }
        }

        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: "success",
                message: "user deleted successfully!",
            };
            res.redirect('/');
        }
    })

});

module.exports = router;