import './chart.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.location.href.includes('main.html')) {
    
    logOut();
    
  }
})

function logOut() {
  const logoutEl = [...document.querySelectorAll('[data-id="logout"]')];

  document.addEventListener('click', (event) => {
    if (event.target.dataset.id === 'logout') {
      localStorage.removeItem('db_token');
      document.location.href = '/';
    }
    
  })
}