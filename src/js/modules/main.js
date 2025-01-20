import './chart.js';
import { addNewProject, openModal, } from './modal';
import {openArticle, renderArticles, getAllArticlesQuantity, removeArticle, editArticle } from "./articlesCRUD";
import { renderProjectsData, removeProject, finishProject, 
  editProject, getAllProjects } from "./projectsCRUD";
import {createDoughnutChart, createLinear} from "./chart";

const projectsQuantity = document.getElementById('projects-quantity');
const projectsContainer = document.getElementById('projects-container');
const totalQuantity = document.getElementById('total-quantity');
const articlesQuantity = document.getElementById('articles-quantity');
const articlesListContainer = document.getElementById('articles-list-container');

document.addEventListener('DOMContentLoaded', () => {
  projectsQuantity.innerText = !getAllProjects().length ? '0' : getAllProjects().length;
  const { articles, published, inProgress, started } = getAllArticlesQuantity()
  console.log('finished', published, articles)
  
  articlesQuantity.innerText = !articles ? '0' : articles;
  totalQuantity.innerText = getAllProjects().length + articles;
  
  createLinear(['project_1', 'project_2', 'project_3', 'project_4'], [15, 85, 24, 44])
  
  createDoughnutChart([published, inProgress, started])
  
  projectsContainer.addEventListener('click', (e) => {
    
    if (e.target.dataset.hasOwnProperty('edit')) {
      editProject(e.target.dataset.edit);
    }
    
    if (e.target.dataset.hasOwnProperty('callmodal')) {
      
      addNewProject();
    }
    
    const currentRow = e.target.closest('tr') ? e.target.closest('tr').dataset.tablerow : null
    
    if (!currentRow) return;
    
    localStorage.setItem('project', currentRow)
    
    if (!currentRow) return;
    
    renderArticles(currentRow);
    
    articlesListContainer.addEventListener('click', (e) => {
      if (e.target.dataset.hasOwnProperty('openart')) {
        openArticle(e.target.dataset.openart);
      }

      if (e.target.dataset.hasOwnProperty('delart')) {
        removeArticle(e.target.dataset.delart);
      }

      if (e.target.dataset.hasOwnProperty('editart')) {
        editArticle(e.target.dataset.editart);
      }
    })
    
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