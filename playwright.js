import { chromium } from "playwright";

const PlayWright = async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.codechaintech.com/");

    // 2. Wait for element to appear
    await page.waitForSelector("h1");

    // 3. Extract text
    const mainHeading = await page.$eval("h1", el => el.textContent.trim());

    console.log("Heading:", mainHeading);

    await browser.close();
}

PlayWright();