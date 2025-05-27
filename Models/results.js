const mongoose=require("mongoose");

const resultSchema= new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{type:String, required:true},

})

module.exports=mongoose.model("Result", resultSchema);