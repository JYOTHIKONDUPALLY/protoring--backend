const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
        feedback: {
        type: String,
        required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Support", supportSchema);