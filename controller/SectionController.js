const Section = require("../models/Section");
const McqQuestion = require("../Models/McqQuestion");
const CodeQuestion = require("../Models/codeQuestion")

const createSection = async (req, res) => {
  try {
    const { title, timelimit, marks, questions } = req.body;

    // Create a new section
    const newSection = new Section({
      title,
      timelimit,
      marks,
      questions: questions, // Array of questionIds
    });

    // Save the section to the database
    await newSection.save();
    res.status(201).json({ message: "Section created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating section", error: error.message });
  }
};

const getSections = async (req, res) => {
  try {
    const {id}=req.body;
    console.log("id", id);
    if(id){
      const section = await Section.findById(id);
      if (!section) {
        console.log("no section")
        return res.status(404).json({ message: "Section not found" });
      }
      console.log("section data", section, "of id", id)
      res.status(200).json({ section });
    }else{
      const sections = await Section.find();
      res.status(200).json(sections);
    }
  
  } catch (error) {
    res.status(500).json({ message: "Error fetching sections", error: error.message });
  }
};

const editSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, timelimit, marks, questionIds } = req.body;

    // Find the section by ID
    const section = await Section.findById(id);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Update the section fields
    section.title = title;
    section.timelimit = timelimit;
    section.marks = marks;
    section.questions = questionIds; // Array of questionIds

    // Save the updated section
    await section.save();

    res.status(200).json({ message: "Section updated successfully", section });
  } catch (error) {
    res.status(500).json({ message: "Error updating section", error: error.message });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the section by ID and delete it
    const deletedSection = await Section.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({ message: "Section not found" });
    } else {
      // Delete associated questions
      await McqQuestion.deleteMany({ _id: { $in: deletedSection.questions } });
      await CodeQuestion.deleteMany({ _id: { $in: deletedSection.questions } });

      res.status(200).json({ message: "Section deleted successfully", deletedSection });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting section", error: error.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const {id}=req.body;
    const MCQquestions = await McqQuestion.find();
    const codeQuestions = await CodeQuestion.find();
    const questions = [...MCQquestions, ...codeQuestions];
    if(id){
      questions.forEach((question) => {
        if(question._id==id){
         res.status(200).json({ question });
        }
      })
    }else{
      res.status(200).json(questions);
    }

  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

module.exports = { createSection ,getSections,editSection,deleteSection,getAllQuestions};
