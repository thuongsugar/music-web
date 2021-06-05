const { renderSync } = require("node-sass");
const Song = require("../models/Song");
const { mongooseToObject } = require("../../until/mongoose");
const { multipleMongooseToObject } = require("../../until/mongoose");

var textSearch = '';
class MusicController {
  search(req, res, next) {
    const limitPage = 6;
    const reqPag = parseInt(req.query.page) || 1;
    const startPage = (reqPag - 1) * limitPage;
    const endPage = reqPag * limitPage;
    textSearch = req.query.q || textSearch;

    console.log(textSearch);

    Song.find({ name: { $regex: textSearch, $options: "i" } })
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

  //[get] /music/:slug
  show(req, res, next) {
    Song.findOne({ slug: req.params.slug })
      .then((song) => {
        res.render("music/show", { song: mongooseToObject(song) });
      })
      .catch(next);
  }

  //[get] //music/create
  create(req, res, next) {
    res.render("music/create",{
      activeNav: {
        create: 'active-nav-item'
    }});
  }
  //[post] //music/store
  store(req, res, next) {
    // res.json(req.body)
    const formData = req.body;
    formData.image = `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg`;
    formData.author = res.locals.user._id;
    const song = new Song(formData);
    console.log(song);
    song.save();
    res.redirect("/");
  }

  //[get] //music/:id/edit
  edit(req, res, next) {
    Song.findById(req.params.id)
      .then((song) => res.render("music/edit", mongooseToObject(song)))
      .catch(next);
  }

  //[put] //music/:id/
  update(req, res, next) {
    let slugUD = function () {
      var slugName = req.body.name.split(" ");
      slugName = slugName.join("-");
      return slugName;
    };
    Song.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        description: req.body.description,
        videoId: req.body.videoId,
        image: `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg`,
        slug: slugUD(),
      }
    )
      .then(() => res.redirect("/me/stored/music"))
      .catch(next);
  }
  //[delete] //music/:id
  delete(req, res, next) {
    Song.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  //[delete] //music/:id/hard
  deleteHard(req, res, next) {
    Song.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  //[patch] //music/:id/restore
  restore(req, res, next) {
    Song.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
  //[post] //music/handle
  handleFormAction(req, res, next) {
    switch (req.body.action) {
      case "delete":
        Song.delete({ _id: { $in: req.body.musicIds } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "ERROR" });
    }
  }
}
module.exports = new MusicController();
