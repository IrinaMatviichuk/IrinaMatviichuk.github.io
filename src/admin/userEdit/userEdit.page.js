'use strict';

import './style.css';
import '../style.css';
import Page from '../../page/page';
import userEditContent from './userEdit.page.html';
import handlebars from 'handlebars';
import {getItemLocalStorage, setItemLocalStorage} from '../../localStorage';
import {messageIncorrect, removeMessageIncorrect} from '../../dom/messageIncorrect';
import {dialogShowForm, dialogShowFormSimple, dialogCloseForm} from '../../dom/dialogWindow';
import router from '../../router';
import _ from 'lodash';

let userListTemp = getItemLocalStorage('usersIM');
let userListReserv = getItemLocalStorage('usersIM');
let createUserActive = 0;
let correctDataForWrite = 0;

let newUserData = {
	tableWithUser: userListTemp
};

class UserEditPage extends Page {
	render() {
		this.content = handlebars.compile(userEditContent)(newUserData);
		super.render();
	}
	clickButton() {
		super.clickButton();
		dialogShowForm('dialogUserNew', createUserActive, 'addUserNew');
		this.onSearchKeyUser();
		this.buttonEditUser();
	}
	buttonEditUser() {
		this.onSaveUser();
		this.onDeleteUser();
		this.onEditUser();
		this.onCloseEditUser();
	}
	resetFilter() {
		super.resetFilter();
		newUserData.tableWithUser = getItemLocalStorage('usersIM');

		return newUserData.tableWithUser;
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
	onDeleteUser() {
		let deleteUser = document.querySelectorAll('.deleteUser');

		_.each(deleteUser, (del) => {
			del.addEventListener('click', function() {
				let id = this.getAttribute('id').replace('deleteUser', '');
				let userTemp = getItemLocalStorage('usersIM');

				for (let i = 0; i < userTemp.length; i++) {
					if (Number(id) === Number(userTemp[i].id) && userTemp[i].role !== 'admin') {						
						userTemp.splice(i, 1);
						setItemLocalStorage('usersIM', userTemp);						
						updateData();
					} else if (Number(id) === Number(userTemp[i].id) && userTemp[i].role === 'admin') {
						dialogShowFormSimple('editUserDelete');
					}
				} 
			});
		});
	}
	onSaveUser() {
		let saveUser = document.querySelectorAll('.saveUser');

		_.each(saveUser, (save) => {
			save.addEventListener('click', function() {
				let id = this.getAttribute('id').replace('saveUser', '');
				let elementAfter = document.getElementById('dialogUser' + id);

				let enterData = dataUserValue(id, elementAfter);

				if (correctDataForWrite === 1 && id === 'New') {
					addDataUser(enterData[0],enterData[1],enterData[2]);
				} else if (correctDataForWrite === 1 && id !== 'New') {
					rewriteDataUser(id, enterData[0], enterData[1], enterData[2]);
				}
				
				return;

			});
		});
	}
	onEditUser() {
		let editUser = document.querySelectorAll('.editUser');

		_.each(editUser, (edit) => {
			edit.addEventListener('click', function() {
				let id = this.getAttribute('id').replace('editUser', '');
				let dialogEditUser = String('dialogUser' + id);

				dialogShowFormSimple(dialogEditUser);
			});
		});
	}
	onCloseEditUser() {
		let closeUser = document.querySelectorAll('.closeUser');

		_.each(closeUser, (close) => {
			close.addEventListener('click', function() {
				let id = this.getAttribute('id').replace('closeUser', '');

				updateData();

				if (id === 'New') {
					dialogCloseForm(String('dialogUser' + id), createUserActive, String('closeUser' + id));
				} else {
					dialogCloseForm(String('dialogUser' + id), 0, String('closeUser' + id));
				}
				
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

let dataUserValue = (id, elementAfter) => {
	let login = document.getElementById('enterLogin' + id).value;
	let fullname = document.getElementById('enterFullname' + id).value;
	let role = document.getElementById('roleUserChange' + id).value;

	checkDataUser(login, fullname, role, elementAfter);

	return [login, fullname, role, correctDataForWrite];

};

let checkDataUser = (login, fullname, role, elementAfter) => {
	
	removeMessageIncorrect(elementAfter);

	if (login === '' || fullname  === '' || role === 'Enter user role for change or add') {
		messageIncorrect(elementAfter,'You need to enter all data');
		return;
	} else {correctDataForWrite = 1;}

	return [login, fullname, role, correctDataForWrite];
};

let addDataUser = (login, fullname, role) => {
	let idNew = newUserId();
	let newUser = {};
	let userTemp = getItemLocalStorage('usersIM');

	newUser = {
		id: idNew,
		login: login,
		fullName: fullname,
		password: '',
		role: role,
		testResult: ''
	};

	userTemp.push(newUser);
	replaceData(userTemp);

};

let rewriteDataUser = (id, login, fullname, role) => {
	let password = document.getElementById('passwordUserChange' + id).value;

	if (password === 'Yes') {
		resetPassword(id);
	}

	changeValueUser(id, login, fullname, role);
	replaceData(getItemLocalStorage('usersIM'));
	updateData();
};

let changeValueUser = (id, login, fullname, role) => {
	let userTemp = getItemLocalStorage('usersIM');

	for (let key in userTemp) {
		if (Number(userTemp[key].id) === Number(id)) {

			userTemp[key].login = login;
			userTemp[key].fullName = fullname;
			userTemp[key].role = role;

			setItemLocalStorage('usersIM', userTemp);
		}
	}
};

let resetPassword = (id) => {
	let userTemp = getItemLocalStorage('usersIM');

	for (let key in userTemp) {
		if (userTemp[key].id === Number(id)) {
			userTemp[key].password = '';
			setItemLocalStorage('usersIM', userTemp);
		}
	}
};

let newUserId = () => {
	let maxUserIdArray = [];

	for (let key in userListReserv) {
		maxUserIdArray.push(userListReserv[key].id);
	}

	return Math.max.apply(null,maxUserIdArray) + 1;
	
};

let replaceData = (data) => {
	
	setItemLocalStorage('usersIM',data);
	userListReserv = getItemLocalStorage('usersIM');
	updateData();

	return userListReserv;
};

let updateData = () => {
	newUserData.tableWithUser = getItemLocalStorage('usersIM');
	router.init();
	return newUserData.tableWithUser;
};

let userEditPage = new UserEditPage('#/admin/userEdit');

export default userEditPage;