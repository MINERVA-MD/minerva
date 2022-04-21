const closeNotification = () => {
	const notifyToast = document.getElementById('notification');
	notifyToast?.classList.add('hidden');
};

const registerNotificationHandlers = () => {
	console.log('Registering Notification Handlers ...');
	document
		.getElementById('close-notify-btn')
		?.addEventListener('click', closeNotification);
};

document.addEventListener('DOMContentLoaded', registerNotificationHandlers);
export {};
