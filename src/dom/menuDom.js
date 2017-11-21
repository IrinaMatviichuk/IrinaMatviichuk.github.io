'use strict';

import _ from 'lodash';

export let visiableMenu = () => {
	let elementVisiable = document.querySelectorAll('#menu .notVisible');

	if (elementVisiable) {
		_.each(elementVisiable, (item) => {
			item.classList.remove('notVisible');
		});
	}
};

export let notVisiableMenu = (urlMenu) => {
	let elementHide = document.querySelectorAll('#menu a');

	_.each(elementHide, (item) => {

		let hash = item.hash;
		
		if (_.indexOf(urlMenu, hash) === -1 || urlMenu.length === 1) {
			item.classList.add('notVisible');
		}
	});

};