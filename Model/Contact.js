const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        requried:true
    },
    P_number:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('contact',schema);
