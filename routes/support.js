const express=require("express");
const router=express.Router();
const Support=require("../Models/support");
router.post("/", (req, res) => {
const {userId,feedback} = req.body;

const support = new Support({
    userId,
    feedback,
});

support.save().then((result) => {
    res.status(200).json(result);
}).catch((err) => {
    console.log(err);
    res.status(500).json({message:"Internal Service error"});
});
});