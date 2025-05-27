const mongoose = require("mongoose");

const examschema = new mongoose.Schema(
  {
   userId:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    examStartTime: { type: Date , required:true},
    examEndTime: { type: Date , required:true},
    durationInMinutes:{type:Number, required:true},
    timeTaken:{type:Number},
    userActivity:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserActivity",
    },
    assignmentId:{type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    solution:[{
      question:{type: mongoose.Schema.Types.ObjectId, ref: "Question", },
      answer:{type: String},
      status:{type: String},
      testCases: [
        {
          input: { type: String },  // Store test case input
          expectedOutput: { type: String }, // Expected output
          actualOutput: { type: String }, // Output from user's code
          status: { type: String, enum: ["pass", "fail", "error", "pending"], default: "pending" },
          errorMessage: { type: String }, // Error message if the test case fails
        }
      ],
      
    },
    { timestamps: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examschema);
