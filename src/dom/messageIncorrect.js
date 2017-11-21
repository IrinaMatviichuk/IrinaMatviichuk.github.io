'use strict';

export let messageIncorrect = (element,text) => {
	let div = document.createElement('div');
	div.innerHTML = text;
	div.classList.add('warningEnterUser');
	element.appendChild(div);
};

export let removeMessageIncorrect = (elementAfter) => {	
	if (elementAfter) {
		let notActive = elementAfter.querySelector('div.warningEnterUser');

		if (notActive !== null) {
			notActive.remove();
		}
	}
};