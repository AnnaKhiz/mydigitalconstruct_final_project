import {
  openModal,
  addNewProject,
  titleElement,
  descriptionElement,
  authorElement,
  checkEmptyFields,
  errorMessage,
  modalTitle,
  closeModal,
  addArticle

} from "./modal";

import { renderArticles, getAllArticlesQuantity, addNewArticle } from "./articlesCRUD";
import {createDoughnutChart, createLinear} from "./chart";

export const projectsList = document.getElementById('projects-list');
const noProjectsNotify = document.getElementById('no-projects-notify');
const tableElement = document.getElementById('projects-table');
const projectsQuantity = document.getElementById('projects-quantity');
const articlesQuantity = document.getElementById('articles-quantity');
const totalQuantity = document.getElementById('total-quantity');

export let checkedProject;
export let checkedProjectIndex;

export function renderProjectsData() {
  const projects = getAllProjects();

  if (!projects.length) {
    tableElement.classList.add('hidden');
    noProjectsNotify.innerText = 'No projects yet';
    return
  }
  
  tableElement.classList.remove('hidden');
  noProjectsNotify.innerText = '';
  projectsList.innerHTML = '';
  
  projectsQuantity.innerText = projects.length;
  const { articles, published, inProgress, started } = getAllArticlesQuantity();
  totalQuantity.innerText = projects.length + articles;

  // createLinear(['project_1', 'project_2', 'project_3', 'project_4'], [15, 85, 24, 44])

  createDoughnutChart([published, inProgress, started])
  
  projectsList.insertAdjacentHTML('beforeend', `
    ${projects.map(project =>
    `<tr class="table-row" data-tablerow="${project.id}" >
        <th scope="row">${project.id}</th>
        <td class="text-truncate">${project.title}</td>
        <td class="text-truncate" style="max-width: 150px;">${project.description}</td>
        <td class="text-truncate">${project.author}</td>
        <td class="text-end">
          <div class="d-flex align-items-center justify-content-end gap-2" >
            <button type="button" class="btn btn-sm actions " >
                <img src="../../assets/img/icons/edit.png" data-edit="${project.id}" alt="edit icon">
            </button>
            <button type="button" class="btn btn-sm actions"  >
                <img src="../../assets/img/icons/delete.png" data-delete="${project.id}" alt="delete icon">
            </button>
          </div>
        </td>
      </tr>
      `).join('')}
   `)
}

export function getAllProjects() {
  return localStorage.getItem('db_projects') ? JSON.parse(localStorage.getItem('db_projects')) : [];
}

export function removeProject() {
  projectsList.addEventListener('click', (event) => {
    event.preventDefault();
    const projectId = +event.target.dataset.delete;
    const projects = getAllProjects();
    if (!projects.length) return;
    
    const index = projects.findIndex(project => +project.id === projectId);
    if (index === -1) return;
    projects.splice(index, 1);
    projectsQuantity.innerText = projects.length;
    
    localStorage.setItem('db_projects', JSON.stringify(projects));
    renderProjectsData();

    const { articles, published, inProgress, started } = getAllArticlesQuantity();
    createDoughnutChart([published, inProgress, started])
    
    articlesQuantity.innerText = articles;

    totalQuantity.innerText = projects.length + articles;
  })
}

export function finishProject() {
  projectsList.addEventListener('click', (event) => {
    event.preventDefault();
    const projectId = +event.target.dataset.done;
    const projects = getAllProjects();
    
    if (!projects.length) return;
    const index = projects.findIndex(project => +project.id === projectId);
    if (index === -1) return;
    
    projects[index].status = 100;
    localStorage.setItem('db_projects', JSON.stringify(projects));

    renderProjectsData();
  })
}

export function editProject(id) {
  const addArticleButton = document.getElementById('add-article');
  if (addArticleButton.classList.contains('hidden')) {
    addArticleButton.classList.remove('hidden')
  }
  errorMessage.innerText = '';
    const projectId = +id;
    const projects = getAllProjects();
    if (!projects.length) return;
    
    checkedProjectIndex = projects.findIndex(project => +project.id === projectId);
    if(checkedProjectIndex === -1) return;

    checkedProject = projects[checkedProjectIndex];
    titleElement.value = checkedProject.title;
    descriptionElement.value = checkedProject.description;
    authorElement.value = checkedProject.author;

    openModal('modalProject');
    const saveChangesButton = document.getElementById('save-changes');
    const saveProjectButton = document.getElementById('save-project');
    saveProjectButton.classList.add('hidden');
    saveChangesButton.classList.remove('hidden');
    
    modalTitle.innerText = 'Edit project';
    addArticle.disabled = false;

    saveChangesButton.addEventListener('click', () => {
      
      if (!checkEmptyFields(titleElement.value, descriptionElement.value, authorElement.value)) return;
      
      projects[checkedProjectIndex] = {
        id: checkedProject.id,
        title: titleElement.value,
        description: descriptionElement.value,
        author: authorElement.value,
        articles: checkedProject.articles
      }
      
      localStorage.setItem('db_projects', JSON.stringify(projects));
      projectsQuantity.innerText = projects.length;
      const { articles, published, inProgress, started } = getAllArticlesQuantity();
      createDoughnutChart([published, inProgress, started])
      articlesQuantity.innerText = articles;

      totalQuantity.innerText = projects.length + articles;
      renderProjectsData();
      renderArticles(checkedProjectIndex)
      closeModal('modalProject');
    })
  
  addArticle.addEventListener('click', addNewArticle);
}


