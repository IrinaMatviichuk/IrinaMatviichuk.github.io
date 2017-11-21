'use strict';

import './style.css';
import '../style.css';
import Page from '../../page/page';
import userListContent from './userList.page.html';
import handlebars from 'handlebars';
import {getItemLocalStorage} from '../../localStorage';
import router from '../../router';
import _ from 'lodash';

let userListTemp = getItemLocalStorage('usersIM');

let newUserData = {
	tableWithUser: getItemLocalStorage('usersIM')
};

class UserListPage extends Page {
	render() {
		this.content = handlebars.compile(userListContent)(newUserData);
		super.render();
	}
	clickButton() {
		super.clickButton();
		this.onSearchKeyUser();
		this.resetFilter();
	}
	resetFilter() {
		super.resetFilter();
		newUserData.tableWithUser = getItemLocalStorage('usersIM');
		userListTemp = getItemLocalStorage('usersIM');
		
		return [newUserData.tableWithUser, userListTemp];
	}
	onSearchKeyUser() {

		let searchKey = document.querySelectorAll('.searchUser');	
		
		_.each(searchKey, (search) => {
			search.addEventListener('keyup', function() {
				let id = this.getAttribute('id');
				let searchKey = document.getElementById(id);

				filterDataCheck(searchKey.value);
				router.init();
				document.getElementById(id).value = searchKey.value;
				document.getElementById(id).focus();	
			});		
		});
	}
}

let filterDataCheck = (value) => {
	let newData = [];
	let object = getItemLocalStorage('usersIM');

	for (let key in object) {
		if (object[key].fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
			newData.push(object[key]);
		}
	}

	newUserData.tableWithUser = newData;
	return newUserData.tableWithUser;
};

let userListPage = new UserListPage('#/admin/userList');

export default userListPage;