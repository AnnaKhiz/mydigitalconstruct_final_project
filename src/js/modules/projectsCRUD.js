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

export const projectsList = document.getElementById('projects-list');
const noProjectsNotify = document.getElementById('no-projects-notify');
const tableElement = document.getElementById('projects-table');

let checkedProject;
let checkedProjectIndex;

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

  projectsList.insertAdjacentHTML('beforeend', `
    ${projects.map(project =>
    `<tr class="${+project.status === 100 ? 'opacity-50' : 'opacity-100'}" data-trow="${project.id}">
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
    localStorage.setItem('db_projects', JSON.stringify(projects));
    renderProjectsData();
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
  // projectsList.addEventListener('click', (event) => {
  //   event.preventDefault();
    const projectId = +id;
    const projects = getAllProjects();
    if (!projects.length) return;
    
    console.log('EDIT PROJECT')

    checkedProjectIndex = projects.findIndex(project => +project.id === projectId);
    console.log(checkedProjectIndex)
    if(checkedProjectIndex === -1) return;

    checkedProject = projects[checkedProjectIndex];
    titleElement.value = checkedProject.title;
    descriptionElement.value = checkedProject.description;
    authorElement.value = checkedProject.author;
    statusElement.value = checkedProject.status;

    openModal();
    const saveChangesButton = document.getElementById('save-changes');
    const saveProjectButton = document.getElementById('save-project');
    saveProjectButton.classList.add('hidden')
    saveChangesButton.classList.remove('hidden')
  
    console.log(saveChangesButton)
    
    
    modalTitle.innerText = 'Edit project';
    
    addArticle.disabled = false;

    saveChangesButton.addEventListener('click', () => {
      projects[checkedProjectIndex] = {
        id: checkedProject.id,
        title: titleElement.value,
        description: descriptionElement.value,
        author: authorElement.value,
        status: statusElement.value,
        articles: checkedProject.articles
      }

      if (!checkEmptyFields(titleElement.value, descriptionElement.value, authorElement.value, statusElement.value)) return;

      localStorage.setItem('db_projects', JSON.stringify(projects));
      renderProjectsData();
      closeModal();
    })
    
  

  addArticle.addEventListener('click', (e) => {
    const articleTitle = document.getElementById('article-title');
    const articleDescription = document.getElementById('article-desc');
    const errorContainer = document.getElementById('modal-article-error');

    const projects = getAllProjects();
    if (!projects.length) return;

    if(!checkEmptyFields(articleTitle.value, articleDescription.value)) {
      errorContainer.innerText = 'Empty fields';
      return
    };
    
    const articles = projects[checkedProjectIndex].articles;

    let currentId;
    
    if (!articles.length) {
      projects[checkedProjectIndex].articles.push({
        id: checkedProject.id + '_' + 1,
        title: articleTitle.value,
        description: articleDescription.value
      })

      localStorage.setItem('db_projects', JSON.stringify(projects));
      
    } else {
      currentId = articles.at(-1).id;
      projects[checkedProjectIndex].articles.push({
        id: checkedProject.id + '_' + (++currentId),
        title: articleTitle.value,
        description: articleDescription.value
      })

      localStorage.setItem('db_projects', JSON.stringify(projects));
    }
    
    
    
    
    console.log(checkedProject)
    console.log('add article')
    // addNewArticle()
  })
  
  
}

function editProjectHandler() {
  
}