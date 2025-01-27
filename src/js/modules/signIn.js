import { validateForm } from "./validation";
document.addEventListener('DOMContentLoaded', () => {
  if (document.location.pathname === '/' || document.location.href.includes('index.html')) {
    const emailElement = document.getElementById('email-log');
    const passwordElement = document.getElementById('password-log');
    const signInButton = document.getElementById('sign-in-button');
    const messageBlockLog = document.getElementById('message-block');
    
    signInButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const emailValue = emailElement.value;
      const passwordValue = passwordElement.value;

      if (!validateForm(messageBlockLog, emailValue, passwordValue)) return;

      await signIn();

    })

    async function signIn() {
      try {
        const result = await fetch('https://reqres.in/api/login', {
          method: 'POST',
          body: JSON.stringify({
            email: 'eve.holt@reqres.in',
            password: '123123'
            // email: emailValue,
            // password: passwordValue
          }),
          headers: {'Content-Type': 'application/json'}
        })

        const data = await result.json();

        if (!data.token) {
          messageBlockLog.innerText = 'Wrong authentication data!';
          return
        }

        localStorage.setItem('db_token', data.token);

        messageBlockLog.innerText = 'Login successful';
        messageBlockLog.classList.add('success');
        signInButton.style.opacity = '0.7';
        signInButton.innerText = 'Wait'

        const intervalId = setInterval(() => {
          signInButton.innerText += '.'
        }, 1000)


        setTimeout(() => {
          clearInterval(intervalId)
          document.location.href = 'main.html';
        }, 3000)

      } catch (error) {
        messageBlockLog.innerText = 'Wrong login or password data!';
        console.error('Login error', error)
      }
    }
  }
})