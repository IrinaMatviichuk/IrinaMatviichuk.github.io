'use strict';

import './style.css';
import '../style.css';
import Page from '../../page/page';
import questionsPageContent from './questions.page.html';
import router from '../../router';
import handlebars from 'handlebars';
import {maxIdTest} from '../../test/generatedTestQuestions';
import {messageIncorrect, removeMessageIncorrect} from '../../dom/messageIncorrect';
import {dialogShowForm, dialogShowFormSimple, dialogCloseForm} from '../../dom/dialogWindow';
import {setItemLocalStorage, getItemLocalStorage} from '../../localStorage';
import _ from 'lodash';

let idForNewQuestion = maxIdTest();
let maxIdQuestion = idForNewQuestion[0];
let maxIdAnswer = idForNewQuestion[1];
let tableWithQuestion = getItemLocalStorage('testIM');
let tableWithQuestionReserv = getItemLocalStorage('testIM');
let createQuestionsActive = 0;
let editQuestionsCorrect = 0;
let dialogEditQuestions = '';
let trueAnswer = 0;
let completeAnswer = 0;
let correct = 0;
let newVariantAnswer = {};
let newQuestionAdd = {};
let variantAnswer = [];

let newTestData = {
			newIdAnswer: [],
			newIdQuestion: maxIdQuestion + 1,
			active: false,
			newQuestion: '',
			newAnswerNumber: 0,
			tableWithQuestion: tableWithQuestion,
		};

