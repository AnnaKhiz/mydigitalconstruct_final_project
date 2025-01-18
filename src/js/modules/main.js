import './chart.js';
import {addNewProject, openModal, } from './modal';
import {renderProjectsData, removeProject, finishProject, editProject, getAllProjects, getAllArticlesQuantity, renderArticles, projectsList} from "./projectsCRUD";

const projectsQuantity = document.getElementById('projects-quantity');
const projectsContainer = document.getElementById('projects-container');
const totalQuantity = document.getElementById('total-quantity');
const articlesQuantity = document.getElementById('articles-quantity');

document.addEventListener('DOMContentLoaded', () => {
  projectsQuantity.innerText = !getAllProjects().length ? '0' : getAllProjects().length;
  articlesQuantity.innerText = !getAllArticlesQuantity() ? '0' : getAllArticlesQuantity();
  totalQuantity.innerText = getAllProjects().length + getAllArticlesQuantity();
  
  projectsContainer.addEventListener('click', (e) => {
    // e.preventDefault()
    console.log(e.target.dataset)
    if (e.target.dataset.hasOwnProperty('edit')) {
      editProject(e.target.dataset.edit)
    }
    // e.target.dataset.hasOwnProperty('callmodal')
    if (e.target.dataset.hasOwnProperty('callmodal')) {
      // console.log('i add window')
      addNewProject()
    }
    
    const currentRow = e.target.closest('tr') ? e.target.closest('tr').dataset.tablerow : null
    
    if (!currentRow) return;
    
    renderArticles(currentRow)
    
    console.log(currentRow)
    
    
      
    
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