var mongoose = require("mongoose");

var layoutSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    enterDomain: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

var Layout = mongoose.model("Layout", layoutSchema);

module.exports = Layout;