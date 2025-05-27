const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    activity: {
        login: {type:Date
        },
        logout: {
        type:Date
        },
        exam: {
            startTime:{type:Date},
            endTime:{type:Date},
        },
        windowOutFocus:[{
            duration: { type: Number, default: 0 },
            onTime:{type:Date},
            offTime:{type:Date},
        }] , 
        exitFullScreen:[{
            duration: { type: Number, default: 0 },
            enterTime:{type:Date},
            exitTime:{type:Date},
        }] , 
        inspectExamScreen:{
            type:Boolean,
        },
        violationCount :{type:Number,default:0},
    },
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;