const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoutes");
dotenv.config();

app.use(cors());
app.use(express.json()); //for JSON data parsing
app.use(bodyParser.urlencoded({extended:true}))   //it parse the form data
app.use("/api/user/", userRoute);

app.use("/", (req, res) => {
  res.send("Welcome to user manager backend!");
});

// Global error handler to catch unhandled errors
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// Handle uncaught exceptions to prevent crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  // Optionally restart or graceful shutdown logic here
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
