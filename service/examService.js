const Exam = require("../Models/exam");
const User = require("../Models/User");
const Assignment = require("../Models/assignments");
const UserActivity = require("../Models/userActivity");
const McqQuestion = require("../Models/McqQuestion");
const CodeQuestion = require("../Models/codeQuestion");
const Result = require("../Models/results");
// Start the exam for a user
const startExam = async (userId) => {
  try {
    const now = new Date();
    const user = await User.findById(userId);
    const assignmentId = user.assignment;
    const assignment = await Assignment.findById(assignmentId);
    const durationInMinutes = assignment.duration;
    const endTime = new Date(now.getTime() + durationInMinutes * 60000); // Calculate end time

    // Check if the exam is already active for the user
    const existingExam = await Exam.findOne({ userId });
    if (existingExam) {
      const data = await getExamStatus();
      if(data.message==="ended"){
        return {
          success: true,
          message: "Exam started successfully",
          startTime: existingExam.examStartTime,
          endTime:existingExam.examEndTime,
        };
      }
    }
const startTime=now
    // Create a new exam record
    const exam = new Exam({
      userId: userId,
      examStartTime: startTime,
      examEndTime: endTime,
      durationInMinutes,
      assignmentId: assignmentId,
    });

    await exam.save();
    return {
      success: true,
      message: "Exam started successfully",
      startTime: startTime,
      endTime,
    };
  } catch (error) {
    console.error("Error starting the exam:", error);
    return { success: false, message: "Failed to start the exam" };
  }
};

// Calculate remaining time
const getRemainingTime = async (userId) => {
  try {
    const exam = await Exam.findOne({ userId });

    if (!exam) {
      return { success: false, message: "No active exam found for this user" };
    }

    const now = new Date();
    const examEndTime=new Date(exam.examEndTime);
    if (now > examEndTime) {
      return { success: false, message: "Exam time is over" };
    }

    const remainingTimeInMs = examEndTime - now;
    // const remainingTimeInMinutes = Math.floor(remainingTimeInMs / 60000); // Convert ms to minutes
// console.log("remainingTime",remainingTimeInMinutes)
    return { success: true, remainingTime: remainingTimeInMs };
  } catch (error) {
    console.error("Error getting remaining time:", error);
    return { success: false, message: "Failed to fetch remaining time" };
  }
};

const getExamStatus = async (userId) => {
  try {
    const exam = await Exam.findOne({ userId });
    if (!exam) {
      return { success: true, message: "not started" };
    }
    if(exam.startExam){
      return { success: true, status: "started" };
    }
   const reamingTime=await getRemainingTime(userId);
   if(reamingTime.success){
    return { success: true, status: "started"};
   }
   return { success: true, status: "ended" };
}catch(error){
  console.error("Error getting exam status:", error);
  return { success: false, message: "Failed to fetch exam status" };
}
}
// End the exam for a user (optional, if manual end is needed)
const endExam = async (userId, activityLog, examEndTime) => {
  try {
    console.log("inservice",userId)
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "No user found" };
    }
    const exam = await Exam.findOne({ userId });
    if (!exam) {
      return { success: false, message: "No active exam found for this user" };
    }

    exam.examEndTime = examEndTime; // Update end time to now
    console.log(user.loginTimestamps);
    const activity = {
      login: user.loginTimestamps,
      exam: { startTime: exam.examStartTime, endTime: examEndTime },
      windowOutFocus: activityLog.focusEvents,
      exitFullScreen: activityLog.fullscreenExits,
      inspectExamScreen: activityLog.devToolOpen,
      violationCount: activityLog.violationCount,
    };
    const userActivity = new UserActivity({
      user: userId,
      activity: activity,
    });
    const userActivityData = await userActivity.save();
    exam.userActivity = userActivityData._id;
    exam.timeTaken = // Update end time to now
      await exam.save();
    const status = exam.solution.every((element) => element.status === "pass") ? "pass" : "fail";
    const result = new Result({
      user: userId,
      status: status
    });
    await result.save();
    return { success: true, message: "Exam ended successfully" };
  } catch (error) {
    console.error("Error ending the exam:", error);
    return { success: false, message: "Failed to end the exam" };
  }
};

// Function to execute code on Piston API
const executeCode = async (language, version, sourceCode, input) => {
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: sourceCode }],
        stdin: input, // Pass test case input
      }),
    });
    const data = await response.json();
    return data.run.stdout.trim(); // Extract and trim output
  } catch (error) {
    console.error(
      "Error executing code:",
      error.response?.data || error.message
    );
    return { error: "Execution failed" };
  }
};

// Submit solution API
const SubmitSolution = async (
  userId,
  sourceCode,
  version,
  language,
  questionId
) => {
  try {
    const user = await User.findById(userId);
    // Find the active exam
    const exam = await Exam.findOne({ userId });
    if (!exam) {
      return { success: false, message: "No active exam found for this user" };
    }

    // Fetch the question and its test cases
    const MCQquestions = await McqQuestion.find();
    const codeQuestions = await CodeQuestion.find();
    const questions = [...MCQquestions, ...codeQuestions];
    let questionData = null;
    if (questionId) {
      questions.forEach((question) => {
        if (question._id == questionId) {
          questionData = question;
        }
      });
    }
    if (!questionData || !questionData.testCases) {
      return { success: false, message: "Question or test cases not found" };
    }

    let testResults = [];

    // Run each test case
    for (let testCase of questionData.testCases[language]) {
      const actualOutput = await executeCode(
        language,
        version,
        sourceCode,
        testCase.input
      );

      // Determine status
      let status = "pending";
      if (actualOutput === testCase.expectedOutput) {
        status = "pass";
      } else if (actualOutput.error) {
        status = "error";
      } else {
        status = "fail";
      }

      testResults.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        status,
        errorMessage: actualOutput.error || "",
      });
    }

    // Update exam solution
    exam.solution.push({
      question: questionId,
      answer: sourceCode,
      status: testResults.every((t) => t.status === "pass") ? "pass" : "fail",
      testCases: testResults,
    });
    exam.assignmentId = user.assignment;

    await exam.save();

    return {
      success: true,
      message: "Solution submitted and evaluated",
      testResults,
    };
  } catch (error) {
    console.error("Error submitting solution:", error);
    return { success: false, message: "Failed to submit solution" };
  }
};

const saveSolution = async (userId, code, version, language, questionId) => {
  try {
    const exam = await Exam.findOne({ userId });
    if (!exam) {
      return { success: false, message: "No active exam found for this user" };
    }

    // Find existing solution for the question
    const existingSolutionIndex = exam.solution.findIndex(
      (sol) => sol.question.toString() === questionId
    );

    if (existingSolutionIndex !== -1) {
      // Update existing solution
      exam.solution[existingSolutionIndex] = {
        question: questionId,
        answer: code,
        status: "pending",
        testCases: [],
      };
    } else {
      // Add new solution
      exam.solution.push({
        question: questionId,
        answer: code,
        status: "pending",
        testCases: [],
      });
    }

    await exam.save();
    return { success: true, message: "Solution submitted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to submit solution" };
  }
};

module.exports = { startExam, getRemainingTime, endExam, SubmitSolution,saveSolution,getExamStatus };
