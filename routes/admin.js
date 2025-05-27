const express=require("express");
const router=express.Router();
const{registerAdmin,loginAdmin,getDashboardData}=require("../controller/adminController");
const {verifyRole}=require("../middleware/authMiddleware");
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout",()=>{});
router.post("/dashboard",verifyRole(["admin"]),getDashboardData); 

module.exports=router;