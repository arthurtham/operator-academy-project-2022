const express = require("express");
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const JServiceState = require("./state.js");
let states = new JServiceState();
const maxQuestions = 3;

// Axios allows us to make HTTP requests from our app
const axios = require("axios").default;

// Get questions from jService
async function setQuestions(count=5, phoneNumber) {
  let getAxios = axios
    .get(`https://jservice.io/api/random?count=${count}`)
    .then((response) => {
      // The response will have headers and a body. We get the body using `data`.
      //let public_repos = response.data.public_repos;
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

// Handle a POST request to /sms, assume it is a Twilio webhook, and send
// TWiML in response that creates an SMS reply.
// REMEMBER: you will have to use ngrok to expose your app to the internet before you can use it with Twilio.
router.post("/sms", (req, res) => {
  console.log(
    `Message received from ${req.body.From}, containing ${req.body.Body}`
  );

  res.type(`text/xml`);
  res.send();

  if (
    req.body.Body !== "start" && 
    !states.getState(req.body.From)
    ) {
    noMoreQuestions(req, res);
  } else {
    switch (req.body.Body) {
      case "start": 
        startGame(req, res);
        break;
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

async function getAnswer(req, res) {
  let currentState = states.getState(req.body.From);
  //console.log(currentState);
  let currentQuestion = currentState.questions[currentState.counter-1];
  if (currentQuestion) {
    await client.messages
      .create({body: `Answer: ${currentQuestion.answer.replace(/\W/g, ' ')}`,
                from: req.body.To, to: req.body.From})
      .then(message => console.log(message.sid));
  }
  // else {
  //   console.log("no question to reference");
  //   noMoreQuestions(req, res)
  // };
}

async function nextQuestion(req, res) {
  let nextQuestionData = states.nextQuestion(req.body.From);
  if (nextQuestionData) {
    await client.messages
      .create({body: `Question ${states.getState(req.body.From).counter} (Category: ${nextQuestionData.category.replace(/\W/g, ' ')}):  ${nextQuestionData.question.replace(/\W/g, ' ')}`,
               from: req.body.To, to: req.body.From})
      .then(message => console.log(message.sid));
  } else {
    noMoreQuestions(req, res)
  };
}

async function noMoreQuestions(req, res) {
  console.log("No more questions");
  await client.messages
    .create({body: `No more questions. Use "start" command to start a session.`,
              from: req.body.To, to: req.body.From})
    .then(message => console.log(message.sid));
}

module.exports = router;
