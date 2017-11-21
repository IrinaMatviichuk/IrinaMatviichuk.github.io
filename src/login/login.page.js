'use strict';

import './style.css';
import Page from '../page/page';
import router from '../router';
import loginPageContent from './login.page.html';
import {messageIncorrect} from '../dom/messageIncorrect';

let clickUserAuthorization = 0;

class LoginPage extends Page {
	clickButton() {
		super.clickButton();
		this.buttonUserEnter(this.user);		

		if (this.user !== '') {
			createWindowFoundUser(this.user);
			router.init();
		} else if (clickUserAuthorization === 1) {			
			let elementAfter = document.querySelector('div.warning');
			messageIncorrect(elementAfter,'Error. Incorrect login or password.');
			clickUserAuthorization = 0;
		}
	}
	buttonUserEnter() {
		let enterUser = document.getElementById('enterUser');

		if (enterUser) {
			enterUser.addEventListener('click', function() {				
				clickUserAuthorization = 1;
				router.init();
			});
		}
	}
}

function createWindowFoundUser(nameUser) {
	let activeUser = document.querySelector('div.activeUser');
	let div = document.createElement('div');

	if (activeUser) {
		activeUser.remove();
	}

	div.innerHTML = 'UserName: ' + nameUser + ' (Logout)';
	div.classList.add('activeUser');
	document.getElementById('titleSite').appendChild(div);
	router.init();
}

let loginPage = new LoginPage('#/login', loginPageContent);

export default loginPage;