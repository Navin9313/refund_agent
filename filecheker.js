const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const XLSX = require("xlsx");
const axios = require("axios");
const fs = require("fs");
const OpenAI = require('openai');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY
});
console.log(process.env.OpenAI_API_KEY);

let storedtext = "";

app.get("/",(req,res) => {
    res.send("server page");
})

// app.post("/upload", upload.single("file"), async(req,res) => {
//     try {
//         const file = req.file;

//         if (!file) {
//             return res.json({ message:"file not uploaded", status: false });
//         }

//         if ( file.mimetype === "application/pdf") {
//             const data = await pdfParse(fs.readFileSync(file.path));
//             storedtext = data.text;
//         } else if ( file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
//             const workbook = XLSX.readFile(file.path);
//             const sheetName = workbook.SheetNames[0];
//             const sheet = workbook.Sheets[sheetName];
//             storedtext = XLSX.utils.sheet_to_csv(sheet);
//         }

//         console.log("upload",storedtext.substring(0,500));

//         res.json({
//             status: true, message: "file successfully upload"
//         });

//     } catch (error) {
//         return res.json({ message: error, status: false });
//     }
// })

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        console.log("Mimetype received:", file.mimetype);
        console.log("Filename:", file.originalname);

        let tempText = "";
        
        // ફાઈલનું નામ .xlsx થી પૂરું થાય છે કે નહીં તે ચેક કરો (વધારે સેફ રીત)
        const isExcel = file.originalname.endsWith(".xlsx") || 
                        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                        file.mimetype === "application/octet-stream"; // curl માટે આ ઉમેર્યું

        if (file.mimetype === "application/pdf") {
            const dataBuffer = fs.readFileSync(file.path);
            console.log(dataBuffer);
            const data = await pdfParse(dataBuffer);
            tempText = data.text;
        } 
        else if (isExcel) {
            const workbook = XLSX.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            tempText = XLSX.utils.sheet_to_csv(sheet);
        } else {
            return res.status(400).json({ message: "Unsupported file type", status: false });
        }

        storedtext = tempText;
        console.log("Success! Text length:", storedtext.length);

        // ફાઈલ ડીલીટ કરી નાખો
        fs.unlinkSync(file.path);

        res.json({ status: true, message: "File processed successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: error.message });
    }
});

app.post("/ask", async(req,res) => {
    try {
        const { Question } = req.body;

        if(!storedtext){
            return res.json({ message: "file upload first", status: false });
        }

        const response = await openai.chat.completions.create({
            model : "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant. If the question is not related to the document, say 'Not found in document'."
                },
                {
                    role: "user",
                    content: `Document : \n${storedtext}\n \n Answer: ${Question}`
                }
            ]
        });

        res.json({
            message: response.choices[0].message.content
        })
    } catch (error) {
        return res.json({ message: error, status: false });
    }
})

app.listen(5000,() => {
    console.log("Server Running On Port 5000");
})