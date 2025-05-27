const mongoose = require("mongoose");
const { Schema } = mongoose;

const sectionSchema = new Schema({
    title: { type: String, required: true },
    timelimit: { type: Number, required: true },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    }],
    marks: { type: Number, required: true }})

module.exports = mongoose.model("Section", sectionSchema);