'use strict';

import './style.css';
import Page from '../page/page';
import testPageContent from './test.page.html';
import _ from 'lodash';
import handlebars from 'handlebars';
import {randomQuestionsList} from './generatedTestQuestions';
import {userOnSite} from '../users/userAuthorization';
import router from '../router';
import {setItemLocalStorage} from '../localStorage';
import {getItemLocalStorage} from '../localStorage';

let numberQuestion = 0;
let answerTable = [];
let selectAnswerTable = [];
let correct = '';

let trueAnswer = 0;
let completedAnswer = 0;
let testListForUser = randomQuestionsList();

let testListEnter = {
	test: [testListForUser[numberQuestion]],
	progress: numberQuestion
};

class TestPage extends Page {
	render() {
		this.content = handlebars.compile(testPageContent)(testListEnter);
		super.render();
	}
	clickButton() {
		super.clickButton();
		this.onOnward();
		this.onCheckTest();
	}
	onOnward() {
		let onwardTest = document.getElementById('onwardTest');

		if (onwardTest) {
			onwardTest.addEventListener('click',function() {
				score();	
			});
		}
	}
	onCheckTest() {
		let checkTest = document.getElementById('checkTest');

		if (checkTest) {
			checkTest.addEventListener('click',function() {
				score();			
			});
		}
	}
}

let score = () => {
	let answerDataBased = dataAnswer();
	let answerSelectUser = selectAnswer();

	if (completedAnswer === 1) {
			
	if (_.differenceWith(answerDataBased, answerSelectUser, _.isEqual).length === 0) {
		trueAnswer = trueAnswer + 1;
	}
	
	updateDataUserTest();

	}
};

let updateQuestionTest = () => {
	numberQuestion++;

	testListEnter.test = [testListForUser[numberQuestion]];
	testListEnter.progress = numberQuestion;
	
	router.init();
};

let updateDataUserTest = () => {
	updateQuestionTest();
	
	if (numberQuestion === 4) {
		replaceButtonForAnswer();
	} else if (numberQuestion === 5) {
		enterResult();
		numberQuestion = 0;
		testListEnter.test = [testListForUser[numberQuestion]];
		testListEnter.progress = numberQuestion;
	}

	return [testListEnter.test, testListEnter.progress, numberQuestion];
};

let replaceButtonForAnswer = () => {	
	let checkTest = document.getElementById('checkTest');
	let onwardTest = document.getElementById('onwardTest');
	checkTest.classList.remove('notVisible');
	onwardTest.remove();
};

let calculatedResult = (userName, data) => {
	let div = document.createElement('div');
	let userResult = document.getElementById('userResult');
	let resultTest = trueAnswer/numberQuestion;

	div.setAttribute('class', 'userResult');

	div.innerHTML = 'Result user ' + userName + ' are: ' + Math.ceil(resultTest * 100) + '%';
	userResult.appendChild(div);	

	return resultTest;
};

let recordResult = (data) => {
	let userData = userActiveOnSite();
	let resultTest = calculatedResult(userData[0]);

	for (let i = 0; i < data.length; i++) {
		if (userData[1] && data[i].login === userData[1]) {
			data[i].testResult = Math.ceil(resultTest * 100);	
		}
	}

	return data;
};

let enterResult = () => {
	let testCase = document.getElementById('testCase');	
	let userListTemp = getItemLocalStorage('usersIM');	

	testCase.remove();	
	recordResult(userListTemp);
	setItemLocalStorage('usersIM', userListTemp);

	trueAnswer = 0;

	return trueAnswer;
};

let dataAnswer = () => {

	answerTable = [];

	for (let key in testListForUser[numberQuestion].variantAnswer) {

		if (testListForUser[numberQuestion].variantAnswer.length === 1) {
			correct = testListForUser[numberQuestion].variantAnswer[key].answer;
		} else {
			correct = testListForUser[numberQuestion].variantAnswer[key].correct;
		}

		answerTable.push({
			idAnswer: testListForUser[numberQuestion].variantAnswer[key].idAnswer,
			correct: String(correct)
		});
		
		correct = '';
	}

	return answerTable;
};

let selectAnswer = () => {
	let checkTest = document.querySelectorAll('input.answer');
	selectAnswerTable = [];
	completedAnswer = 0;

	_.each(checkTest, (check) => {
		let id = check.getAttribute('id');
		completedAnswerCheck(checkTest, id);
	});

	correct = '';

	return selectAnswerTable;
};

let completedAnswerCheck = (data, id) => {
	let checkAnswer = document.getElementById(id);
	correct = '0';

	if (data.length === 1) {
		correct = checkAnswer.value;
		completedAnswer = 1;
	} else if (checkAnswer.checked) {
		correct = '1';
		completedAnswer = 1;
	}

	selectAnswerTable.push({
		idAnswer: Number(id.replace('Q', '')),
		correct: correct
	});
};

let userActiveOnSite = () => {
	let userActive = userOnSite();
	let userName = userActive[1];
	let userLogin = userActive[3];

	return [userName, userLogin];
};

let testPage = new TestPage('#/test');

export default testPage;