const Assignment = require('../Models/assignments');
const User = require('../Models/User');
const getAssginmentList =async(req, res)=>{
    try{
   
        const  userId  = req.userId;
        if(userId){
            const user= await User.findById(userId);
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            const assignment=await Assignment.findById(user.assignment);
            if(!assignment){
                return res.status(400).json({message:"Assignment not found"});
                }
                return res.status(200).json({assignment});
        }
        if(id){
            const assignment = await Assignment.findById(id);
            if(!assignment){
                return res.status(400).json({message:"Assignment not found"});
            }
            return res.status(200).json(assignment);
        }else{
            const list=await Assignment.find();
            if(!list){
                return res.status(400).json({message:"No Assignments created"});
            }
            return res.json(list);
        }
        
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Service error"})
    }
}

const createAssignment =async(req, res)=>{
    try{
        const {title,jobRole,duration,sections,startDate, endDate}=req.body;
        const assignment=new Assignment({
            title:title,
            jobRole:jobRole,
            duration:duration,
            sections:sections,
            startDate:startDate,
            endDate:endDate
            });
            await assignment.save();
            return res.json(assignment);
            }catch(error){
                console.log(error);
                return res.status(500).json({message:"Internal Service error"})
                }
}

const editAssignment=async(req, res)=>{
    try{
        const {id,updatedAssignment}= req.body;
        const assignmentdata=await Assignment.findByIdAndUpdate(id,updatedAssignment,{new:true});
        if(!assignmentdata){
            return res.status(400).json({message:"Assignment not found"});
        }
        return res.status(200).json(assignmentdata);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Service error"})
    }
}

module.exports={getAssginmentList,createAssignment,editAssignment}