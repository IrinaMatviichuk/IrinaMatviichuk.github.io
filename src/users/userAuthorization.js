'use strict';

import {getItemLocalStorage} from '../localStorage';
import {createLocalStorage} from '../localStorage';
import router from '../router';

let userEnter = 0;
let userEmail = '';
let userRole = '';
let userFullName = '';
let login = '';
let password = '';

createLocalStorage();

let dataUser = () => {

	createLocalStorage();
	
	if (document.getElementById('login') && document.getElementById('password')) {
		login = document.getElementById('login').value;
		password = document.getElementById('password').value;

		return [login, password];
	}
};

let checkUserEnter = () => {
	dataUser();
	let userListTemp = getItemLocalStorage('usersIM');
	
	for (let i = 0; i < userListTemp.length; i++) {
		if (userListTemp[i].login === login && userListTemp[i].password === password) {
			userEnter = 1;
			userRole = userListTemp[i].role;
			userEmail = userListTemp[i].login;
			userFullName = userListTemp[i].fullName;
		}
	}
};

export let userOnSite = () => {
	checkUserEnter();
	return [userRole, userFullName, userEnter, userEmail];
};

let resetUserParams = () => {
	userEnter = 0;
	userEmail = '';
	userFullName = '';
	userRole = '';
};

export let userLogOut = () => {
	let logOutUser = document.querySelector('div.activeUser');

	if (logOutUser) {
		logOutUser.addEventListener('click', function() {
				logOutUser.remove();
				resetUserParams();
				router.init();
		});
	}
	return userRole;
};

