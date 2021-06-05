const User = require('../models/User');

module.exports.redirectHome = function(req, res, next) {
    if(req.session.isAuth){
        
        return res.redirect('/')

    }else {
        return next();
    }
}