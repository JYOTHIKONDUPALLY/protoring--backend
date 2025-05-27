const express=require("express");
const router=express.Router();
const {submitResults,getResultList}=require("../controller/resultController");

router.post("/submit", submitResults);
router.post("/list",getResultList); 

module.exports=router;
