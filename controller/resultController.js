const Result = require("../Models/results");
const User = require("../Models/User");
const Assignment = require("../Models/assignments");
const submitResults= async (req, res) => {
    try{
        const {status, userId}=req.body;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const result= new Result({
            status:status,
            user:userId
        });
        const resultData=await result.save();
        res.json(resultData);
        }catch(err){
            console.log(err);
            return res.status(500).json({message:"Internal Service error"});
        }
    }

    const getResultList = async (req, res) => {
        try {
            const { id } = req.params;
            if (id) {
                const result = await Result.findById(id);
                if (!result) {
                    return res.status(400).json({ message: "Result not found" });
                }
                const user=await User.findById(result.user);
                const assignment=await Assignment.findById(result.assignment);

                const resultData={
                    status:result.status,
                    name:user.name,
                    assignment:assignment.title,
                    email:user.email,
                    role:user.role
                }
                return res.json(resultData);
            }
            const data = [];
            const list = await Result.find();
            for (const result of list) {
                const resultData = {};
                const userid = result.user;
                const user = await User.findById(userid);
                if (!user) continue;
                const assignmentid = user.assignment;
                const assignment = await Assignment.findById(assignmentid);
                if (!assignment) continue;
                resultData.status = result.status;
                resultData.name = user.name;
                resultData.assignment = assignment.title;
                resultData.email = user.email;
                resultData.role = user.role;
                data.push(resultData);
            }
    
            if (data.length === 0) {
                return res.status(400).json({ message: "No Results found" });
            }
    
            return res.json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Service Error" });
        }
    };
    

module.exports={submitResults,getResultList};