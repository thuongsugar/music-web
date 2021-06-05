class NewsController {

    //[get]/news
    index(req, res){
        res.render('news');
    }

    //[get] slug
    show(req, res){
        res.send('News Detail');
    }
}
module.exports = new NewsController;