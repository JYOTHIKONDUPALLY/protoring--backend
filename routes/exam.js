const express = require("express");
const router = express.Router();
const { startExamController, getRemainingTimeController, endExamController,SubmitSolutionController,getExamStatusController } = require("../controller/examController");
const {verifyRole}=require("../middleware/authMiddleware");

router.post("/start", verifyRole(["user"]),startExamController);

router.post("/remaining-time",verifyRole(["user"]),getRemainingTimeController);

router.post("/status", verifyRole(["user"]),getExamStatusController);
router.post("/end",verifyRole(["user"]), endExamController);

router.post("/Submit",verifyRole(["user"]), SubmitSolutionController);




module.exports=router;