//pass: jZNDaJYNepJtgziG

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/TaskRoutes");

const multer = require("multer");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/tasks", router);
app.use("/files", express.static("files"));
app.use("/technicians", require("./Routes/TechnicianRoutes"));

// Nested routes (note the path includes :taskId)
const taskContactRouter = require("./Routes/taskContact");
app.use("/tasks/:taskId/contact", taskContactRouter);

const taskIssueRouter = require("./Routes/taskIssue");
app.use("/tasks/:taskId/issue", taskIssueRouter);

const taskHistoryRouter = require("./Routes/taskStatusHistory");
app.use("/tasks/:taskId/history", taskHistoryRouter);

// DB connect and start
mongoose
  .connect("mongodb+srv://Admin:jZNDaJYNepJtgziG@cluster0.cl7c1kp.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));

// -------- PDF Upload --------
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

// Insert model
require("./Model/PdfModel");
const pdfSchema = mongoose.model("PdfDetails");
const pdfUpload = multer({ storage: pdfStorage });

app.post("/uploadfile", pdfUpload.single("file"), async (req, res) => {
  try {
    const title = req.body.title;
    const pdf = req.file?.filename;
    if (!pdf) return res.status(400).send({ message: "No file uploaded", status: "error" });
    await pdfSchema.create({ title, pdf });
    res.send({ message: "Pdf uploaded successfully", status: 200 });
  } catch (error) {
    console.error("Error uploading PDF:", error.message);
    res.status(500).send({ message: "Error uploading PDF: " + error.message, status: "error" });
  }
});

app.get("/getFile", async (req, res) => {
  try {
    const data = await pdfSchema.find({});
    res.send({ message: "Pdf fetched successfully", status: 200, data });
  } catch (error) {
    console.error("Error fetching PDFs:", error.message);
    res.status(500).send({ message: "Error fetching PDFs: " + error.message, status: "error" });
  }
});