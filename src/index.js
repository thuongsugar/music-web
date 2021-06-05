const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const port = 3100;

const cookieParser = require('cookie-parser');
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

const morgan = require('morgan');
const app = express();
const SortMiddleWare = require('./app/middleware/SortMiddleWare');

const route = require('./routes');
const db = require('./config/db');



//connect db
db.connect();

const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/test_dev",
  collection: "mySession",
})
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'Key that sign cookie',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
      maxAge: 3600000 
  }
}))

app.use(cookieParser("a"));
app.use(express.urlencoded());
app.use(express.json());

// override with POST having ?_method=
app.use(methodOverride('_method'));

//using middleware sort
app.use(SortMiddleWare);

//http logger
app.use(morgan('combined'))

//template engine
app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
      sum: (a,b) => a + b,
      sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default'
        const icons = {
          default: 'fas fa-sort',
          desc: 'fas fa-sort-alpha-down-alt',
          asc: 'fas fa-sort-alpha-down'
        };
        const types = {
          default: 'desc',
          asc: 'desc',
          desc: 'asc'
        }
        const icon = icons[sortType];
        const type = types[sortType];
        return `<a href="?_sort&column=${field}&type=${type}">
        <i class="${icon}"></i>
        </a>
        `
      },
      printPageNumber: function(numberPage,numberPagesCurrent,options) {
        let elementPage = '';
        if(numberPagesCurrent !== 1 ){
          elementPage +=` <li class="page-item"><a class="page-link" href="?page=${numberPagesCurrent-1}">Previous</a></li>`
        }
        let startPage = 0;
        let endPage = 0;
        if(numberPagesCurrent % 2 == 0){
          startPage = numberPagesCurrent - 3;
          endPage = numberPagesCurrent * 2 - 2 - startPage;
        }else{
          startPage = numberPagesCurrent - 2;
          endPage = numberPagesCurrent * 2 - startPage;
        }
        console.log(startPage, endPage)
        
        if(endPage > numberPage){
          startPage = numberPage - 4;
          endPage = numberPage;
        }
        console.log(startPage, endPage, numberPage)

        if(startPage < 1){
          startPage = 1;
          endPage = numberPage ;
          if(endPage > 5){
            endPage = 5;
          }else{
            endPage = numberPage
          }
        }
        for(let i= startPage; i<= endPage; i++){
          if(numberPagesCurrent === i){
            elementPage += `<li class="page-item active"><a class="page-link" href="?page=${i}">${i}</a></li>`
          }
          else{
            elementPage += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`
          }


        
        }
        if(numberPagesCurrent < numberPage){
          elementPage += `<li class="page-item"><a class="page-link" href="?page=${numberPagesCurrent +1}">Next</a></li>`
        }
        
       
        return elementPage
      }
  }

}));
app.set('view engine', 'hbs');
app.set('views',path.join(__dirname, 'resources','views'));

//route init
route(app);

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`)
})