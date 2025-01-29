import "../styles/custom.scss";
import 'bootstrap';
import '../styles/style.scss';
import './modules/main.js';
import { comparePasswords, validateForm } from "./modules/validation";
import { signIn } from "./modules/signIn";
import { signUp } from "./modules/signUp";

const signUpLink = document.getElementById('sign-up-link');
const signInLink = document.getElementById('sign-in-link');
const signInButton = document.getElementById('sign-in-button');
const signUpButton = document.getElementById('sign-up-button');
const confirmContainer = document.getElementById('confirm-container');
const formSection = document.getElementById('form-section');
const messageBlock = document.getElementById('message-block');
const messageBlockReg = document.getElementById('reg-message-block');
const emailElement = document.getElementById('email');
const passwordElement = document.getElementById('password');
const passwordConfirmElement = document.getElementById('password-confirm');
const navList = document.querySelectorAll('.nav-list');
let isLoginText = true;

if (formSection) {
  document.addEventListener('click', async (e) => {
    e.preventDefault();
    let emailValue;
    let passwordValue;
    
    switch (true) {
      case e.target.dataset.hasOwnProperty('signLink'):
        changePageContent();
        break;
      case e.target.dataset.signButton === 'sign-in':
        emailValue = emailElement.value;
        passwordValue = passwordElement.value;
        if (!validateForm(messageBlock, emailValue, passwordValue)) return;
        await signIn();
        break;
      case e.target.dataset.signButton === 'sign-up':
        emailValue = emailElement.value;
        passwordValue = passwordElement.value;
        const passwordConfirmValue = passwordConfirmElement.value;

        if (!validateForm(messageBlockReg, emailValue, passwordValue, passwordConfirmValue)) return;

        if (!comparePasswords(messageBlockReg, passwordValue, passwordConfirmValue)) {
          return;
        }
        await signUp();
        break;
      default:
        return;
    }
  })
}

function changePageContent() {
  [signUpLink, signInLink, signInButton, signUpButton, confirmContainer, messageBlock, messageBlockReg].forEach(link => link.classList.toggle('hidden'))
  const links = [...navList[0].children];
  links.forEach(link => link.classList.toggle('active'));
  
  const welcomeText = document.getElementById('welcome-text');
  welcomeText.innerHTML = '';
  
  if (isLoginText) {
    welcomeText.insertAdjacentHTML('afterbegin',
      `<h3 class="mb-3 fs-3">Welcome!</h3>
      <p>Enter your email and password to sign up</p>
    `)
    
    isLoginText = false;
  } else {
   
    welcomeText.insertAdjacentHTML('afterbegin',
      `<h3 class="mb-3 fs-3">Nice to see you!</h3>
      <p>Enter your email and password to sign in</p>
    `)
    
    isLoginText = true;
  }
}

