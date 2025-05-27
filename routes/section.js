const express=require("express");
const router=express.Router();
const {createMcqQuestion,getMcqQuestions}=require("../controller/McqController");
const {createCodeQuestion, getCodeQuestion}=require("../controller/codeController");
const {createSection,getSections,getAllQuestions}=require("../controller/SectionController");
const {verifyRole}=require("../middleware/authMiddleware");

router.post("/",verifyRole(["user", "admin"]),getSections )
router.post("/create",verifyRole(["admin"]),createSection);
router.post("/edit",verifyRole(["admin"]),()=>{});
router.post("/delete",verifyRole(["admin"]),()=>{});
router.post("/question",verifyRole(["user", "admin"]),getAllQuestions);
router.post("/mcqQuestion/create",verifyRole(["admin"]),createMcqQuestion);
router.post("/codeQuestion/create",verifyRole(["admin"]),createCodeQuestion);
router.post("/mcqQuestion",verifyRole(["user", "admin"]),getMcqQuestions);
router.post("/CodeQuestion",verifyRole(["user", "admin"]),getCodeQuestion);

module.exports=router;