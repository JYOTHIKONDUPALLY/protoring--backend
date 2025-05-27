const McqQuestion = require("../Models/McqQuestion");

const createMcqQuestion = async (req, res) => {
  try {
    const { question, options, correctOption, createdBy } = req.body;

    const newMcq = new McqQuestion({
     question,
      options,
      correctOption,
      createdBy, // Admin ID
    });

    await newMcq.save();
    res.status(201).json({ message: "MCQ question created successfully", newMcq });
  } catch (error) {
    res.status(500).json({ message: "Error creating MCQ question", error: error.message });
  }
};

const getMcqQuestions = async (req, res) => {
  try {
    const questions = await McqQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching MCQ questions", error: error.message });
  }
};  

const editOrDeleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, options, correctOption } = req.body;

    // Find the question by ID and update its fields
    const updatedQuestion = await McqQuestion.findByIdAndUpdate(
      id, 
      { title, description, options, correctOption },
      { new: true }
    );  

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }    

    res.status(200).json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: "Error updating or deleting question", error: error.message });
  }
};

module.exports = { createMcqQuestion,editOrDeleteQuestion,getMcqQuestions };