class QuestionsPage extends Page {
	render() {
		this.content = handlebars.compile(questionsPageContent)(newTestData);
		super.render();
	}
	clickButton() {		
		super.clickButton();
		this.caseAddQuestion();	
		this.caseEditQuestion();
		this.onSearchKeyTest();
	}
	resetFilter() {
		super.resetFilter();
		newTestData.tableWithQuestion = getItemLocalStorage('testIM');

		return newTestData.tableWithQuestion;
	}
	caseAddQuestion() {
		dialogShowForm('dialogCreateQuestions', createQuestionsActive, 'addQuestionForm');
		dialogCloseForm('dialogCreateQuestions', createQuestionsActive, 'closeQuestionAdd');
		this.onClearQuestion();
		this.onAddFieldForAnswer();
		this.onAddQuestion();
		this.onDeleteQuestion();
	}
	caseEditQuestion() {
		this.onEditQuestion();
		this.onCloseEditQuestion();
		this.onAddNewVariantAnswer();
		this.onSaveEditQuestion();
		this.onEditTestDataText();
		this.onEditTestDataCheckbox();
		this.onDeleteAnswer();
	}
	onClearQuestion() {
		let clearQuestion = document.getElementById('clearFieldQuestion');

		if(clearQuestion) {
			clearQuestion.addEventListener('click', function() {
				clearQuestionAllField();
				router.init();
				createQuestionsActive = 1;
				dialogShowForm('dialogCreateQuestions', createQuestionsActive);
			});
		}
	}
	onAddFieldForAnswer() {
		let addFieldForAnswer = document.getElementById('addFieldForAnswer');

		if (addFieldForAnswer) {
			addFieldForAnswer.addEventListener('click', function() {
				let newQuestion = document.getElementById('enterQuestion').value;
				let newAnswerNumber = document.getElementById('enterNumberAnswer').value;

				removeMessageIncorrect(document.querySelector('div.createQuestions'));
				createQuestionsActive = 1;

				checkFieldForQuestion(newQuestion, newAnswerNumber);

				return [newTestData, createQuestionsActive];
			});
		}
	}
	onAddQuestion() {
		let addQuestion = document.getElementById('addQuestion');
		let amtAnswer = newTestData.newAnswerNumber;

		if(addQuestion) {
			addQuestion.addEventListener('click', function() {

				let elementAfter = document.querySelector('div.createQuestions');
				variantAnswer = [];
				
				checkVariantAnswer(variantAnswer, maxIdAnswer + 1, maxIdAnswer + Number(amtAnswer));
				checkNewQuestion(elementAfter);

				createQuestionsActive = 0;

				return createQuestionsActive;

			});
		}
	}
	onDeleteQuestion() {

		let deleteQuestions = document.querySelectorAll('.delete');

		_.each(deleteQuestions, (question) => {
			question.addEventListener('click', function(){
				let id = this.getAttribute('id');
				let testTemp = getItemLocalStorage('testIM');

				for (let i = 0; i < testTemp.length; i++) {
					if (Number(id.replace('deleteQuestion', '')) === Number(testTemp[i].idQuestion)) {
						testTemp.splice(i, 1);
						setItemLocalStorage('testIM',testTemp);						
						updateData();
					}
				}
			});
		});
	}
	onEditQuestion() {

		let editQuestions = document.querySelectorAll('.edit');
		let testTemp = getItemLocalStorage('testIM');

		_.each(editQuestions, (question) => {
			question.addEventListener('click', function(){
				let id = this.getAttribute('id');				

				for (let i = 0; i < testTemp.length; i++) {
					if (Number(id.replace('editQuestion', '')) === Number(testTemp[i].idQuestion)) {
						dialogEditQuestions = String('dialogEditQuestions' + id.replace('editQuestion', ''));

						dialogShowFormSimple(dialogEditQuestions);

						return dialogEditQuestions;
					}
				}
			});
		});
	}
	onCloseEditQuestion() {

		let closeEditQuestions = document.querySelectorAll('.close');
		let testTemp = getItemLocalStorage('testIM');

		_.each(closeEditQuestions, (question) => {
			question.addEventListener('click', function(){
				let id = this.getAttribute('id');				

				for (let i = 0; i < testTemp.length; i++) {
					if (Number(id.replace('closeQuestionEdit', '')) === Number(testTemp[i].idQuestion)) {
						dialogEditQuestions = 'dialogEditQuestions' + id.replace('closeQuestionEdit', '');

						setItemLocalStorage('testIM',tableWithQuestionReserv);

						updateData();
						dialogCloseForm(String(dialogEditQuestions), 0, String(id));

						return;
					}
				}
			});
		});
	}
	onAddNewVariantAnswer() {

		let addNewVariantAnswer = document.querySelectorAll('.add');

		_.each(addNewVariantAnswer, (question) => {
			question.addEventListener('click', function(){
				let id = this.getAttribute('id').replace('addNewVariantAnswer', '');
				let testTemp = getItemLocalStorage('testIM');

				for (let i = 0; i < testTemp.length; i++) {
					if (Number(id) === Number(testTemp[i].idQuestion)) {
						
						addNewVariantAnswerInQuestion(testTemp, i);
						updateData();
						dialogShowFormSimple('dialogEditQuestions' + id);

						return;
					}
				}
			});
		});
	}
	onSaveEditQuestion() {

		let saveEditQuestions = document.querySelectorAll('.save');

		_.each(saveEditQuestions, (question) => {
			question.addEventListener('click', function() {
				let id = this.getAttribute('id').replace('saveQuestion', '');
				let testTemp = getItemLocalStorage('testIM');
				
				for (let i = 0; i < testTemp.length; i++) {
					if (Number(id) === Number(testTemp[i].idQuestion)) {

						checkEditData(testTemp[i], id);

						if (editQuestionsCorrect === 1) {
							replaceData(testTemp);
						}

					}
				}
			});
		});
	}
	onEditTestDataText() {
		let editTestDataText = document.querySelectorAll('input');
		let testTemp = getItemLocalStorage('testIM');

		_.each(editTestDataText, (input) => {
			input.addEventListener('keyup', function() {
				let id = this.getAttribute('id');
				let idQ = this.parentNode.parentNode.id.replace('idAnswerCase', '');

				if (id.indexOf('enterQuestion') !== 0 && id.indexOf('enterAnswer') !== 0) {
					return;
				}

				if (id.indexOf('enterQuestion') === 0) {
					changeValueQuestion(testTemp, id);
				} else if (id.indexOf('enterAnswer') === 0) {
					changeValueAnswer(testTemp, id.replace('enterAnswer', ''), idQ);
				}

			});
		});

	}
	onEditTestDataCheckbox() {
		let editTestDataCheck = document.querySelectorAll('input.checkboxAnswer');
		let testTemp = getItemLocalStorage('testIM');

		_.each(editTestDataCheck, (check) => {
			check.addEventListener('click', function() {
				let id = this.getAttribute('id');
				let idQ = this.parentNode.parentNode.id.replace('idAnswerCase', '');

				if (id.indexOf('enterCorrect') === 0) {
					changeValueAnswer(testTemp, id.replace('enterCorrect', ''), idQ);
				}

			});
		});
	}
	onDeleteAnswer() {
		let deleteVariantAnswer = document.querySelectorAll('.deleteAnswer');
		let testTemp = getItemLocalStorage('testIM');

		_.each(deleteVariantAnswer, (del) => {
			del.addEventListener('click', function() {
				let id = this.getAttribute('id').replace('deleteAnswer', '');
				let idQ = this.parentNode.parentNode.id.replace('idAnswerCase', '');

				deleteValueAnswer(testTemp, id, idQ);
				dialogShowFormSimple(String('dialogEditQuestions' + idQ));

			});
		});
	}
	onSearchKeyTest() {	
		let searchKey = document.getElementById('searchQuestionInput');		
		
		searchKey.addEventListener('keyup', function() {
			let searchKey = document.getElementById('searchQuestionInput');
			let testTemp = getItemLocalStorage('testIM');

			filterDataCheck(testTemp, searchKey.value);
			router.init();
			document.getElementById('searchQuestionInput').value = searchKey.value;
			document.getElementById('searchQuestionInput').focus();			
		});
	}
}

