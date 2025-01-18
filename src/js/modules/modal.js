import * as bootstrap from 'bootstrap';
import { renderProjectsData, getAllProjects } from "./projectsCRUD";

const closeModalDialog = document.getElementById('close-modal');
export const titleElement = document.getElementById('exampleFormControlInput1');
export const descriptionElement = document.getElementById('exampleFormControlTextarea1');
export const authorElement = document.getElementById('exampleFormControlInput2');
export const statusElement = document.getElementById('exampleFormControlInput3');
export const errorMessage = document.getElementById('modal-error');
export const modalTitle = document.getElementById('modal-title');
const dialogElement = document.getElementById('exampleModal');

export const addArticle = document.getElementById('add-article');
dialogElement.addEventListener('hide.bs.modal', (e) => {
  titleElement.value = '';
  descriptionElement.value = '';
  authorElement.value = '';
  statusElement.value = '';
})

dialogElement.addEventListener('show.bs.modal', (e) => {
  modalTitle.innerText = 'Add new project';
  addArticle.disabled = true;
  console.log('modal here')
})

export function addNewProject() {
  errorMessage.innerText = '';
  const saveProjectButton = document.getElementById('save-project');
  saveProjectButton.classList.remove('hidden')
  console.log(saveProjectButton)
  const saveChangesButton = document.getElementById('save-changes');
  saveChangesButton.classList.add('hidden')
  saveProjectButton.addEventListener('click', () => {
      
    console.log('save project')
      console.log('Handler executed')
      const title = titleElement.value;
      const description = descriptionElement.value;
      const author = authorElement.value;
      const status = statusElement.value;

      if(!checkEmptyFields(title, description, author, status)) return;

      const projects = getAllProjects();

      let currentId;
      if (!projects.length) {
        projects.push({ id: 1, title, description, author, status, articles: [] });
        localStorage.setItem('db_projects', JSON.stringify(projects));
      } else {
        
        const sortedProjects = projects.sort((a,b) => a.id - b.id)
        console.log(sortedProjects)
        currentId = sortedProjects.at(-1).id;
        sortedProjects.push({ id: ++currentId, title, description, author, status, articles: []  });
        localStorage.setItem('db_projects', JSON.stringify(sortedProjects));
      }
      
      renderProjectsData();

      titleElement.value = '';
      descriptionElement.value = '';
      closeModal('exampleModal');
  }
  )
  
  
  
}

export function closeModal(name) {
  const dialogElement = document.getElementById(name);
  const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
  modal.hide();
}

export function openModal() {
  const dialogElement = document.getElementById('exampleModal');
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
