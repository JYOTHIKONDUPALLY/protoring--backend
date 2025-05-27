const { startExam, getRemainingTime, endExam,SubmitSolution,getExamStatus } = require("../service/examService");

// Controller to start the exam
const startExamController = async (req, res) => {
  try {
    const  userId  = req.userId;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "Login again to start the exam and user is not recognized" });
    }

    const result = await startExam(userId);
    console.log(result);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error in startExamController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get remaining time
const getRemainingTimeController = async (req, res) => {
  try {
    const  userId  = req.userId;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "something wnet wrong" });
    }

    const result = await getRemainingTime(userId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error in getRemainingTimeController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getExamStatusController = async (req, res) => {
  try {
    const  userId  = req.userId;
    const result = await getExamStatus(userId);
    return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error in getExamStatusController:", error);
      return res.status(500).json({ message: "Internal server error" });
      }
}

// Controller to end the exam
const endExamController = async (req, res) => {
  try {
    const  userId  = req.userId;
    const {  activityLog,examEndTime } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "something wnet wrong" });
    }

    const result = await endExam(userId, activityLog, examEndTime);
    return res.status(result.success ? 200 : 400).json({message: message});
  } catch (error) {
    console.error("Error in endExamController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const SubmitSolutionController = async (req, res) => {
  try {
    const { userId, sourceCode,version,language,questionId } = req.body;

    // Validate input
    if (!userId || !sourceCode || !version || !language || !questionId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const result = await SubmitSolution(userId, sourceCode,version,language,questionId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error in SubmitSolutionController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { startExamController, getRemainingTimeController, endExamController , SubmitSolutionController,getExamStatusController};