let filterDataCheck = (object, value) => {
	let newData = [];

	for (let key in object) {
		if (object[key].question.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
			newData.push(object[key]);
		}
	}
	newTestData.tableWithQuestion = newData;
	return newTestData.tableWithQuestion;
};

let arrayDefaultFind = (min, max, arrayDefault = []) => {
	for (let i = min; i <= max; i++) {
		arrayDefault.push(i);
	}

	return arrayDefault;
};

let changeValueQuestion = (object, id) => {
	for (let key in object) {
		if (object[key].idQuestion === Number(id.replace('enterQuestion', ''))) {
			object[key].question = document.getElementById(id).value;

			setItemLocalStorage('testIM', object);
			return;
		}
	}
};

let changeAnswer = (object, id) => {
	for (let answer in object) {
		if (object[answer].idAnswer === Number(id)) {
			object[answer].answer = document.getElementById('enterAnswer' + id).value;
			
			if (document.getElementById('enterCorrect' + id).checked) {
				object[answer].correct = 1;	
			} else {object[answer].correct = 0;}

		}
	}
};

let changeValueAnswer = (object, id, idQ) => {
	for (let key in object) {

		if (Number(object[key].idQuestion) === Number(idQ)) {
			changeAnswer(object[key].variantAnswer, id);
			setItemLocalStorage('testIM', object);
			return;
		}
	}
};

let deleteAnswer = (object, id) => {
	for (let answer in object) {
		if (object[answer].idAnswer === Number(id)) {
			object.splice(answer, 1);
		}
	}
};

let deleteValueAnswer = (object, id, idQ) => {
	for (let key in object) {

		if (Number(object[key].idQuestion) === Number(idQ)) {
			deleteAnswer(object[key].variantAnswer, id);
			setItemLocalStorage('testIM', object);
			updateData();
			return;
		}
	}
};

let checkEditData = (data, id) => {

	let idAnswerInThis = [];

	for (let j = 0; j < data.variantAnswer.length; j ++) {
		idAnswerInThis.push(data.variantAnswer[j].idAnswer);
	}

	let minIdThis = Math.min.apply(null,idAnswerInThis);
	let maxIdThis = Math.max.apply(null,idAnswerInThis);

	checkVariantAnswer(variantAnswer, minIdThis, maxIdThis, idAnswerInThis);
	checkNewQuestion(document.getElementById('dialogEditQuestions' + id), 1);

	return idAnswerInThis;
};

let replaceData = (data) => {
	
	setItemLocalStorage('testIM',data);
	tableWithQuestionReserv = getItemLocalStorage('testIM');
	updateData();

	return tableWithQuestionReserv;
};

let updateData = () => {
	newTestData.tableWithQuestion = getItemLocalStorage('testIM');
	router.init();
	return newTestData.tableWithQuestion;
};

let updateVariables = () => {
	idForNewQuestion = maxIdTest();
	maxIdQuestion = idForNewQuestion[0];
	maxIdAnswer = idForNewQuestion[1];
	tableWithQuestion = getItemLocalStorage('testIM');

	return [idForNewQuestion, maxIdQuestion, maxIdAnswer, tableWithQuestion];
};

