export function validateForm(error, email, password) {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexPassword = /^\d{6,}$/;

  if (!email && !email.trim() && !password && !password.trim()) {
    error.innerText = 'Empty fields!';
    return
  }

  if (!regexEmail.test(email)) {
    error.innerText = 'Wrong email format!';
    return
  }

  if(!regexPassword.test(password)) {
    error.innerText = 'Password should be at least 6 digits!';
    return
  }
  
  return true
  
}

export function comparePasswords(error, password, confirmPassword) {
  if (!confirmPassword && !confirmPassword.trim()) {
    error.innerText = 'Confirm password';
    return;
  }
  
  
  if (password !== confirmPassword) {
    error.innerText = 'Passwords are different!';
    return;
  }
  return true
}



