const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb+srv://music-web:thuong123@cluster0.k5uq3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {//mongodb://localhost:27017/test_dev
      
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
