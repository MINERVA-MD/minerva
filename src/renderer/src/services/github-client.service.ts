export default class GithubClientService {
	getGithub() {
		window.ipcRenderer.send('github-connect', 'hi');
		window.ipcRenderer.on('github-connected', response => {
			console.log(response);
		});
	}
}
