import {
  openModal,
  addNewProject,
  titleElement,
  descriptionElement,
  authorElement,
  statusElement,
  checkEmptyFields,
  errorMessage,
  modalTitle,
  closeModal,
  addArticle

} from "./modal";

import { renderArticles, getAllArticlesQuantity, addNewArticle } from "./articlesCRUD";

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
  totalQuantity.innerText = projects.length + getAllArticlesQuantity();
  
  projectsList.insertAdjacentHTML('beforeend', `
    ${projects.map(project =>
    `<tr class="${+project.status === 100 ? 'opacity-50' : 'opacity-100'} table-row" data-tablerow="${project.id}" >
        <th scope="row">${project.id}</th>
        <td class="text-truncate">${project.title}</td>
        <td class="text-truncate" style="max-width: 150px;">${project.description}</td>
        <td class="text-truncate">${project.author}</td>
        <td>
          <div class="progress" role="progressbar" aria-valuenow="${project.status}" aria-valuemin="0" aria-valuemax="100">
            <div 
            class="progress-bar bg-${+project.status === 100 ? 'success' : (+project.status <= 20 ? 'danger' : 'warning')} text-bg-warning" 
            style="width: ${project.status}%"
           >${project.status}%</div>
          </div>
        </td>
        <td class="text-end">
          <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button type="button" class="btn btn-sm btn-primary " data-done="${project.id}">${+project.status === 100 ? 'Finished' : 'Finish'}</button>
            <button type="button" class="btn btn-sm btn-warning " data-edit="${project.id}">Edit</button>
            <button type="button" class="btn btn-sm btn-danger" data-delete="${project.id}" >Delete</button>
          </div>
        </td>
      </tr>
      `).join('')}
   `)
}

export function getAllProjects() {
  const projects =  localStorage.getItem('db_projects') ? JSON.parse(localStorage.getItem('db_projects')) : [];
  return projects.sort((a,b) => a.status - b.status)
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

    const articles = getAllArticlesQuantity();
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
    statusElement.value = checkedProject.status;

    openModal('exampleModal');
    const saveChangesButton = document.getElementById('save-changes');
    const saveProjectButton = document.getElementById('save-project');
    saveProjectButton.classList.add('hidden');
    saveChangesButton.classList.remove('hidden');
    
    modalTitle.innerText = 'Edit project';
    addArticle.disabled = false;

    saveChangesButton.addEventListener('click', () => {
      
      if (!checkEmptyFields(titleElement.value, descriptionElement.value, authorElement.value, statusElement.value)) return;
      
      projects[checkedProjectIndex] = {
        id: checkedProject.id,
        title: titleElement.value,
        description: descriptionElement.value,
        author: authorElement.value,
        status: statusElement.value,
        articles: checkedProject.articles
      }
      
      localStorage.setItem('db_projects', JSON.stringify(projects));
      projectsQuantity.innerText = projects.length;
      const articles = getAllArticlesQuantity();
      articlesQuantity.innerText = articles;

      totalQuantity.innerText = projects.length + articles;
      renderProjectsData();
      renderArticles(checkedProjectIndex)
      closeModal('exampleModal');
    })
  
  addArticle.addEventListener('click', addNewArticle);
}


