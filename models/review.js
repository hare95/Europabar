var mongoose = require('mongoose');

// define the schema for our review model
var reviewSchema = mongoose.Schema({
    user: {
        id: String,
        name: String,
        room: String
    },
    post: {
        title: String,
        content: String,
    },
    answers: [{
        user_id: String,
        user_name: String,
        user_room: String,
        content: String
    }]
});

// create the model for reviews and expose it to our app
module.exports = mongoose.model('Review', reviewSchema);
