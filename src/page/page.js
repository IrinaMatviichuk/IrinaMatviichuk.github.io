'use strict';

import _ from 'lodash';
import {userOnSite} from '../users/userAuthorization';
import {visiableMenu} from '../dom/menuDom';
import {notVisiableMenu} from '../dom/menuDom';
import usersAccess from '../users/usersAccess.json';

const DEFAULT_SELECTOR = '#page';
const DEFAULT_MENU = ['#/login'];

class Page {
	constructor(url = '', content = '', selector = DEFAULT_SELECTOR, activate = 0, user = '', menuList = []) {
		this.url = url;
		this.content = content;
		this.selector = selector;
		this.activate = activate;
		this.user = user;
		this.menuList = menuList;
	}
	canActivate() {
		let userActive = userOnSite();
		let currentRole = String(userActive[0]);
		let currentMenuList = usersAccess[Object.keys(usersAccess)[_.indexOf(Object.keys(usersAccess), currentRole)]];
		
		this.user = userActive[1];
		this.menuList = currentMenuList || DEFAULT_MENU;

		if (_.indexOf(this.menuList, this.url) !== -1) {
			this.activate = 1;
		} else {window.location.hash = this.menuList[0];}

	}
	clickButton() {

	}
	resetFilter() {
		
	}
	render() {
		let parentElement = document.querySelector(this.selector);

		visiableMenu();
		this.canActivate();
		notVisiableMenu(this.menuList);

		if (this.activate === 1) {			
			parentElement.innerHTML = this.content;
		}
		
		this.clickButton();
		this.resetFilter();
	}	
}

export default Page;