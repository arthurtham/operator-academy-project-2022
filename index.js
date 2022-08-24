/**
 * index.js to run express app
 * Last modified: August 24th, 2022
 */

// Import express and the file containing our route definitions
const express = require("express");
const app = express();
const routes = require("./src/routes");

// Import Twilio and initialize the client.
// IMPORTANT: Remember to set environment variables for your Account SID and Auth Token.
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Configure the express application
const port = 3000;
app.use(express.urlencoded({ extended: false }));
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Your Express application is running on port ${port}`);
});
