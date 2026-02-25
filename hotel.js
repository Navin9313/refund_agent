const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { createAgent, tool } = require('langchain')
const { z } = require('zod')
require('dotenv').config();

const data = {
    hotel : [
        {
            city: "surat",
            hotels: [
                {
                    name: "amisha",
                    price: "1500 per night",
                    person: 3
                },
                {
                    name: "global",
                    price: "3500 per night",
                    person: 2
                }
            ]
        },
        {
            city: "Banaskanths",
            hotels: [
                {
                    name: "way-wait",
                    price: "2000 per night",
                    person: 4
                },
                {
                    name: "Mount-wait",
                    price: "3500 per night",
                    person: 2
                }
            ]
        },
        {
            city: "ahmadabad",
            hotels: [
                {
                    name: "siyara",
                    price: "2500 per night",
                    person: 3
                },
                {
                    name: "Triox",
                    price: "3500 per night",
                    person: 2
                }
            ]
        }
    ]
}


const FindHotel = tool(
    ({ city,person }) => {
        const foundcity = data.hotel.find((val)=>(
            val.city.toLowerCase() === city.toLowerCase()
        ));
        console.log(foundcity); // all array give 

        if (!foundcity) {
            return "city not found";
        }

        const availableHotels = foundcity.hotels.filter((hotel) => (
            hotel.person >= person
        ))

        return JSON.stringify(availableHotels);
    },
    {
        name: "find_hotels",
        description: "find hotel base on city and person",
        schema:z.object({
            city: z.string().describe("city according hotels"),
            person: z.number().describe("person according hotels")
        })
    }
)


async function Show(city,person){
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY
    })

    const agent = createAgent({
        model: model,
        tools: [FindHotel]
    });

    const response = await agent.invoke({
        messages:[
            {
                role: "user",
                content: `in ${city} i want a hotel for ${person} person`
            }
        ]
    })

    console.log(response);
}

Show("surat",1);