/**
 * 
 */

const express = require("express");
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const JServiceState = require("./state.js");
let states = new JServiceState();
/**
 * CHANGE MAXQUESTIONS TO INCREASE THE NUMBER OF QUESTIONS PER SESSION
 */
const maxQuestions = 3;

// Axios allows us to make HTTP requests from our app
const axios = require("axios").default;

// Get questions from jService
async function setQuestions(count=5, phoneNumber) {
  let getAxios = axios
    .get(`https://jservice.io/api/random?count=${count}`)
    .then((response) => {
      // The response will have headers and a body. We get the body using `data`.
      response.data.forEach (function (dataPoint)  {
        //console.log(dataPoint);
        let question = dataPoint.question;
        let answer = dataPoint.answer;
        let category = dataPoint.category.title;
        //console.log(question, answer, category);
        
        states.addQuestion(phoneNumber, category, question, answer);
      })
    })
    .catch((error) => {
      console.log(error);
    });
  return getAxios;
}

// Handle a POST request to /sms, assume it is a Twilio webhook.
// Send responses using Twilio JS library so multiple SMS's can be sent.
router.post("/sms", (req, res) => {
  console.log(
    `Message received from ${req.body.From}, containing ${req.body.Body}`
  );

  // Strategy: acknowledge the SMS is received by pushing an empty reply
  res.type(`text/xml`);
  res.send();

  // Strategy: use the Twilio JS library to send multiple messages instead,
  // based on the text message body

  // Strategy: First, check if the help command is sent.
  if (req.body.Body === "faq") {
    sendHelp(req, res);
  // Strategy: First, a game must have been played at least once before the phone number
  // is registered in the states class.
  } else if (
    req.body.Body !== "begin" && 
    !states.getState(req.body.From)
    ) {
    noMoreQuestions(req, res);
  } else {
    // Strategy: The player can start, end, or ask for help on how to play the game.
    switch (req.body.Body) {
      // Start the game
      case "begin":
        startGame(req, res);
        break;

      // End the game
      case "reset":
        // TODO: end the game
        endGame(req, res);
        break;
      
      // Any non-command response runs the "get answer" workflow
      default:
        getAnswer(req, res);
        setTimeout(nextQuestion, 2000, req, res);
    }
  }
});


async function startGame(req, res) {
  states.addState(req.body.From);
  await setQuestions(maxQuestions, req.body.From).then(
    function () {
    client.messages
    .create({body: `There are ${maxQuestions} questions. Good luck!`,
              from: req.body.To, to: req.body.From})
    .then(setTimeout(nextQuestion, 2000, req, res));
    //console.log(states.getState(req.body.From));
    }
  );
}

async function endGame(req, res) {
  states.resetState(req.body.From);
  client.messages
    .create({body: `The game has been reset.`,
              from: req.body.To, to: req.body.From})
}

async function getAnswer(req, res) {
  let currentState = states.getState(req.body.From);
  //console.log(currentState);
  let currentQuestion = currentState.questions[currentState.counter-1];
  if (currentQuestion) {
    await client.messages
      .create({body: `Answer: ${currentQuestion.answer.replace(/[^\S,.]+/g, ' ')}`,
                from: req.body.To, to: req.body.From})
      .then(message => console.log(message.sid));
  }
}

async function nextQuestion(req, res) {
  let nextQuestionData = states.nextQuestion(req.body.From);
  if (nextQuestionData) {
    await client.messages
      .create({body: `Question ${states.getState(req.body.From).counter} (Category: ${nextQuestionData.category.replace(/[^\S,.]+/g, ' ')}):  ${nextQuestionData.question.replace(/[^\S,.]+/g, ' ')}`,
               from: req.body.To, to: req.body.From})
      .then(message => console.log(message.sid));
  } else {
    noMoreQuestions(req, res)
  };
}

async function noMoreQuestions(req, res) {
  console.log("No more questions");
  await client.messages
    .create({body: `No more questions. Use "begin" command to start a session, or "faq" for help.`,
              from: req.body.To, to: req.body.From})
    .then(message => console.log(message.sid));
}

async function sendHelp(req, res) {
  console.log("Help");
  await client.messages
    .create({body: `Send "begin" to play, "reset" to end. Type your response to the questions after you begin a session.`,
              from: req.body.To, to: req.body.From})
    .then(message => console.log(message.sid));
}

module.exports = router;
