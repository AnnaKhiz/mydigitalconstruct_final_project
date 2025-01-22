import { getAllProjects, renderProjectsData, checkedProjectIndex, checkedProject } from "./projectsCRUD";
import { closeModal, openModal } from "./modal";
import { updateLinear, updateDoughnut } from "./chart";
import { checkEmptyFields, updateStatistic, switchButtonsVisibility } from "./main";

const noArticlesNotify = document.getElementById('no-articles-notify');
const articlesListContainer = document.getElementById('articles-list-container');
const articlesList = document.getElementById('articles-list');
const articleTitle = document.getElementById('article-title');
const articleDescription = document.getElementById('article-desc');
const statusElement = document.getElementById('article-status');
const errorMessage = document.getElementById('modal-article-error')
export function openArticle(id) {
  const projects = getAllProjects();

  if (!projects.length) return;
  const currentRow = localStorage.getItem('project');

  const currentProject = projects.find(el => el.id === +currentRow);

  if (!currentProject) return;

  const selectedArticle = currentProject.articles.find(el => el.id === +id);
  setProgressBackground(selectedArticle.status);
  
  const progressBarEl = document.getElementById('article-progress-bar');
 
  progressBarEl.parentElement.setAttribute('aria-valuenow', selectedArticle.status);
  progressBarEl.style.width = `${selectedArticle.status}%`;
  progressBarEl.innerText = `${selectedArticle.status}%`;
 
  document.getElementById('open-header').innerText = selectedArticle.title;
  document.getElementById('open-description').innerText = selectedArticle.description;

  openModal('articleBody');
  finishArticle(selectedArticle);
}
export function renderArticles(id) {
  const projects = getAllProjects();
  
  if (!projects.length) return;
  const currentProject = projects.find(el => +el.id === +id);
  
  if (!currentProject) {
    return;
  }
  
  const projectsArticles = currentProject.articles;

  if (!projectsArticles.length) {
    noArticlesNotify.innerText = 'No articles in this project';
    articlesListContainer.classList.add('hidden');
    return;
  }
  
  articlesListContainer.classList.remove('hidden');
  noArticlesNotify.innerText = '';
  articlesList.innerHTML = '';

  projectsArticles.sort((a,b) => a.status - b.status);
  
  articlesList.insertAdjacentHTML('beforeend', `
    ${projectsArticles.map(article => `
        <div class="card card-item opacity-${+article.status === 100 ? '50' : '100'}">
          <img src="./assets/img/card.jpg" class="card-img-top" alt="image">
          <div class="card-body">
            <div 
              class="progress mb-4 h-25" 
              role="progressbar" 
              aria-valuenow="${article.status}" 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              <div 
              class="progress-bar bg-${+article.status === 100 ? 'success' : (+article.status >= 50 && +article.status < 100 ? 'warning' : 'danger')} text-bg-warning" 
              style="width: ${article.status}%"
             >${article.status}%</div>
          </div>
        
            <h5 class="card-title fs-5 text-truncate">${article.title}</h5>
            <p class="card-text text-truncate mb-4 fs-6" >${article.description}</p>
            <div class="d-flex align-items-center justify-content-between">
              <a href="#" class="d-block btn btn-primary btn-sm" data-openart="${article.id}">Open</a>
              <div class="d-flex align-items-center justify-content-end gap-2">
                <a href="#" class="d-block btn btn-sm actions" >
                  <img src="../../assets/img/icons/edit.png" data-editart="${article.id}" alt="edit icon">
                </a>
                <a href="#" class="d-block btn btn-sm actions" >
                  <img src="../../assets/img/icons/delete.png" data-delart="${article.id}" alt="delete icon">
                </a>
            </div>
            </div>
          </div>
        </div>
    `).join('')}
  `)
}

