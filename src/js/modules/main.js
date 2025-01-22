import { updateDoughnut, updateLinear } from "./chart.js";

import {
  openArticle,
  renderArticles,
  getAllArticlesQuantity,
  removeArticle,
  editArticle
} from "./articlesCRUD";

import {
  renderProjectsData, removeProject,
  editProject, getAllProjects, addNewProject, filterProjects
} from "./projectsCRUD";

const projectsContainer = document.getElementById('projects-container');
const articlesListContainer = document.getElementById('articles-list-container');
let sortOrder = {};
document.addEventListener('DOMContentLoaded', () => {
  const projects = !getAllProjects().length ? '0' : getAllProjects().length;
  const { articles } = getAllArticlesQuantity();

  updateStatistic(projects, articles);
  updateDoughnut();
  updateLinear();
  renderProjectsData();
  
  projectsContainer.addEventListener('click', (e) => {
    switch(true) {
      case e.target.dataset.bsTarget === '#filterModal':
        filterProjects();
        break;
      case e.target.dataset.hasOwnProperty('sort'):
        tableSort(e.target.dataset.sort);
        break;
      case e.target.dataset.hasOwnProperty('edit'):
        editProject(e.target.dataset.edit);
        break;
      case e.target.dataset.hasOwnProperty('delete'):
        removeProject(e.target.dataset.delete);
        break;
      case e.target.dataset.hasOwnProperty('callmodal'):
        addNewProject();
        break;
      case !!e.target.closest('tr'):
        saveRowId(e.target.closest('tr'));
        break;
      default:
        return;
    }
    
    articlesListContainer.addEventListener('click', (e) => {
      switch(true) {
        case e.target.dataset.hasOwnProperty('openart'):
          openArticle(e.target.dataset.openart);
          break;
        case e.target.dataset.hasOwnProperty('delart'):
          removeArticle(e.target.dataset.delart);
          break;
        case e.target.dataset.hasOwnProperty('editart'):
          editArticle(e.target.dataset.editart);
          break;
        default:
          return;
      }
    })
  })
  
  
  if (document.location.href.includes('main.html')) {
    logOut();
  }
})

function saveRowId(target) {
  const currentRow = target ? target.dataset.tablerow : null;
  if (!currentRow) return;

  localStorage.setItem('project', currentRow);
  renderArticles(currentRow);
}

function logOut() {
  document.addEventListener('click', (event) => {
    if (event.target.dataset.id === 'logout') {
      localStorage.removeItem('db_token');
      document.location.href = '/';
    }
  })
}

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

export function checkEmptyFields(container, ...fields) {
  console.log('empty', fields.some(el => el.trim() === ''))
  if (fields.some(el => el.trim() === '')) {
    container.innerText = 'Empty fields!';
    return;
  }
  container.innerText = '';
  return true
}

export function updateStatistic(projects, articles) {
  const projectsQuantity = document.getElementById('projects-quantity');
  const articlesQuantity = document.getElementById('articles-quantity');
  const totalQuantity = document.getElementById('total-quantity');

  projectsQuantity.innerText = projects.length ? projects.length : '0';
  articlesQuantity.innerText = articles ? articles : '0';

  totalQuantity.innerText = projects.length + articles;
}

export function switchButtonsVisibility(addArticleId, saveProjectId, saveChangesId, key) {
  const addArticleButton = document.getElementById(addArticleId);

  if (addArticleButton.classList.contains('hidden')) {
    addArticleButton.classList.remove('hidden')
  }

  const saveProjectButton = document.getElementById(saveProjectId);
  const saveChangesButton = document.getElementById(saveChangesId);

  switch (key) {
    case 'add':
      saveProjectButton.classList.remove('hidden')
      saveChangesButton.classList.add('hidden')
      break;
    case 'edit':
      saveProjectButton.classList.add('hidden')
      saveChangesButton.classList.remove('hidden')
      break;
    default:
      return
  }
}