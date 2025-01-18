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
  addArticle, projectQuantity

} from "./modal";

export const projectsList = document.getElementById('projects-list');
const noProjectsNotify = document.getElementById('no-projects-notify');
const tableElement = document.getElementById('projects-table');
const projectsQuantity = document.getElementById('projects-quantity');
const articlesQuantity = document.getElementById('articles-quantity');

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
  
  projectsQuantity.innerText = projects.length;
  
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

export function getAllArticlesQuantity() {
  
  const projects = getAllProjects();
  let articles = 0;
  projects.forEach(project => {
    console.log(project.articles.length)
    articles += project.articles.length ? project.articles.length : 0
    console.log(articles)
  })
  
  console.log(articles)
  
  return articles
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

    articlesQuantity.innerText = getAllArticlesQuantity()
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
  errorMessage.innerText = '';
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
  
    // console.log(saveChangesButton)
    modalTitle.innerText = 'Edit project';
    addArticle.disabled = false;

    saveChangesButton.addEventListener('click', () => {
      console.log('titleElement.value', titleElement.value)
      console.log('checkedProject ------', checkedProject)
      
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
      articlesQuantity.innerText = getAllArticlesQuantity()
      renderProjectsData();
      closeModal('exampleModal');
    })
  
  addArticle.addEventListener('click', addNewArticle)
  
  
}

function addNewArticle() {
  
  const articleTitle = document.getElementById('article-title');
  const articleDescription = document.getElementById('article-desc');
  const saveArticle = document.getElementById('save-article')

  articleTitle.value = '';
  articleDescription.value = ''

  saveArticle.addEventListener('click', addArticleHandler)
  addArticle.removeEventListener('click', addNewArticle)
 
}

function addArticleHandler() {
  const articleTitle = document.getElementById('article-title');
  const articleDescription = document.getElementById('article-desc');
  const saveArticle = document.getElementById('save-article')
  const title = articleTitle.value;
  const desc = articleDescription.value;

  if(!checkEmptyFields(title, desc)) {
    const errorContainer = document.getElementById('modal-article-error');
    errorContainer.innerText = 'Empty fields';
    return
  }

  const projects = getAllProjects();
  if (!projects.length) return;

  const articles = projects[checkedProjectIndex].articles;

  console.log('articles', articles)

  let currentId;

  if (!articles.length) {
    projects[checkedProjectIndex].articles.push({
      id: 1,
      title: title,
      description: desc,
      parentProject: checkedProject.id
    })

    console.log('projects if articles 0', projects)
    

  } else {
    const sortedArticles = articles.sort((a,b) => a.id - b.id)
    console.log('sortedArticles', sortedArticles)

    currentId = sortedArticles.at(-1).id;

    projects[checkedProjectIndex].articles.push({
      id: ++currentId,
      title: title,
      description: desc,
      parentProject: checkedProject.id
    })

    console.log('projects articles if not 0', projects)


  }
  localStorage.setItem('db_projects', JSON.stringify(projects));
  projectsQuantity.innerText = projects.length;
  articlesQuantity.innerText = getAllArticlesQuantity()
  renderProjectsData();
  closeModal('exampleModalArticle');
  saveArticle.removeEventListener('click', addArticleHandler)
}