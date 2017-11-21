'use strict';

export let dialogShowForm = (dialogId, dialogShowId, dialogShowClick) => {
	let dialog = document.getElementById(dialogId);
	let dialogShow = document.getElementById(dialogShowClick);

	if (dialogShow) {
		dialogShow.addEventListener('click', function() {			
			dialog.showModal();
			dialogShowId = 1;
		});
	} else if (dialogShowId === 1) {
		dialog.showModal();
	}

	return dialogShowId;
};

export let dialogCloseForm = (dialogId, dialogCloseId, dialogCloseClick) => {
	let dialog = document.getElementById(dialogId);
	let dialogClose = document.getElementById(dialogCloseClick);

	if (dialogClose) {
		dialogClose.addEventListener('click', function() {
			dialog.close();
			dialogCloseId = 0;
		});
	}

	return dialogCloseId;
};

export let dialogShowFormSimple = (dialogId) => {
	let dialog = document.getElementById(dialogId);
	
	if (dialog) {
		dialog.showModal();
	}
};