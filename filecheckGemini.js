const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const XLSX = require("xlsx");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" });

let storedData = "";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({
    model : "gemini-2.5-flash"
});

app.get("/", (req, res) => {
    res.json("Server Start");
});

app.post("/upload", upload.single("file"), async(req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "file not uploaded", status: false });
        }

        let tempData = "";

        const isExcel = file.originalname.endsWith(".xlsx") || 
                        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                        file.mimetype === "application/octet-stream"; // curl માટે આ ઉમેર્યું

        if (file.mimetype === "application/pdf") {
            const databuffer = fs.readFileSync(file.path);
            const data = await pdfParse(databuffer);
            tempData = data.text;
        } else if (isExcel) {
            const workbook = XLSX.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            tempData = XLSX.utils.sheet_to_csv(sheet);
        } else {
            return res.status(400).json({ message: "Unsupported file type", status: false });
        }

        storedData = tempData;
        console.log("Success! Text length:", storedData.length);
        console.log(storedData);

        // ફાઈલ ડીલીટ કરી નાખો
        fs.unlinkSync(file.path);

        res.json({ status: true, message: "File processed successfully" });

    } catch (error) {
        res.json({ message: error, status: false });
    }
})

app.post("/ask", async(req, res) => {
    try {
        const { Question } = req.body;

        if (!storedData) {
            return res.json({ message: "File Upload First", status: false });
        }

        const prompt = `
            You are a helpful assistant.
            If the question is not related to the document, say "Not found in document".
            
            Document:
            ${storedData}
            
            Question:
            ${Question}
        `;

        const response = await model.generateContent(prompt);
        const result = response.response;
        const text = result.text();

        res.json({text});

    } catch (error) {
        return res.json({ message: error.message, status: false });
    }
})

app.listen(5000,() => {
    console.log("Server running at 5000");
})