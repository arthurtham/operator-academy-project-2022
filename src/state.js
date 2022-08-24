/**
 * JserviceState class for for Twilio JService SMS game
 * Author: Arthur Tham
 * Last modified: August 24th, 2022
 */

class JServiceState {

    states = {}
    constructor() {}

    // Add a game state
    addState(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        this.states[phoneNumber] = {
            counter: 0,
            questions: [
                
            ]
        };
        return this.states[phoneNumber];
    }

    // Append a question to the phone number's game
    addQuestion(phoneNumber, category, question, answer) {
        phoneNumber = toString(phoneNumber);
        this.states[phoneNumber].questions.push({
            category: category,
            question: question,
            answer: answer,
            userAnswer: ""
        });
    }

    // Go to the next question in the phone number's game
    nextQuestion(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        let counter = this.states[phoneNumber].counter++;
        return this.states[phoneNumber].questions[counter];
    }

    // Hard-set the question counter
    setQuestionCounter(phoneNumber, counter) {
        phoneNumber = toString(phoneNumber);
        this.states[phoneNumber].counter = counter;
        return counter;
    }

    // Reset the game state of the phone number
    resetState(phoneNumber) {
        return this.addState(phoneNumber);   
    }

    // Get the phone number's game state
    getState(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        return this.states[phoneNumber];
    }
}

module.exports = JServiceState;

