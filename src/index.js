'use strict';

import './style.css';
import {createLocalStorage} from './localStorage';
import router from './router';
import menu from './menu';

createLocalStorage();

router.init();
menu.init();

const clearLS = document.getElementById('logoType');

clearLS.addEventListener('click', () => {
	localStorage.removeItem('testIM');
	localStorage.removeItem('usersIM');
});