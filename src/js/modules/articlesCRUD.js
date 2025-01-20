import {getAllProjects, renderProjectsData, checkedProjectIndex, checkedProject } from "./projectsCRUD";
import {addArticle, checkEmptyFields, closeModal, openModal} from "./modal";



const noArticlesNotify = document.getElementById('no-articles-notify');
const articlesListContainer = document.getElementById('articles-list-container');
const articlesContainer = document.getElementById('articles-container');
const articlesList = document.getElementById('articles-list');
const projectsQuantity = document.getElementById('projects-quantity');
const articlesQuantity = document.getElementById('articles-quantity');
const totalQuantity = document.getElementById('total-quantity');
export function openArticle(id) {
  const projects = getAllProjects();

  if (!projects.length) return;
  const currentRow = localStorage.getItem('project')

  const currentProject = projects.find(el => el.id === +currentRow);
  console.log(currentProject)

  if (!currentProject) return;

  const selectedArticle = currentProject.articles.find(el => el.id === +id);

  console.log(selectedArticle)

  document.getElementById('open-header').innerText = selectedArticle.title;
  document.getElementById('open-description').innerText = selectedArticle.description;

  openModal('articleBody')
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

  articlesList.insertAdjacentHTML('beforeend', `
    ${projectsArticles.map(article => `
        <div class="card card-item">
          <img src="./assets/img/card.jpg" class="card-img-top" alt="image">
          <div class="card-body">
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
  const articleTitle = document.getElementById('article-title');
  const articleDescription = document.getElementById('article-desc');
  const saveArticle = document.getElementById('save-article');

  articleTitle.value = '';
  articleDescription.value = '';

  saveArticle.addEventListener('click', addArticleHandler);
  
  addArticle.removeEventListener('click', addNewArticle);
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
    return;
  }

  const projects = getAllProjects();
  if (!projects.length) return;

  const articles = projects[checkedProjectIndex].articles;
  let currentId;

  if (!articles.length) {
    projects[checkedProjectIndex].articles.push({
      id: 1,
      title: title,
      description: desc,
      parentProject: checkedProject.id
    })
  } else {
    const sortedArticles = articles.sort((a,b) => a.id - b.id);
    currentId = sortedArticles.at(-1).id;

    projects[checkedProjectIndex].articles.push({
      id: ++currentId,
      title: title,
      description: desc,
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