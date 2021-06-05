const { renderSync } = require("node-sass");
const Song = require("../models/Song");
const { multipleMongooseToObject } = require("../../until/mongoose");
class MeController {
  //[get] //me/stored/music
  storedMusic(req, res, next) {
    //res.json(res.locals._sort)
    const author = res.locals.user._id;
    let musicQuery = Song.find({ author });
    if (req.query.hasOwnProperty("_sort")) {
      musicQuery.sort({
        [req.query.column]: req.query.type,
      });
    }
    Promise.all([musicQuery, Song.countDocumentsDeleted({ author })])
      .then(([song, deletedCount]) =>
        res.render("me/stored-music", {
          deletedCount,
          song: multipleMongooseToObject(song),
          activeNav: {
            stored: 'active-nav-item'
        }
        })
      )
      .catch(next);
  }

  //[get] //me/trash/music
  trashMusic(req, res, next) {
    // res.json(req.body)
    const author = res.locals.user._id;
    Song.findDeleted({author})
      .then((song) =>
        res.render("me/trash-music", {
          song: multipleMongooseToObject(song),
        })
      )
      .catch(next);
  }
}
module.exports = new MeController();
