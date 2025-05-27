const express=require("express");
const router=express.Router();
const {verifyRole}=require("../middleware/authMiddleware");
const {createAssignment,editAssignment,getAssginmentList}=require("../controller/assignmentController");

router.post("/list",verifyRole(["user", "admin"]),getAssginmentList);
router.post("/create",verifyRole([ "admin"]),createAssignment);
router.post("/edit",verifyRole([ "admin"]),editAssignment);
// router.post("/delete",()=>{});


module.exports=router;