let addAnswerNumber = (question, answerNumber) => {
	let idAnswer = {};

	for (let i = 1; i <= answerNumber; i++) {
		idAnswer = {idAnswer: Number(maxIdAnswer) + i};
		newTestData.active = true;
		newTestData.newIdAnswer.push(idAnswer);
		newTestData.newQuestion = question;
		newTestData.newAnswerNumber = answerNumber;
	}

	return idAnswer;
};

let addNewVariantAnswerInQuestion = (data, index) => {

	addAnswerNumber('', Number(1));

	let newVariantAnswerAdd = {};
	
	newVariantAnswerAdd = {
		idAnswer: newTestData.newIdAnswer[0].idAnswer,
		answer: ''
	};

	data[index].variantAnswer.push(newVariantAnswerAdd);				

	setItemLocalStorage('testIM', data);

	updateData();
	updateVariables();

};

let checkFieldForQuestion = (question, answerNumber) => {

	if (question === '' || answerNumber === '') {
		messageIncorrect(document.querySelector('div.createQuestions'),'You need to enter all data');
	} else {
		addAnswerNumber(question, answerNumber);
		router.init();

		formForRecordAnswer(question, answerNumber);
		dialogShowForm('dialogCreateQuestions', createQuestionsActive);
	}

	return [question, answerNumber];

};

let formForRecordAnswer = (newQuestion, newAnswerNumber) =>  {	
	let addQuestion = document.getElementById('addQuestion');
	let addFieldForAnswer = document.getElementById('addFieldForAnswer');
	addQuestion.classList.remove('notVisible');
	addFieldForAnswer.remove();

	document.getElementById('enterQuestion').value = newQuestion;
	document.getElementById('enterNumberAnswer').value = newAnswerNumber;
};

let clearQuestionAllField = () => {
	document.getElementById('enterQuestion').value = '';
	document.getElementById('enterNumberAnswer').value = '';				
	newTestData.newIdAnswer = [];
	newTestData.newIdQuestion = maxIdQuestion + 1;
	newTestData.active = false;
};

let conditionOptionAnswer = (element, amt) => {
	
	correct = 0;

	if (element && (element.checked || Number(amt) === 0)) {
		correct = 1;
	}

	return correct;
};

let zeroFlag = () => {
	completeAnswer = 0;
	trueAnswer = 0;
	editQuestionsCorrect = 0;

	return [completeAnswer, trueAnswer, editQuestionsCorrect];
};

let variantAnswerIsCorrect = (answerNew, index, checked) => {
	newVariantAnswer = {
		idAnswer: index,
		answer: document.getElementById(String('enterAnswer' + index)).value,
		correct: checked
	};

	answerNew.push(newVariantAnswer);
	return answerNew;
};

let checkVariantAnswer = (newVariantAnswer, minId, maxId, array = arrayDefaultFind(minId, maxId)) => {
	
	zeroFlag();

	for (let value of array) {

		conditionOptionAnswer(document.getElementById(String('enterCorrect' + value)), maxId - minId);
			
		trueAnswer = trueAnswer + correct;

		if (document.getElementById(String('enterAnswer' + value)).value !== '' && value) {
			variantAnswerIsCorrect(newVariantAnswer, value, correct);
		} else if (value) {completeAnswer = 1;}

	}

	return [newVariantAnswer, trueAnswer, completeAnswer];
};

let checkNewQuestion = (elementAfter, flag) => {

	removeMessageIncorrect(elementAfter);

	if (completeAnswer === 0 && trueAnswer > 0 && !flag) {
		addNewQuestion();			
		updateData();
	} else if (completeAnswer === 0 && trueAnswer > 0 && flag) {
		editQuestionsCorrect = 1;
	} else {	
		messageIncorrect(elementAfter,'You need to enter all data');
	}

	return editQuestionsCorrect;
};

let addNewQuestion = () => {
	let testTemp = getItemLocalStorage('testIM');
	
	maxIdQuestion = newTestData.newIdQuestion;
	maxIdAnswer += Number(newTestData.newAnswerNumber);

	newQuestionAdd = {
		idQuestion: newTestData.newIdQuestion,
		question: newTestData.newQuestion,
		variantAnswer: variantAnswer
	};

	testTemp.push(newQuestionAdd);

	replaceData(testTemp);

	return [maxIdQuestion, maxIdAnswer];
};

let questionsPage = new QuestionsPage('#/admin/questions');

export default questionsPage;