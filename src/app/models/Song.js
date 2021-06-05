const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

//add slug generator
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const Song = new Schema({
    name: {type: String},
    description: {type: String},
    image: {type: String, maxLength:255},
    videoId: {type: String, require: true},
    author: {type: String, require: true},
    slug: { type: String, slug: "name" },
}, {
    timestamps:true
})

//add mongoose delete 
Song.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true
 })

module.exports = mongoose.model('Animals', Song);