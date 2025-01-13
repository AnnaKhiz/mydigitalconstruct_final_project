console.log('login')

const emailElement = document.getElementById('email-log');
const passwordElement = document.getElementById('password-log');
const signInButton = document.getElementById('sign-in-button');
const messageBlock = document.getElementById('message-block');

signInButton.addEventListener('click', async (event) => {
  event.preventDefault();
  
  const emailValue = emailElement.value;
  const passwordValue = passwordElement.value;
  
  if (!emailValue && !emailValue.trim() && !passwordValue && !passwordValue.trim()) {
    messageBlock.innerText = 'Empty fields!';
    return
  }
  
  await signIn();
 
})

async function signIn() {
  try {
    const result = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'eve.holt@reqres.in',
        password: '123123'
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await result.json();
    
    if (!data.token) {
      messageBlock.innerText = 'Wrong authentication data!';
      return
    }
    
    localStorage.setItem('db_token', data.token);

    messageBlock.innerText = 'Login successful';
    messageBlock.classList.add('success')
    signInButton.innerText = 'Wait...'
    
    setTimeout(() => {
      document.location.href = 'main.html'
    }, 2000)
    
  } catch (error) {
    console.error('Login error', error)
  }
}