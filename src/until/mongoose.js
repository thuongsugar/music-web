module.exports = {
    //tra ve danh sach cac doi tuong 
    multipleMongooseToObject: function(mongoose){
        return mongoose.map(mongoose => mongoose.toObject());

    },


    //tra ve mot doi tuong 
    mongooseToObject: function(mongoose){
        return mongoose ? mongoose.toObject() : mongoose;
    }

};
