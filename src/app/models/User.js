const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;
const User = new Schema({
    //username: {type: String, required: true, default:"Anonymous"},
    username: {type: String, required: true},
    email: {type: String , required: true},
    password: {type: String , required: true}
}, {
    timestamps:true
})

//add mongoose delete 
User.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true
 })

module.exports = mongoose.model('Users', User);