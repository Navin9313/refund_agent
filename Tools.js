const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { tool } = require('@langchain/core/tools');
const { createAgent } = require('langchain');
// const { TavilySearchResults } = require("@langchain/community/tools/tavily_search");
const { z, json } = require('zod');
require("dotenv").config();

const ObjectData = {
    name : [
        {
            user: "Navin",
            discountcode: "NV34",
            discountrate: 20
        },
        {
            user: "Suresh",
            discountcode: "S56H",
            discountrate: 30
        },
        {
            user: "Raju",
            discountcode: "R34U",
            discountrate: 25
        },
        {
            user: "Saunak",
            discountcode: "SN89",
            discountrate: 20
        }
    ]
}


// const SearchItem = new TavilySearchResults({
//     maxResults: 1,
// })

const DiscountCode = tool(
    () => {
        return JSON.stringify(ObjectData)
    },
    {
        name: 'Assistent',
        description: "Give Discount of user according their name",
    }
)

async function Shop() {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey:process.env.GEMINI_API_KEY
    })

    const agent = createAgent({
        model: model,
        tools: [DiscountCode]
    })

    // const response = await agent.invoke({
    //     messages: [
    //         {
    //             role: "user",
    //             content: "where is police ground in bharuch,Gujarat"
    //         }
    //     ]
    // })

    // console.log(response);

    const response2 = await agent.invoke({
        messages:[
            {
                role:"user",
                content:"my name is Raju what is my discountcode ?"
            }
        ]
    })
    console.log(response2);
}

Shop();
