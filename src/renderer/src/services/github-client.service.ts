export default class GithubClientService {
	getRepos() {
		window.ipcRenderer.send('github-connect', 'hi');
		window.ipcRenderer.on('github-connected', response => {
			console.log(response);
		});
	}
}
