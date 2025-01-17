import './chart.js';
import {addNewProject, openModal} from './modal';
import { renderProjectsData, removeProject, finishProject, editProject } from "./projectsCRUD";

document.addEventListener('DOMContentLoaded', () => {
  
  renderProjectsData()
  removeProject()
  finishProject()
  editProject()
  
  if (document.location.href.includes('main.html')) {
    
    logOut();
    
  }
  
  addNewProject()
})

function logOut() {
  document.addEventListener('click', (event) => {
    if (event.target.dataset.id === 'logout') {
      localStorage.removeItem('db_token');
      document.location.href = '/';
    }
  })

  
}