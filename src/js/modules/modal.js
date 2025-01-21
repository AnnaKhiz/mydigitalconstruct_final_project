import * as bootstrap from 'bootstrap';
import { renderProjectsData, getAllProjects } from "./projectsCRUD";
import {updateDoughnut, updateLinear} from "./articlesCRUD";

const closeModalDialog = document.getElementById('close-modal');
export const titleElement = document.getElementById('project-name');
export const descriptionElement = document.getElementById('project-description');
export const authorElement = document.getElementById('project-author');

export const errorMessage = document.getElementById('modal-error');
export const modalTitle = document.getElementById('modal-title');
const dialogElement = document.getElementById('modalProject');

export const addArticle = document.getElementById('add-article');
dialogElement.addEventListener('hide.bs.modal', (e) => {
  titleElement.value = '';
  descriptionElement.value = '';
  authorElement.value = '';
})

dialogElement.addEventListener('show.bs.modal', (e) => {
  modalTitle.innerText = 'Add new project';
  addArticle.disabled = true;
  console.log('modal here')
})

export function addNewProject() {
  const addArticleButton = document.getElementById('add-article');
  if (addArticleButton.classList.contains('hidden')) {
    addArticleButton.classList.remove('hidden')
  }
  
  errorMessage.innerText = '';
  const saveProjectButton = document.getElementById('save-project');
  saveProjectButton.classList.remove('hidden')
  const saveChangesButton = document.getElementById('save-changes');
  saveChangesButton.classList.add('hidden')
  saveProjectButton.addEventListener('click', () => {
      
    
  const title = titleElement.value;
  const description = descriptionElement.value;
  const author = authorElement.value;
  

  if(!checkEmptyFields(title, description, author)) return;

  const projects = getAllProjects();

  let currentId;
  if (!projects.length) {
    projects.push({ id: 1, title, description, author, articles: [] });
    localStorage.setItem('db_projects', JSON.stringify(projects));
  } else {
    
    const sortedProjects = projects.sort((a,b) => a.id - b.id)
    console.log(sortedProjects)
    currentId = sortedProjects.at(-1).id;
    sortedProjects.push({ id: ++currentId, title, description, author, articles: []  });
    localStorage.setItem('db_projects', JSON.stringify(sortedProjects));
  }
      
  renderProjectsData();
  updateDoughnut();
  updateLinear();

  titleElement.value = '';
  descriptionElement.value = '';
  closeModal('modalProject');
  })
}

export function closeModal(name) {
  const dialogElement = document.getElementById(name);
  const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
  modal.hide();
}

export function openModal(name) {
  const dialogElement = document.getElementById(name);
  console.log(dialogElement)
  const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
  modal.show();
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
