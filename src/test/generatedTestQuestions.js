'use strict';

import {createLocalStorage} from '../localStorage';
import {getItemLocalStorage} from '../localStorage';

createLocalStorage();

const NUMBER_QUESTIONS_FOR_TEST = 5;
let questionList = [];
let maxIdQuestion = 0;
let maxIdAnswer = 0;
let countTrueAnswer = 0;
let radioValue = false;
let inputValue = false;

let typeAnswerReset = () => {
	radioValue = false;
	inputValue = false;
	countTrueAnswer = 0;
};

let arrayIdTest = (data, idQuestion, idAnswer) => {
	for (let i = 0; i < data.length; i++) {
		idQuestion.push(data[i].idQuestion);
		for (let j = 0; j < data[i].variantAnswer.length; j++) {
			idAnswer.push(data[i].variantAnswer[j].idAnswer);
		}	
	}
};

export let maxIdTest = () => {
	let testTemp = getItemLocalStorage('testIM');
	let idQuestionArrayAll = [];
	let idAnswerArrayAll = [];

	arrayIdTest(testTemp, idQuestionArrayAll, idAnswerArrayAll);	

	maxIdQuestion = Math.max.apply(null,idQuestionArrayAll);
	maxIdAnswer = Math.max.apply(null,idAnswerArrayAll);

	return [maxIdQuestion, maxIdAnswer, testTemp];
};

let typeAnswer = (idAnswer, testQuestionsData, item) => {

	typeAnswerReset();

	for (let i = 0; i < testQuestionsData[item].variantAnswer.length; i++) {
		countTrueAnswer = countTrueAnswer + testQuestionsData[item].variantAnswer[i].correct;
		idAnswer.push(testQuestionsData[item].variantAnswer[i].idAnswer);
	}

	if (Math.max.apply(null,idAnswer)-Math.min.apply(null,idAnswer) === 0) {
		inputValue = true;
	} else if (countTrueAnswer === 1) {
		radioValue = true;
	}
};

let randomQuestions = (numberQuestion, testQuestionsData) => {
	let random = Math.floor(Math.random() * testQuestionsData.length);	
	let sortQuestionsData = {};
	let idAnswerArray = [];

	typeAnswer(idAnswerArray, testQuestionsData, random);

	sortQuestionsData = {
							numberQuestion: numberQuestion,
							idQuestion: testQuestionsData[random].idQuestion,
							question: testQuestionsData[random].question,
							input: inputValue,
							radio: radioValue,
							maxIdAnswer: Math.max.apply(null,idAnswerArray),
							minIdAnswer: Math.min.apply(null,idAnswerArray),
							variantAnswer: testQuestionsData[random].variantAnswer
						};

	questionList.push(sortQuestionsData);
	testQuestionsData.splice(random, 1);

};

export let randomQuestionsList = () => {
	let testTemp = getItemLocalStorage('testIM');

	let testQuestionsData = testTemp.slice();
	questionList = [];

	for (let i = 1; i <= NUMBER_QUESTIONS_FOR_TEST; i++) {
		randomQuestions(i, testQuestionsData);
	}

	return questionList;
};