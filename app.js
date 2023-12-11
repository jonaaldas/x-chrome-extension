// const backendUrl = 'https://x-chrome-extension.onrender.com';
const backendUrl = 'https://presidential-filide-aldas.koyeb.app';
// const backendUrl = 'http://localhost:3050';

document.addEventListener('DOMContentLoaded', function () {
	const textArea = document.getElementById('textarea');
	const sendTweetBtn = document.getElementById('submitButton');
	const emailInput = document.querySelector('.emailLoginViewInput');
	const passwordInput = document.querySelector('.passwordLoginViewInput');
	const loginButton = document.querySelector('.loginBtnView');
	const emailRegisterInput = document.querySelector('.registerEmailViewInput');
	const passwordRegisterInput = document.querySelector('.registerPasswordViewInput');
	const registerButton = document.querySelector('.registerBtnView');
	let logOutBtn = document.querySelector('#log-out-button');
	const registerLink = document.getElementById('registerLink');
	const saveSettingsBtn = document.querySelector('.saveSettings');
	let tweetText = null;

	if (textArea) {
		textArea.focus();
	}

	textArea.addEventListener('input', function (e) {
		tweetText = e.target.value;
	});

	sendTweetBtn.addEventListener('click', async function (e) {
		e.preventDefault();
		const response = await fetch(`${backendUrl}/api/tweet`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({text: tweetText, token: localStorage.getItem('userToken')})
		});
		const data = await response.json();
		if (data.success) {
			showFlashMessage(data.message);
			textArea.value = '';
		} else if (data.success === false) {
			showFlashMessage(data.message);
		}
	});

	// Event listener for the textarea to listen for key presses
	textArea.addEventListener('keypress', async function (e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault(); // Prevent the default action to stop from newline being entered
			const response = await fetch(`${backendUrl}/api/tweet`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({text: tweetText, token: localStorage.getItem('userToken')})
			});
			const data = await response.json();
			if (data.success) {
				showFlashMessage(data.message);
				textArea.value = '';
			} else if (data.success === false) {
				showFlashMessage(data.message);
			}
			textArea.value = ''; // Optionally clear the textarea
		}
	});

	registerButton.addEventListener('click', async e => {
		e.preventDefault();
		const email = emailRegisterInput.value;
		const password = passwordRegisterInput.value;
		const response = await fetch(`${backendUrl}/api/register`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email, password})
		});
		const data = await response.json();
		if (data.success) {
			emailRegisterInput.value = '';
			passwordRegisterInput.value = '';
			updateView();
		}
	});

	loginButton.addEventListener('click', async e => {
		console.log('I am getting clicked ');
		e.preventDefault();
		const email = emailInput.value;
		const password = passwordInput.value;

		const response = await fetch(`${backendUrl}/api/login`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email, password})
		});

		const data = await response.json();

		if (data.success == true) {
			emailInput.value = '';
			passwordInput.value = '';
			setToken(data.data);

			updateView();
		}
		console.log('I am getting clicked 2');
	});

	logOutBtn.addEventListener('click', async () => {
		const response = await fetch(`${backendUrl}/api/logout`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		console.log(data);
		localStorage.removeItem('userToken');
	});

	function updateView() {
		const userToken = localStorage.getItem('userToken');
		if (userToken) {
			document.getElementById('login-view').style.display = 'none';
			document.getElementById('register-view').style.display = 'none';
			document.getElementById('main-view').style.display = 'block';
			document.getElementById('settings-view').style.display = 'none';
			document.getElementById('nav-bar-view').style.display = 'block';
		} else {
			document.getElementById('login-view').style.display = 'block';
			document.getElementById('main-view').style.display = 'none';
			document.getElementById('register-view').style.display = 'none';
			document.getElementById('settings-view').style.display = 'none';
			document.getElementById('nav-bar-view').style.display = 'none';
		}
	}

	function setToken(response) {
		localStorage.setItem('userId', response.user.id);
		localStorage.setItem('refreshToken', response.session.refresh_token);
		localStorage.setItem('userToken', response.session.access_token);
		updateView();
	}

	updateView();

	registerLink.addEventListener('click', function () {
		document.getElementById('login-view').style.display = 'none';
		document.getElementById('register-view').style.display = 'block';
	});

	const loginLink = document.getElementById('loginLink');
	loginLink.addEventListener('click', function () {
		document.getElementById('login-view').style.display = 'block';
		document.getElementById('register-view').style.display = 'none';
	});

	logOutBtn.addEventListener('click', async e => {
		e.preventDefault();
		localStorage.removeItem('userId');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userToken');
		updateView();
	});

	const settingsBtn = document.querySelector('.settings-button');
	const settingsView = document.getElementById('settings-view');
	const mainView = document.getElementById('main-view');

	const apiInputs = {
		app_key: document.querySelector('#apiKey'),
		app_secret: document.querySelector('#apiSecret'),
		access_token: document.querySelector('#accessToken'),
		access_secret: document.querySelector('#accessSecret')
	};

	const originalApiKeys = {};

	settingsBtn.addEventListener('click', async () => {
		const {success, data} = await getApiKeysFromDatabase(localStorage.getItem('userId'));

		if (success) {
			toggleView(settingsView, mainView);

			for (const key in apiInputs) {
				apiInputs[key].value = data[0][key];
				originalApiKeys[key] = data[0][key]; // Store the original value
			}
		} else {
			showFlashMessage('You have no API KEYS saved');
			toggleView(settingsView, mainView);
		}
	});

	saveSettingsBtn.addEventListener('click', async e => {
		e.preventDefault();
		await saveSettings(apiInputs, originalApiKeys);
	});
});

async function getApiKeysFromDatabase(userId) {
	const response = await fetch(`${backendUrl}/api/keys`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({userId})
	});
	const data = await response.json();
	return {success: data.length > 0, data: data};
}

function toggleView(settingsView, mainView) {
	if (settingsView.style.display === 'block') {
		settingsView.style.display = 'none';
		mainView.style.display = 'block';
	} else {
		settingsView.style.display = 'block';
		mainView.style.display = 'none';
	}
}

async function saveSettings(apiInputs, originalApiKeys) {
	const userId = localStorage.getItem('userId');

	if (userId === undefined) {
		showFlashMessage('Error getting user, please log in and log out again 😁');
		return;
	}

	// Check if any input value has changed
	let hasChanged = false;
	for (const key in apiInputs) {
		if (apiInputs[key].value !== originalApiKeys[key]) {
			hasChanged = true;
			break;
		}
	}

	if (!hasChanged) {
		showFlashMessage('No changes to save');
		return;
	}

	const apiKeys = {
		app_key: apiInputs.app_key.value,
		app_secret: apiInputs.app_secret.value,
		access_token: apiInputs.access_token.value,
		access_secret: apiInputs.access_secret.value
	};

	const response = await fetch('http://localhost:3050/api/save/settings', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({apiKeys, userId})
	});

	const data = await response.json();

	if (data.success) {
		showFlashMessage(data.message);
	} else if (!data.success) {
		showFlashMessage(data.message + ' Wrong API keys');
	}
}

function showFlashMessage(message, duration = 3000) {
	const flashMessage = document.getElementById('flashMessage');
	flashMessage.textContent = message;
	flashMessage.classList.remove('hidden');
	flashMessage.classList.add('show');

	setTimeout(() => {
		flashMessage.classList.remove('show');
		flashMessage.classList.add('hidden');
	}, duration);
}
