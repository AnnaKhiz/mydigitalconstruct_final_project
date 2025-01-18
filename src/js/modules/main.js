import './chart.js';
import {addNewProject, openModal, } from './modal';
import {renderProjectsData, removeProject, finishProject, editProject, getAllProjects, getAllArticlesQuantity, projectsList} from "./projectsCRUD";

const projectsQuantity = document.getElementById('projects-quantity');
const projectsContainer = document.getElementById('projects-container');
const articlesQuantity = document.getElementById('articles-quantity');

document.addEventListener('DOMContentLoaded', () => {
  projectsQuantity.innerText = !getAllProjects().length ? '0' : getAllProjects().length;
  articlesQuantity.innerText = !getAllArticlesQuantity() ? '0' : getAllArticlesQuantity()
  projectsContainer.addEventListener('click', (e) => {
    // e.preventDefault()
    // console.log(e.target.dataset)
    
    if (e.target.dataset.hasOwnProperty('edit')) {
      editProject(e.target.dataset.edit)
    }
    // e.target.dataset.hasOwnProperty('callmodal')
    if (e.target.dataset.hasOwnProperty('callmodal')) {
      // console.log('i add window')
      addNewProject()
    }
      
    
  })
  
  
  
  
  
  renderProjectsData()
  removeProject()
  finishProject()
  
  
  if (document.location.href.includes('main.html')) {
    logOut();
  }
  
  
})

function logOut() {
  document.addEventListener('click', (event) => {
    if (event.target.dataset.id === 'logout') {
      localStorage.removeItem('db_token');
      document.location.href = '/';
    }
  })

  
}