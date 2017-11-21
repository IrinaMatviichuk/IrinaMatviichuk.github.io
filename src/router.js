'use strict';

import _ from 'lodash';
import loginPage from './login/login.page';
import testPage from './test/test.page';
import questionsPage from './admin/questions/questions.page';
import userEditPage from './admin/userEdit/userEdit.page';
import userListPage from './admin/userList/userList.page';
import {userLogOut} from './users/userAuthorization';

let pages = [loginPage, testPage, questionsPage, userEditPage, userListPage];

let init = () => {
	let url = window.location.hash;

	renderPage(url);
	userLogOut();
};

let renderPage = (hash) => {
	let page = _.find(pages, {url: hash});
	let menuItems = document.querySelectorAll('#menu a');

	if (page) {
		page.render();
	} 
	else {
		loginPage.render();
	}

	_.each(menuItems, (item) => {
		item.classList.remove('activeMenu');
	});

	_.each(menuItems, (item) => {
		let url = item.getAttribute('href');
		
		if (url === hash) {
			item.classList.add('activeMenu');
		}
	});
};

export default {init, renderPage};


