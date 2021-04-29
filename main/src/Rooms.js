const mongoose = require('mongoose');

const roomShema = new mongoose.Schema({
    admin:{
        type: String,
    },   
    name:{
        type: String,
        required: true,
        min: 1,
        max: 255
    },

    participant: {
        type: Array,
        default : []

    },

    date: {
        type: Date,
        default : Date.now
    }
})


module.exports = mongoose.model('Room', roomShema);