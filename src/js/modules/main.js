import './chart.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.location.href.includes('main.html')) {
    
    logOut();
    
  }
})

function logOut() {
  const logoutEl = document.getElementById('logout');

  logoutEl.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('db_token');
    document.location.href = '/';
  })
}