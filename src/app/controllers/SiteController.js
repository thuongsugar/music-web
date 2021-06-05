const { renderSync, info } = require("node-sass");
const Song = require("../models/Song");
const User = require("../models/User");
const { multipleMongooseToObject } = require("../../until/mongoose");

const nodeMailer = require("nodemailer");
const md5 = require("md5");
const Session = require("express-session");
var codeAuth = 0;

class SiteController {
  //[get]/home
  index(req, res, next) {
    // res.render('home');
    // req.session.clon = true;
    const limitPage = 6;
    const reqPag = parseInt(req.query.page) || 1;
    const startPage = (reqPag - 1) * limitPage;
    const endPage = reqPag * limitPage;

    Song.find({})
      .then((song) => {
        //res.locals.user = {username: "aaa"};
        const listLength = song.length;
        let numberPages = listLength / limitPage;
        if (listLength % limitPage !== 0) {
          numberPages += 1;
        }
        res.render("home", {
          song: multipleMongooseToObject(song).slice(startPage, endPage),
          numberPages: Math.floor(numberPages),
          numberPagesCurrent: reqPag,
        });
      })
      .catch(next);
  }

  //[get] /login
  login(req, res) {
    res.render("login/login");
  }

  //[post] /login
  loginPost(req, res, next) {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user || user.password != md5(req.body.password)) {
          if (!user) {
            res.render("login/login", { errE: "Mail khong dung" });
            return;
          } else {
            res.render("login/login", {
              errPS: "Mat khau khong dung",
              email: req.body.username,
            });
            return;
          }
        } else {
          req.session.isAuth = user;
          res.redirect("/");
        }
      })
      .catch(next);
  }

  //[get]/logout
  logout(req, res, next) {
    req.session.destroy();
    res.redirect("/");
  }

  //[get]/register
  getRegister(req, res, next) {
    res.render("register/register");
  }

  //[post]/register

  postRegister(req, res, next) {
    //check email pass user
    console.log(req.body.auth + 123)
    if (!req.body.auth && req.body.auth != "") {
      
      if (req.body.username === "") {
        res.render("register/register", {
          errName: "Truong nay khong duoc trong",
          signed: {
            email: req.body.email,
            password: req.body.password,
          },
        });
        return;
      }
      if (req.body.email === "") {
        res.render("register/register", {
          errEmail: "Truong nay khong duoc trong",
          signed: {
            user: req.body.username,
            password: req.body.password,
          },
        });
        return;
      }
      if (req.body.password.length < 6) {
        res.render("register/register", {
          errPassword: "Mat khau phai nhieu hon 6 ki tu",
          signed: {
            user: req.body.username,
            email: req.body.email,
          },
        });
        return;
      }
    }

    //check code
    if (req.body.auth || req.body.auth === "") {
      if (req.body.auth === req.session.registered) {
        req.session.userRegistered.password = md5(req.session.userRegistered.password)
        new User(req.session.userRegistered).save()
        res.redirect("/login");
        return;
      } else {
        return res.send(`<h2>Ma xac thuc da duoc gui toi  <u>${req.session.userRegistered.email}</u> </h2>
        <form method="POST" class="w-50">
          <div class="form-group">
            <label for="exampleInputEmail1">Ma code</label>
            <p style="color: red">Ma khong dung</p>
            <input type="text" class="form-control" name="auth" placeholder="nhap o day">
            <button type="submit" class="btn btn-primary">Xac nhan</button>
  
          </div>
  
        </form>`);
      }
    }
    //creat code
    codeAuth = Math.floor(Math.random() * 10000) + 1; //random integer from 1 to 10000;
    console.log(codeAuth);
    const emailPage = "phamxuanthuong95@gmail.com";
    const mailUser = req.body.email;
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: emailPage,
        pass: "23012001",
      },
    });

    const mailOptions = {
      from: emailPage,
      to: mailUser,
      subject: "Gmail Authentication",
      text: codeAuth.toString(),
    };
    transporter
      .sendMail(mailOptions)
      .then((info) => {
        console.log("Email sent: " + info.response);
      })
      .catch((err) => {
        console.log(err);
      });
    req.session.registered = codeAuth.toString();
    req.session.userRegistered = req.body;
    res.send(
      `<h2>Ma xac thuc da duoc gui toi  <u>${req.body.email}</u> </h2>
      <form method="POST" class="w-50">
        <div class="form-group">
          <label for="exampleInputEmail1">Ma code</label>
          <input type="text" class="form-control" name="auth" placeholder="nhap o day">
          <button type="submit" class="btn btn-primary">Xac nhan</button>

        </div>

      </form>`
    );
  }
}
module.exports = new SiteController();
