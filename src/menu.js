'use strict';

import _ from 'lodash';
import router from './router';
import {userLogOut} from './users/userAuthorization';

let init = () => {
	let menuItems = document.querySelectorAll('#menu a');

	_.each(menuItems, (item) => {
		item.addEventListener('click', function(event){
			let hash = this.getAttribute('href');

			router.renderPage(hash);
			userLogOut();
		});
	});
};

export default {init};