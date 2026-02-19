import nodemailer from 'nodemailer'
import dotenv from "dotenv"
import { OpenAI } from 'openai';

dotenv.config();

async function SendEmail(jobs){

    const openai = new OpenAI({
        apiKey:process.env.OpenAI_API_KEY
    });

    const transporter =  nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    })

    for(const send of jobs){

        if(!send.email) continue;
        
        const response = await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages:[
                {
                    role:"system",
                    content:"you are generate text of email of job"
                },
                {
                    role:"user",
                    content: `Generate a professional email for the following job:
                    Title: ${send.title}
                    Company: ${send.company}
                    Location: ${send.location}
                    college: C.B.Patel Computer College
                    course : BCA SEM-6 CONTINUE 
                    and include only this five content in email not experience,university etc
                    `
                }
            ]
        })

        console.log(response.choices[0].message);

        const mailOptions = {
            from: process.env.EMAIL,
            to: send.email,
            subject: `Regarding ${send.title} at ${send.company}`,
            text: `Hello ${send.company}, I saw your job posting "${send.title}" at ${send.location}. Please find my application attached.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${send.company}`);
        } catch (err) {
            console.error(`Failed to send email to ${send.company}:`, err.message);
        }
    }
}

export default SendEmail;