export function getAllArticlesQuantity() {
  const projects = getAllProjects();
  
  let articles = 0;
  let published = 0;
  let inProgress = 0;
  let started = 0;
  
  projects.forEach(project => {
    articles += project.articles.length ? project.articles.length : 0;

    published += project.articles.length ? project.articles.filter(el => +el.status === 100).length : 0;

    inProgress += project.articles.length ? project.articles.filter(el => +el.status >= 50 && +el.status < 100).length : 0;

    started += project.articles.length ? project.articles.filter(el => +el.status > 0 && +el.status < 50).length : 0;
  })
  return { articles, published, inProgress, started };
}
export function removeArticle(id) {
  const projects = getAllProjects();
  if (!projects.length) return;
  
  const currentRow = localStorage.getItem('project');

  const currentProjectIndex = projects.findIndex(el => el.id === +currentRow);
  if (currentProjectIndex === -1) return;

  const index = projects[currentProjectIndex].articles.findIndex(el => el.id === +id);
  if(index === -1) return;

  projects[currentProjectIndex].articles.splice(index, 1);
  
  localStorage.setItem('db_projects', JSON.stringify(projects));
  
  renderArticles(projects[currentProjectIndex].id);

  const { articles } = getAllArticlesQuantity();
  
  updateStatistic(projects, articles);
  updateDoughnut();
  updateLinear();
}
export function addNewArticle() {
  switchButtonsVisibility('add-article', 'save-article', 'save-edited-article', 'add')
  
  const addArticle = document.getElementById('add-article');
  const saveArticle = document.getElementById('save-article');
  const dialogTitle = document.getElementById('modalArticleLabel');
  
  dialogTitle.innerText = 'Add new article';
  articleTitle.value = '';
  articleDescription.value = '';
  statusElement.value = '';

  saveArticle.addEventListener('click', addArticleHandler);
  updateDoughnut();
  updateLinear();
  
  addArticle.removeEventListener('click', addNewArticle);
}
function addArticleHandler() {
  const saveArticle = document.getElementById('save-article')
  const title = articleTitle.value;
  const desc = articleDescription.value;
  const status = statusElement.value;
  
  if (status < 1 || status > 100) {
    errorMessage.innerText = 'Incorrect status';
    return;
  }

  if(!checkEmptyFields(errorMessage, title, desc)) {
    return;
  }

  const projects = getAllProjects();
  if (!projects.length) return;

  const articlesList = projects[checkedProjectIndex].articles;
  let currentId;

  if (!articlesList.length) {
    projects[checkedProjectIndex].articles.push({
      id: 1,
      title,
      description: desc,
      status,
      parentProject: checkedProject.id
    })
  } else {
    const sortedArticles = articlesList.sort((a,b) => a.id - b.id);
    currentId = sortedArticles.at(-1).id;

    projects[checkedProjectIndex].articles.push({
      id: ++currentId,
      title,
      description: desc,
      status,
      parentProject: checkedProject.id
    })
  }

  localStorage.setItem('db_projects', JSON.stringify(projects));
  renderArticles(projects[checkedProjectIndex].id);
  
  const { articles } = getAllArticlesQuantity();
  updateStatistic(projects, articles);
  
  renderProjectsData();
  updateDoughnut();
  updateLinear();

  closeModal('modalAddArticle');
  
  saveArticle.removeEventListener('click', addArticleHandler);
}

export function finishArticle(article) {
  const finishButton = document.getElementById('finish-article');
  
  finishButton.addEventListener('click', (e) => {
    const projects = getAllProjects();
    
    const projectIndex = projects.findIndex(el => el.id === article.parentProject);
    if (projectIndex === -1) return;

    const articleIndex = projects[projectIndex].articles.findIndex(el => el.id === article.id);
    if (articleIndex === -1) return;
    
    projects[projectIndex].articles[articleIndex].status = '100';
    
    localStorage.setItem('db_projects', JSON.stringify(projects));
    
    renderArticles(article.parentProject);
    closeModal('articleBody');

    updateDoughnut();
    updateLinear();
  })
}

export function editArticle(id) {
  openModal('modalAddArticle');
  
  const saveEditedArticle = document.getElementById('save-edited-article');
  const dialogTitle = document.getElementById('modalArticleLabel');

  switchButtonsVisibility('add-article', 'save-article', 'save-edited-article', 'edit');
  
  const projects = getAllProjects();
  const currentRow = localStorage.getItem('project');
  const currentProjectIndex = projects.findIndex(el => el.id === +currentRow);
  
  const articles = projects[currentProjectIndex].articles;
  const currentArticleIndex = articles.findIndex(el => el.id === +id);
  
  const currentArticle = articles.find(el => el.id === +id);
  dialogTitle.innerText = 'Edit article';
  
  statusElement.value = currentArticle.status;
  articleTitle.value = currentArticle.title;
  articleDescription.value = currentArticle.description;

  saveEditedArticle.addEventListener('click', () => {
    if (statusElement.value < 1 || statusElement.value > 100) {
      errorMessage.innerText = 'Incorrect status';
      return;
    }
    
    if (!checkEmptyFields(errorMessage, statusElement.value, articleTitle.value, articleTitle.value)) {
      return;
    }
    
    errorMessage.innerText = '';
    
    const updatedArticle = {
      ...currentArticle,
      status: statusElement.value,
      title: articleTitle.value,
      description: articleDescription.value
    }

    projects[currentProjectIndex].articles[currentArticleIndex] = updatedArticle;

    localStorage.setItem('db_projects', JSON.stringify(projects));
    
    closeModal('modalAddArticle');
    renderArticles(projects[currentProjectIndex].id);
    
    updateDoughnut();
    updateLinear();
  })
}

function setProgressBackground(status) {
  const progressBarEl = document.getElementById('article-progress-bar');
  
  switch (true) {
    case (status >= 50 && status < 100):
      progressBarEl.classList.remove(`bg-danger`);
      progressBarEl.classList.remove(`bg-success`);
      progressBarEl.classList.add(`bg-warning`);
      break
    case (status > 0 && status < 50):
      progressBarEl.classList.remove(`bg-warning`);
      progressBarEl.classList.remove(`bg-success`);
      progressBarEl.classList.add(`bg-danger`);
      break
    default:
      progressBarEl.classList.remove(`bg-danger`);
      progressBarEl.classList.remove(`bg-warning`);
      progressBarEl.classList.add(`bg-success`);
  }
}


