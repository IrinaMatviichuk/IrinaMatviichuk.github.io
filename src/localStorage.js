'use strict';

import userList from './users/userList.json';
import testQuestionsDataAll from './test/testQuestions.json';
import urlPages from './page/urlPages.json';

export let createLocalStorage = () => {
	if (JSON.parse(localStorage.getItem('usersIM')) === null) {
		localStorage.setItem('usersIM', JSON.stringify(userList));
	}

	if (JSON.parse(localStorage.getItem('testIM')) === null) {
		localStorage.setItem('testIM', JSON.stringify(testQuestionsDataAll));
	}

	if (JSON.parse(localStorage.getItem('urlIM')) === null) {
		localStorage.setItem('urlIM', JSON.stringify(urlPages));
	}
};

export let setItemLocalStorage = (key, data) => {
	return localStorage.setItem(key, JSON.stringify(data));
};

export let getItemLocalStorage = (key) => {
	return JSON.parse(localStorage.getItem(key));
};