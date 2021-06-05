const User = require("../models/User");

module.exports.valueLocal = function (req, res, next) {
  //console.log(req.cookies.ID, req.signedCookies.ID);
  if (!req.session.isAuth) {
    next();
    return;
  } else {
    res.locals.user = req.session.isAuth;
    return next();
  }
};
