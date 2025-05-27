const mongoose=require("mongoose");

const mcqQuestionSchema=new mongoose.Schema({
    question:{type:String, required:true},
    options:[{type:String, required:true}],
    correctOption:{type:String, required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"Admin", required:true},
    createdAt:{type:Date, default:Date.now}
})

module.exports=mongoose.model("McqQuestion", mcqQuestionSchema);