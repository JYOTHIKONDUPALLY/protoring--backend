const mongoose = require("mongoose");

const FaceEventSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // User ID (who triggered the event)
  status: { type: String,required: true },  // Detection status
  images: [{ image:{type: String}, timestamps: { type: Date},warning: {type: String}} ],  // Base64 image data
   // Event timestamp
});

const FaceEvent = mongoose.model("FaceEvent", FaceEventSchema);

module.exports = FaceEvent;
