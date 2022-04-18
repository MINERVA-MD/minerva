import NotificationLevel from '../Interfaces/NotificationLevel';

export default class NotificationService {
	constructor() {
		window.ipcRenderer.on(
			'notify',
			(_: Electron.IpcRendererEvent, level: NotificationLevel, title: string, message: string, timeout = 5) => {
				NotificationService.notify(level, title, message, timeout);
			},
		);
	}

	private static handleHideNotification() {
		document.getElementById('notification')?.classList.add('hidden');
	}

	// timeout in seconds
	private static handleShowNotification(timeout: number) {
		document.getElementById('notification')?.classList.remove('hidden');
		setTimeout(() => {
			this.handleHideNotification();
		}, timeout * 1000);
	}

	private static handleSetNotificationTitle(title: string) {
		document.getElementById('notify-title')!.innerHTML = title;
	}

	private static handleSetNotificationMessage(message: string) {
		document.getElementById('notify-message')!.innerHTML = message;
	}

	private static handleClearNotificationIcons() {
		document.querySelectorAll('.notification-icon').forEach(icon => {
			icon.classList.add('hidden');
		});
	}

	private static handleSetNotificationIcon(level: NotificationLevel) {
		this.handleClearNotificationIcons();
		switch (level) {
			case NotificationLevel.Info: {
				document
					.getElementById('notify-info')
					?.classList.remove('hidden');
				break;
			}

			case NotificationLevel.Success: {
				document
					.getElementById('notify-success')
					?.classList.remove('hidden');
				break;
			}

			case NotificationLevel.Warning: {
				document
					.getElementById('notify-warning')
					?.classList.remove('hidden');
				break;
			}

			case NotificationLevel.Error: {
				document
					.getElementById('notify-error')
					?.classList.remove('hidden');
				break;
			}

			default: {
				// nop
			}
		}
	}

	static notify(
		level: NotificationLevel,
		title: string,
		message: string,
		timeout = 5,
	) {
		this.handleHideNotification();

		this.handleSetNotificationIcon(level);
		this.handleSetNotificationTitle(title);
		this.handleSetNotificationMessage(message);

		this.handleShowNotification(timeout);
	}
}
