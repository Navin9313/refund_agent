import filterJobs from "./findjob.js";
import SendEmail from "./sendemail.js";

(
    async () => {

        // Pass the search term to the filterJobs function
        const jobs = await filterJobs("python");

        if (jobs && jobs.length > 0) {
            // Renamed to 'sendEmail' (lowercase)
            await SendEmail(jobs);
            console.log("\nProcess complete.");
        } else {
            console.log("No jobs found, no emails sent.");
        }
    }
)();