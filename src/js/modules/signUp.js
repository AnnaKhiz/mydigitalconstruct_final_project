const messageBlockReg = document.getElementById('reg-message-block');
const signUpButton = document.getElementById('sign-up-button');
    export async function signUp() {
      try {
        const result = await fetch('https://reqres.in/api/register', {
          method: 'POST',
          body: JSON.stringify({
            email: 'eve.holt@reqres.in',
            password: 'pistol'
          }),
          headers: { 'Content-Type': 'application/json' }
        })

        const data = await result.json();

        if (!data.token) {
          messageBlockReg.innerText = 'Wrong authentication data!';
          return
        }

        localStorage.setItem('db_token', data.token);

        messageBlockReg.innerText = 'Login successful';
        messageBlockReg.classList.add('success');
        signUpButton.style.opacity = '0.7';
        signUpButton.innerText = 'Wait'

        const intervalId = setInterval(() => {
          signUpButton.innerText += '.'
        }, 1000)

        setTimeout(() => {
          clearInterval(intervalId)
          document.location.href = 'main.html';
        }, 3000)

      } catch (error) {
        console.error('Login error', error)
      }
    }
