/**
 * 
 */

class JServiceState {

    states = {}
    constructor() {}

    addState(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        this.states[phoneNumber] = {
            counter: 0,
            questions: [
                
            ]
        };
        return this.states[phoneNumber];
    }

    addQuestion(phoneNumber, category, question, answer) {
        phoneNumber = toString(phoneNumber);
        this.states[phoneNumber].questions.push({
            category: category,
            question: question,
            answer: answer,
            userAnswer: ""
        });
    }

    nextQuestion(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        let counter = this.states[phoneNumber].counter++;
        return this.states[phoneNumber].questions[counter];
    }

    setQuestionCounter(phoneNumber, counter) {
        phoneNumber = toString(phoneNumber);
        this.states[phoneNumber].counter = counter;
        return counter;
    }

    resetState(phoneNumber) {
        return this.addState(phoneNumber);   
    }

    getState(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        return this.states[phoneNumber];
    }
}

module.exports = JServiceState;

