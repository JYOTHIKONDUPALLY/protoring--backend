const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    jobRole: { type: String, required: true },
    duration: { type: Number, required: true },
    sections: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    }]
});

module.exports = mongoose.model("Assignment", assignmentSchema);
