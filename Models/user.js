const mongoose=require("mongoose");
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema(
    {
        name:{type:String, required:false},
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        role:{type:String, required:true},
        exp: { type: mongoose.Schema.Types.Mixed },
        phone:{type:String, required:false},
        active: { type: Boolean, default: false },
        loginTimestamps:{type:Date},
        assignment:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Assignment"}
        ],
        passwordExpiration: { type: Date, validate:{
                validator: (v) => !isNaN(new Date(v).getTime()),
                message:"Not a valid date!",
          
        } },
        accessRole:{type:String, required:true}, 
    },
    { timestamps:true}
);

// userSchema.pre('save', async function(next){
//     if(this.isModified('password')){
//         const salt=await bcrypt.genSalt(10);
//         this.password=await bcrypt.hash(this.password, salt);
//     }
//     next();
// });

module.exports=mongoose.model("User", userSchema);