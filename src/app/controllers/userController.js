const User = require('../models/User');
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");

class userController {
    //[GET]
    login(req, res, next){
        res.render("user/login");
    }

    //[POST]
    postLogin(req, res, next) {
        const { email, password } = req.body;
        User.findOne({ email: email, password: password })
            .then((user) => {
                if (user) {
                    req.session.user = user; // Lưu thông tin người dùng vào phiên
                    res.redirect('/');
                } else {
                    res.render('user/login', { errorMessage: 'Email or password is incorrect' });
                }
            })
            .catch(next);
    }

    //[GET]
    logout(req, res, next){
        // Xóa phiên đăng nhập
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.redirect('/'); 
            }
        });
    }

    //[GET]
    register(req, res, next){
        res.render("user/register");
    }

    //[POST]
    postRegister(req, res, next){
        // res.json(req.body);
        
        const user = new User(req.body);
        user
            .save()
            .then(() => res.redirect("/user/login"))
            .catch((error) => {});
    }
}

module.exports = new userController();