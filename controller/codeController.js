const CodeQuestion = require("../Models/codeQuestion")

const createCodeQuestion = async (req, res) => {
  try {
    const { title, description, testCases, createdBy,boilerPlateCode } = req.body;

    const newCodeQuestion = new CodeQuestion({
      title,
      description,
      boilerPlateCode,
      testCases,
      createdBy, // Admin ID
    });
  

    await newCodeQuestion.save();
    res.status(201).json({ message: "Code question created successfully", newCodeQuestion });
  } catch (error) {
    res.status(500).json({ message: "Error creating code question", error: error.message });
  }
};


const editOrDeleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, testCases,boilerPlateCode } = req.body;

    // Find the question by ID and update its fields
    const updatedQuestion = await CodeQuestion.findByIdAndUpdate(
      id,
      { title, description, testCases, boilerPlateCode },
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

const getCodeQuestion = async (req, res) => {
  try {
    const { id } = req.body;
    if(id){
      const question = await CodeQuestion.findById(id);

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      res.status(200).json(question);
    }else{
      const questions = await CodeQuestion.find();
      res.status(200).json(questions);
    }

  } catch (error) {  
    res.status(500).json({ message: "Error fetching question", error: error.message });
  }
};

module.exports = { createCodeQuestion, editOrDeleteQuestion ,getCodeQuestion};
