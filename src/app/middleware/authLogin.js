const User = require('../models/User');

module.exports.authLogin = function(req, res, next) {
    if(req.session.isAuth){
        
        return next();

    }else {
        return res.redirect('/login');
    }
}