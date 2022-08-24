

# Twilio SMS JService API Game
Answer trivia questions from the jService.io API, via SMS!

# Setup
This project is a Node.js Express application. 
- Set the environment variables for Twilio.
  - These are `TWILIO_ACCOUNT_SID` for your account SID, and `TWILIO_AUTH_TOKEN` for your auth token.
  - You can find both of these in your [Twilio Console](https://console.twilio.com).
  - If you don't know how to set environment variables on your system, check out [this blog post](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html).
- Use the `npm install` and `npm start` terminal commands to run the project.
- Your application will now be running on `localhost:3000`. You may want to use `ngrok` to generate a public URL for the application if you plan to use the POST route, or to receive requests from outside your network.
- [Link the Twilio SMS Webhook](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-python#configure-your-webhook-url) to the `/sms` HTTP POST route.

# Commands
| SMS message | Description |
| --- | --- |
| !begin | Start a game session |
| !reset | End a game session |
| (default) | Answer a question |

# Operator Academy Project Template
This repository contains a template to use for your final project.
Created by Arthur Tham for TwilioQuest Operator Academy July-August 2022.

https://github.com/TwilioQuest/operator-academy-project

# JService
The trivia questions generated are from the [jService.io](https://jservice.io/) service.
https://github.com/sottenad/jService
