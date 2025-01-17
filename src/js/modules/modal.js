import * as bootstrap from 'bootstrap';
import { renderProjectsData, getAllProjects } from "./projectsCRUD";
export const saveProjectButton = document.getElementById('save-project');
const closeModalDialog = document.getElementById('close-modal');
export const titleElement = document.getElementById('exampleFormControlInput1');
export const descriptionElement = document.getElementById('exampleFormControlTextarea1');
export const authorElement = document.getElementById('exampleFormControlInput2');
export const statusElement = document.getElementById('exampleFormControlInput3');
export const errorMessage = document.getElementById('modal-error');
export const modalTitle = document.getElementById('modal-title');
const dialogElement = document.getElementById('exampleModal');

dialogElement.addEventListener('show.bs.modal', (e) => {
  saveProjectButton.innerText = 'Save project';
  modalTitle.innerText = 'Add new project';
  console.log('modal here')
})

export function addNewProject() {
  // saveProjectButton.innerText = 'Save project';
  
  if (saveProjectButton.innerText !== 'Save project') return;
  
  saveProjectButton.addEventListener('click', (event) => {
   event.preventDefault()
   const title = titleElement.value;
   const description = descriptionElement.value;
   const author = authorElement.value;
   const status = statusElement.value;
  
   if(!checkEmptyFields(title, description, author, status)) return;
   
   const projects = getAllProjects();
   
   let currentId;
   if (!projects.length) {
     projects.push({ id: 1, title, description, author, status });
     localStorage.setItem('db_projects', JSON.stringify(projects));
   } else {
     currentId = projects.at(-1).id;
     projects.push({ id: ++currentId, title, description, author, status });
     localStorage.setItem('db_projects', JSON.stringify(projects));
   }
   
   renderProjectsData();
   
   titleElement.value = '';
   descriptionElement.value = '';
   closeModal()
  })
}

export function closeModal() {
  const dialogElement = document.getElementById('exampleModal');
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
