import { getAllProjects, renderProjectsData, checkedProjectIndex, checkedProject } from "./projectsCRUD";
import {
  addArticle,
  authorElement,
  checkEmptyFields,
  closeModal,
  descriptionElement,
  openModal,
  titleElement
} from "./modal";



const noArticlesNotify = document.getElementById('no-articles-notify');
const articlesListContainer = document.getElementById('articles-list-container');
const articlesContainer = document.getElementById('articles-container');
const articlesList = document.getElementById('articles-list');
const projectsQuantity = document.getElementById('projects-quantity');
const articlesQuantity = document.getElementById('articles-quantity');
const totalQuantity = document.getElementById('total-quantity');
const statusElement = document.getElementById('exampleFormControlInput3');
export function openArticle(id) {
  const projects = getAllProjects();

  if (!projects.length) return;
  const currentRow = localStorage.getItem('project')

  const currentProject = projects.find(el => el.id === +currentRow);

  if (!currentProject) return;

  const selectedArticle = currentProject.articles.find(el => el.id === +id);
  setProgressBackground(selectedArticle.status)
  
  const progressBarEl = document.getElementById('article-progress-bar')
 
  progressBarEl.parentElement.setAttribute('aria-valuenow', selectedArticle.status)
  progressBarEl.style.width = `${selectedArticle.status}%`;
  
  console.dir(progressBarEl.children[0])
  progressBarEl.innerText = `${selectedArticle.status}%`;
 
  document.getElementById('open-header').innerText = selectedArticle.title;
  document.getElementById('open-description').innerText = selectedArticle.description;

  openModal('articleBody');
  finishArticle(selectedArticle)
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

  projectsArticles.sort((a,b) => a.status - b.status)
  
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
            class="progress-bar bg-${+article.status === 100 ? 'success' : (+article.status <= 20 ? 'danger' : 'warning')} text-bg-warning" 
            style="width: ${article.status}%"
           >${article.status}%</div>
          </div>
        
            <h5 class="card-title fs-5 text-truncate">${article.title}</h5>
            <p class="card-text text-truncate mb-4 fs-6" >${article.description}</p>
            <div class="d-flex align-items-center justify-content-between">
              <a href="#" class="d-block btn btn-primary btn-sm" data-openart="${article.id}">Open</a>
              <a href="#" class="d-block btn btn-warning btn-sm" data-editart="${article.id}">Edit</a>
              <a href="#" class="d-block btn btn-danger btn-sm" data-delart="${article.id}">Delete</a>
            </div>
          </div>
        </div>
    `).join('')}
  `)
}

export function getAllArticlesQuantity() {

  const projects = getAllProjects();
  let articles = 0;
  projects.forEach(project => {
    articles += project.articles.length ? project.articles.length : 0
  })
  
  return articles;
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
  
  renderArticles(projects[currentProjectIndex].id)

  const articles = getAllArticlesQuantity();
  articlesQuantity.innerText = articles;

  totalQuantity.innerText = projects.length + articles;
  
}

export function addNewArticle() {
  const saveArticle = document.getElementById('save-article');
  saveArticle.classList.remove('hidden');
  document.getElementById('save-edited-article').classList.add('hidden');
  const dialogTitle = document.getElementById('exampleModaArticleLabel');
  const articleTitle = document.getElementById('article-title');
  const articleDescription = document.getElementById('article-desc');
  // const saveArticle = document.getElementById('save-article');

  dialogTitle.innerText = 'Add new article';
  articleTitle.value = '';
  articleDescription.value = '';
  statusElement.value = '';

  saveArticle.addEventListener('click', addArticleHandler);
  
  addArticle.removeEventListener('click', addNewArticle);
}

function addArticleHandler() {
  const articleTitle = document.getElementById('article-title');
  const articleDescription = document.getElementById('article-desc');
  const saveArticle = document.getElementById('save-article')
  const title = articleTitle.value;
  const desc = articleDescription.value;
  const status = statusElement.value;
  
  if (status < 1 || status > 100) {
    document.getElementById('modal-article-error').innerText = 'Incorrect status';
    return;
  }

  if(!checkEmptyFields(title, desc)) {
    document.getElementById('modal-article-error').innerText = 'Empty fields';
    return;
  }

  const projects = getAllProjects();
  if (!projects.length) return;

  const articles = projects[checkedProjectIndex].articles;
  let currentId;

  if (!articles.length) {
    projects[checkedProjectIndex].articles.push({
      id: 1,
      title,
      description: desc,
      status,
      parentProject: checkedProject.id
    })
  } else {
    const sortedArticles = articles.sort((a,b) => a.id - b.id);
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

  document.getElementById('projects-quantity').innerText = `${projects.length}`;
  
  const articlesNumber = getAllArticlesQuantity();
  document.getElementById('articles-quantity').innerText = articlesNumber;

  document.getElementById('total-quantity').innerText = `${projects.length + articlesNumber}`;
  renderProjectsData();

  closeModal('exampleModalArticle');
  
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
    renderArticles(article.parentProject)
    closeModal('articleBody')
    
  })
}

export function editArticle(id) {
  openModal('exampleModalArticle');
  const saveEditedArticle = document.getElementById('save-edited-article');
  saveEditedArticle.classList.remove('hidden');
  document.getElementById('save-article').classList.add('hidden');
  const dialogTitle = document.getElementById('exampleModaArticleLabel');
  const articleStatus = document.getElementById('exampleFormControlInput3');
  const articleTitle = document.getElementById('article-title');
  const articleDescription = document.getElementById('article-desc');
  
  const projects = getAllProjects();
  const currentRow = localStorage.getItem('project');
  // const currentProject = projects.find(el => el.id === +currentRow);

  const currentProjectIndex = projects.findIndex(el => el.id === +currentRow);
  
  const articles = projects[currentProjectIndex].articles
  const currentArticleIndex = articles.findIndex(el => el.id === +id)
  
  const currentArticle = articles.find(el => el.id === +id)
  
  console.log(currentArticle)

  dialogTitle.innerText = 'Edit article';
  
  const addArticleButton = document.getElementById('add-article');
  if (!addArticleButton.classList.contains('hidden')) {
    addArticleButton.classList.add('hidden')
  }
  
  articleStatus.value = currentArticle.status;
  articleTitle.value = currentArticle.title;
  articleDescription.value = currentArticle.description;

  saveEditedArticle.addEventListener('click', () => {
    
    if (articleStatus.value < 1 || articleStatus.value > 100) {
      document.getElementById('modal-article-error').innerText = 'Incorrect status';
      return;
    }
    if (!checkEmptyFields(articleStatus.value, articleTitle.value, articleTitle.value)) {
      document.getElementById('modal-article-error').innerText = 'Empty fields'
      return;
    }
    document.getElementById('modal-article-error').innerText = ''
    
    const updatedArticle = {
      ...currentArticle,
      status: articleStatus.value,
      title: articleTitle.value,
      description: articleDescription.value
    }

    projects[currentProjectIndex].articles[currentArticleIndex] = updatedArticle;

    localStorage.setItem('db_projects', JSON.stringify(projects));
    
    closeModal('exampleModalArticle')
    renderArticles(projects[currentProjectIndex].id)
    
    console.log(updatedArticle)
    
    
  })
  
}

// TECHNICAL

function setProgressBackground(status) {
  const progressBarEl = document.getElementById('article-progress-bar')
  let color = '';
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
  return color;
}

