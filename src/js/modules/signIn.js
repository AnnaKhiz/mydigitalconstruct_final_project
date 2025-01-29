const messageBlock = document.getElementById('message-block');
const signInButton = document.getElementById('sign-in-button');
    export async function signIn() {
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
          messageBlock.innerText = 'Wrong authentication data!';
          return
        }

        localStorage.setItem('db_token', data.token);

        messageBlock.innerText = 'Login successful';
        messageBlock.classList.add('success');
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
        messageBlock.innerText = 'Wrong login or password data!';
        console.error('Login error', error)
      }
    }