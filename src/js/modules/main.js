import './chart.js';
import {errorMessage} from './modal';
import {
  openArticle,
  renderArticles,
  getAllArticlesQuantity,
  removeArticle,
  editArticle,
  updateDoughnut, updateLinear
} from "./articlesCRUD";
import {
  renderProjectsData, removeProject, finishProject,
  editProject, getAllProjects, addNewProject, filterProjects
} from "./projectsCRUD";


const projectsQuantity = document.getElementById('projects-quantity');
const projectsContainer = document.getElementById('projects-container');
const totalQuantity = document.getElementById('total-quantity');
const articlesQuantity = document.getElementById('articles-quantity');
const articlesListContainer = document.getElementById('articles-list-container');


document.addEventListener('DOMContentLoaded', () => {
  projectsQuantity.innerText = !getAllProjects().length ? '0' : getAllProjects().length;
  const { articles } = getAllArticlesQuantity()
  
  articlesQuantity.innerText = !articles ? '0' : articles;
  totalQuantity.innerText = getAllProjects().length + articles;
  updateDoughnut()
  updateLinear()
  
  projectsContainer.addEventListener('click', (e) => {
    console.log(e.target.dataset)
    
    if(e.target.dataset.bsTarget === '#filterModal') {
      filterProjects()
    }
    
    if (e.target.dataset.hasOwnProperty('sort')) {
      tableSort(e.target.dataset.sort)
    }
    
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

let sortOrder = {};
function tableSort(value) {
  if (!sortOrder[value]) {
    sortOrder[value] = 'asc'
  } else {
    sortOrder[value] = sortOrder[value] === 'asc' ? 'desc' : 'asc';
  }
  
  const projects = getAllProjects();
  
  if (value === 'id') {
    projects.sort((a,b) =>
      sortOrder[value] === 'asc' ? b[value] - a[value] : a[value] - b[value])
  } else {
    projects.sort((a,b) =>
      sortOrder[value] === 'asc' ? a[value].localeCompare(b[value]) : b[value].localeCompare(a[value]))
      
  }
  
  renderProjectsData(projects)
}

export function checkEmptyFields(...fields) {
  console.log('empty', fields.some(el => el.trim() === ''))
  if (fields.some(el => el.trim() === '')) {
    errorMessage.innerText = 'Empty fields!';
    return;
  }
  errorMessage.innerText = '';
  return true
}
