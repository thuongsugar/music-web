const { renderSync } = require("node-sass");
const Song = require("../models/Song");
const { multipleMongooseToObject } = require("../../until/mongoose");
class ApiController {
  getData(req, res, next) {
    Song.find({})
      .then((musics) => {
        return res.json(musics);
      })
      .catch((err) => {
        return res.json({ "Co  loi ": err });
      });
  }
}
module.exports = new ApiController();
