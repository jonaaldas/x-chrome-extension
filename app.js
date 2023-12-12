// const backendUrl = 'https://x-chrome-extension.onrender.com';
// const backendUrl = 'https://presidential-filide-aldas.koyeb.app';
const backendUrl = 'http://localhost:3050';

document.addEventListener('DOMContentLoaded', function () {
	const textArea = document.getElementById('textarea');
	const sendTweetBtn = document.getElementById('submitButton');
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
});

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
