function getComboA(selectObject) {
	const value = selectObject.value;
	alert(value);
}

function setPassword(password) {
	const passwordField = document.querySelector('#password');
	passwordField.value = password;
}

document.querySelector("#env").addEventListener("change", (e) => {
	const selectedEnv = e.target.value;
	let targetUrl = '';

	switch (selectedEnv) {
		case 'testDev/.com':
			targetUrl = 'https://buy.test1.adesa.com/';
			setPassword('Bengals@22q1');
			break;
		case 'qa/.com':
			targetUrl = 'https://buy.test2.adesa.com/';
			setPassword('Bears@22q1');
			break;
		case 'uat/.com':
			targetUrl = 'https://buy.uat1.adesa.com/';
			setPassword('Argonauts@22q1');
			break;
		case 'prepProd/.com':
			targetUrl = 'https://buy.test3.adesa.com/';
			setPassword('Colts@22q1');
			break;
		case 'testDev/.ca':
			targetUrl = 'https://buy.test1.adesa.ca/';
			setPassword('Bengals@22q1');
			break;
		case 'qa/.ca':
			targetUrl = 'https://buy.test2.adesa.ca/';
			setPassword('Bears@22q1');
			break;
		case 'uat .ca':
			targetUrl = 'https://buy.uat1.adesa.ca/';
			setPassword('Argonauts@22q1');
			break;
		case 'prepProd/.ca':
			targetUrl = 'https://buy.test3.adesa.ca/';
			setPassword('Colts@22q1');
			break;

		default:
			break;
	}

	document.querySelector('#url').value = targetUrl;
})

document.querySelector('button#go').addEventListener('click', () => {
	const newUrl = document.querySelector('#url').value;
	if (newUrl.length != 0) {
		// chrome.tabs.create({ url: newUrl });
		chrome.tabs.update({ url: newUrl });
	}
})

document.querySelector('.copy-username').addEventListener('click', async () => {
	debugger
	const username = document.querySelector('#username').value;
	await navigator.clipboard.writeText(username);
})

document.querySelector('.copy-password').addEventListener('click', async () => {
	const username = document.querySelector('#password').value;
	await navigator.clipboard.writeText('password');
})

chrome.tabs.query(
	{ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
	function (tabs) {
		const { id: tabId } = tabs[0].url;
		alert('here')

		const code = `(function getUrls(){
			const forkUrl = document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]') 
				? document.querySelector('meta[name="octolytics-dimension-repository_parent_nwo"]').content
				: undefined;
			const url = document.querySelector('meta[name="go-import"]') 
				? document.querySelector('meta[name="go-import"]').content.split(' ')[0]
				: undefined;
			return { forkUrl, url };
		})()`;

		// http://infoheap.com/chrome-extension-tutorial-access-dom/
		chrome.tabs.executeScript(tabId, { code }, function (result) {
			// result has the return value from `code`
			alert('here')
		});
	}
);