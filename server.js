const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const WebSocket = require("ws");
const http = require("http");
const {saveSolution} = require("./service/examService");
const {saveImage}=require("./service/authService");

const app = express();
const server = http.createServer(app); 
const wss = new WebSocket.Server({ server });
// Middleware
app.use(bodyParser.json());
app.use(cors());

// WebSocket Connection
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   // ws.on('message', async(message) => {
//   //   try{
//   //     const { userId, code, version, language, questionId } = JSON.parse(message);
//   //     const result =await saveSolution(userId, code, version, language, questionId);
//   //     console.log(result);
//   //     ws.send(JSON.stringify({ message: result.message }));
//   //   }catch(error){
//   //     console.error('Error handling message:', error);
//   //     ws.send(JSON.stringify({ type: 'error', message: 'Failed to save solution' }));
//   //   }
    
//   // });
//   ws.on('face-detection', async(data) => {
//     try{
//       console.log(data);
//       const { userId, image, timestamps, warning } = data;
//       const result=await saveImage(userId, image, timestamps, warning);
//       ws.send(JSON.stringify({ message: result.message }));
//     }catch(error){
//       console.log(error);
//       ws.send(JSON.stringify({ type: 'error', message: 'Failed to save image' }));
//     }
// })

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.eventType === "face-detection") {
        const { userId, image, timestamps, warning } = data;
        const result = await saveImage(userId, image, timestamps, warning);
        ws.send(JSON.stringify({ type: "success", message: result.message }));
      } else {
        console.log("Unknown WebSocket message type:", data.eventType);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid WebSocket message format" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});


// Simple HTTP route
app.get("/", (req, res) => {
  console.log("Server is running");
  res.send("Server is running"); 
});

// API routes
const routes = ["auth", "exam", "results", "admin", "assignment", "section", "email"];
routes.forEach((route) => {
  app.use(`/api/${route}`, require(`./routes/${route}`));
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));  