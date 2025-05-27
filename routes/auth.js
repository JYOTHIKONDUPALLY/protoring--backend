const express=require("express");
const router=express.Router();
const {login, logout, register}=require("../controller/authController");
const {verifyRole}=require("../middleware/authMiddleware");

router.post("/login",login);

  router.post("/logout", verifyRole(["user"]), logout);
  
  router.post("/register",verifyRole(["admin"]), register);

module.exports=router;