import { dummyJobs } from './dummydata.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();


async function filterJobs(post) {
 
    const openai = new OpenAI({
        apiKey: process.env.OpenAI_API_KEY
    });

    const prompt = `
        You are a job finding assistant. Filter jobs for "${post}" 
        positions from the following data: ${JSON.stringify(dummyJobs, null, 2)}.
        
        Return your response as a single JSON object with a key named "job".
        The value of "job" should be a JSON array of the relevant job objects.
        If no frontend jobs are found, return an empty array.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
              { 
                role: "system", 
                content: "You are a helpful assistant designed to output a valid JSON object." 
              },
              { 
                role: "user", 
                content: prompt
              }
            ],
            temperature: 0,
            response_format: { type: "json_object" } 
        });

        const content = response.choices[0].message.content;

        console.log("--- Raw Response from OpenAI ---");
        console.log(content);

        // Parse the entire string as a JSON object
        const resultObject = JSON.parse(content);
        
        // Access the array *inside* the object, based on our new prompt
        const relevantJobs = resultObject.job;

        console.log("\n--- Filtered Jobs ---");
        console.log(relevantJobs);
        
        return relevantJobs;

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
    }
}

export default filterJobs;

