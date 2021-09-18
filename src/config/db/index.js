require('dotenv').config()
const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.URI_MONGODB, {//mongodb://localhost:27017/test_dev
      
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connect success");
  } catch (error) {
      console.log("connect error")
  }
}
module.exports = { connect };
