import * as bootstrap from 'bootstrap';
import { renderProjectsData, getAllProjects } from "./projectsCRUD";

export function addNewProject() {
 const saveProjectButton = document.getElementById('save-project');
 const closeModalDialog = document.getElementById('close-modal');
 const titleElement = document.getElementById('exampleFormControlInput1');
 const descriptionElement = document.getElementById('exampleFormControlTextarea1');
 const authorElement = document.getElementById('exampleFormControlInput2');
 const statusElement = document.getElementById('exampleFormControlInput3');
 
 saveProjectButton.addEventListener('click', (event) => {
   event.preventDefault()
   const title = titleElement.value;
   const description = descriptionElement.value;
   const author = authorElement.value;
   const status = statusElement.value;
   
   const errorMessage = document.getElementById('modal-error');
   
   if (title.trim() === '' || description.trim() === '' || author.trim() === '' || status.trim() === '') {
     errorMessage.innerText = 'Empty fields!';
     return;
   }
   errorMessage.innerText = '';
   
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
   const dialogElement = document.getElementById('exampleModal');
   const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
   modal.hide();
 })
}
