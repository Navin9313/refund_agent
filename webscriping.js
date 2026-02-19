import axios from "axios";
import * as cheerio from "cheerio";

const Scripting = async () => {
    try {
        // 1. Fetch website HTML
        const { data } = await axios.get("https://www.codechaintech.com/");

        // 2. Load HTML into Cheerio
        const $ = cheerio.load(data);

        // 3. Extract accordion button data
        const extractResults = [];

        $("button.accordion-button").each((i, element) => {
            const button = $(element);

            // Basic extraction
            const text = button.text().trim();
            const classes = button.attr("class");

            // DOM traversal
            const siblings = button.siblings();

            extractResults.push({
                index: i,
                text,
                classes,
                siblingsCount: siblings
            });
        });

        console.log("Extracted Button Data:");
        console.log(extractResults);

        // 4. Run optimized scraper
        const optimizedResults = optimizedScraping($);

        console.log("\nOptimized Scraping Results:");
        console.log(optimizedResults);

    } catch (error) {
        console.log("Scraping site error:", error);
    }
};

// ------------------------------------------------------
// OPTIMIZED SCRAPER FUNCTION
// ------------------------------------------------------
const optimizedScraping = ($) => {
    // Cache frequently used elements
    const accordionItems = $(".accordion-item");
    const MAX_ITEMS = 10;

    const results = [];

    accordionItems.slice(0, MAX_ITEMS).each((i, item) => {
        const $item = $(item);

        // Extract title (lazy evaluation)
        const buttonText = $item.find(".accordion-button").first().text().trim();
        if (!buttonText) return; // Skip empty items

        // Extract short content preview
        const contentText = $item
            .find(".accordion-collapse")
            .text()
            .trim()
            .substring(0, 100) + "...";

        results.push({
            index: i,
            title: buttonText,
            contentPreview: contentText
        });
    });

    return results;
};

// Run scraper
Scripting();
