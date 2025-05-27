const mongoose = require("mongoose");

const codeQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String, // Allow rich HTML content
    required: true,
  },
  boilerPlateCode: {
    "java":{type:String},
    "python":{type:String},
    "cpp":{type:String},
    "javascript":{type:String},
    "c":{type:String},
  },
  testCases: 
    {
      "java":[{
        input: { type: mongoose.Schema.Types.Mixed, required: true }, // Allows mixed data types
        expectedOutput: { type: mongoose.Schema.Types.Mixed, required: true },
        hidden: { type: Boolean, default: false }, // Indicate if the test case is hidden
      }],
      "python":[{ input: { type: mongoose.Schema.Types.Mixed, required: true }, // Allows mixed data types
        expectedOutput: { type: mongoose.Schema.Types.Mixed, required: true },
        hidden: { type: Boolean, default: false }, // Indicate if the test case is hidden
        }],
      "cpp":[{ input: { type: mongoose.Schema.Types.Mixed, required: true }, // Allows mixed data types
        expectedOutput: { type: mongoose.Schema.Types.Mixed, required: true },
        hidden: { type: Boolean, default: false }, // Indicate if the test case is hidden
        }],
      "javascript":[{ input: { type: mongoose.Schema.Types.Mixed, required: true }, // Allows mixed data types
        expectedOutput: { type: mongoose.Schema.Types.Mixed, required: true },
        hidden: { type: Boolean, default: false }, // Indicate if the test case is hidden
        }],
      "c":[{ input: { type: mongoose.Schema.Types.Mixed, required: true }, // Allows mixed data types
        expectedOutput: { type: mongoose.Schema.Types.Mixed, required: true },
        hidden: { type: Boolean, default: false }, // Indicate if the test case is hidden
        }],
    },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  }
}, { timestamps: true }); // Automatically handles `createdAt` and `updatedAt`

module.exports = mongoose.model("CodeQuestion", codeQuestionSchema);
