import './chart.js';
import { addNewProject } from './modal';
import { renderProjectsData, removeProject } from "./projectsCRUD";

document.addEventListener('DOMContentLoaded', () => {
  renderProjectsData()
  removeProject()
  
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

  addNewProject()
}