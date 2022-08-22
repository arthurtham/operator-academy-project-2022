/**
 *  states = {
 *  "+19991234567": {
 *          questions: { 1, 2, 3, 4, 5}
 *      }
 *  }
 */

class JServiceState {

    states = {

    }

    stateTemplate = {
        counter: 0,
        questions: [
            
        ]
    }

    constructor() {

    }

    addState(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        this.states[phoneNumber] = {...this.stateTemplate};
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

    resetState(phoneNumber) {
        return this.addState(phoneNumber);   
    }

    getState(phoneNumber) {
        phoneNumber = toString(phoneNumber);
        return this.states[phoneNumber];
    }
}

module.exports = JServiceState;

