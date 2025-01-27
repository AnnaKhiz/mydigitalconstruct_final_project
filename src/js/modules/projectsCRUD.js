import { openModal, closeModal } from "./modal";
import { checkEmptyFields, updateStatistic, switchButtonsVisibility } from "./main";
import { renderArticles, getAllArticlesQuantity, addNewArticle } from "./articlesCRUD";
import { updateDoughnut, updateLinear } from "./chart";

const authorElement = document.getElementById('project-author');
const descriptionElement = document.getElementById('project-description');
const titleElement = document.getElementById('project-name');
const modalTitle = document.getElementById('modal-title');
const projectsList = document.getElementById('projects-list');
const noProjectsNotify = document.getElementById('no-projects-notify');
const tableElement = document.getElementById('projects-table');
const errorMessage = document.getElementById('modal-error');

export let checkedProject;
export let checkedProjectIndex;

export function addNewProject() {
  switchButtonsVisibility('add-article', 'save-project', 'save-changes', 'add');

  errorMessage.innerText = '';
  const saveProjectButton = document.getElementById('save-project');
  
  saveProjectButton.addEventListener('click', () => {
    
    const title = titleElement.value;
    const description = descriptionElement.value;
    const author = authorElement.value;

    if(!checkEmptyFields(errorMessage, title, description, author)) return;

    const projects = getAllProjects();

    let currentId;
    
    if (!projects.length) {
      projects.push({ id: 1, title, description, author, articles: [] });
    } else {
      const idArray = projects.map(project => project.id);
      currentId = Math.max(...idArray)
      projects.push({ id: ++currentId, title, description, author, articles: []  });
    }

    renderProjectsData(projects);
    
    updateDoughnut();
    updateLinear();

    titleElement.value = '';
    descriptionElement.value = '';
    closeModal('modalProject');
  })
}
export function renderProjectsData( items = [], filter = false) {
  let projects;
 
  if (!items.length && !filter) {
    projects = getAllProjects();
  } else {
    projects = items;
  }
  
  if (!projects.length) {
    tableElement.classList.add('hidden');
    noProjectsNotify.innerText = 'No projects yet';
    return;
  }
  
  tableElement.classList.remove('hidden');
  noProjectsNotify.innerText = '';
  projectsList.innerHTML = '';
  
  const { articles } = getAllArticlesQuantity();
  updateStatistic(projects, articles)
  updateDoughnut();
  updateLinear();
  
  projectsList.insertAdjacentHTML('beforeend', `
    ${projects.map(project =>
    `<tr class="table-row" data-tablerow="${project.id}" >
        <th scope="row">${project.id}</th>
        <td class="text-truncate">${project.title}</td>
        <td class="text-truncate" style="max-width: 150px;">${project.description}</td>
        <td class="text-truncate">${project.author}</td>
        <td class="text-end">
          <div class="d-flex align-items-center justify-content-end gap-2" >
            <button type="button" class="btn btn-sm actions " >
                <img src="./assets/img/icons/edit.png" data-edit="${project.id}" alt="edit icon">
            </button>
            <button type="button" class="btn btn-sm actions"  >
                <img src="./assets/img/icons/delete.png" data-delete="${project.id}" alt="delete icon">
            </button>
          </div>
        </td>
      </tr>
      `).join('')}
   `)

  if (filter) {
    return
  }
  
  localStorage.setItem('db_projects', JSON.stringify(projects));
  
}
export function getAllProjects() {
  return localStorage.getItem('db_projects') ? JSON.parse(localStorage.getItem('db_projects')) : [];
}

export function removeProject(projectId) {
    const projects = getAllProjects();
    if (!projects.length) return;
    
    const index = projects.findIndex(project => +project.id === +projectId);
    if (index === -1) return;
    
    projects.splice(index, 1);
    
    console.log(projects)
  
    if(!projects.length) {
      localStorage.removeItem('db_projects');
      renderProjectsData();
      return;
    }
    renderProjectsData(projects);

    const { articles, published, inProgress, started } = getAllArticlesQuantity();
    updateLinear();
    updateDoughnut();

    updateStatistic(projects, articles);
}

export function editProject(id) {
  const addArticleButton = document.getElementById('add-article');
  errorMessage.innerText = '';
  const projectId = +id;
  const projects = getAllProjects();
  if (!projects.length) return;
  
  checkedProjectIndex = projects.findIndex(project => +project.id === projectId);
  if (checkedProjectIndex === -1) return;

  checkedProject = projects[checkedProjectIndex];
  
  titleElement.value = checkedProject.title;
  descriptionElement.value = checkedProject.description;
  authorElement.value = checkedProject.author;

  openModal('modalProject');
  switchButtonsVisibility('add-article', 'save-project', 'save-changes', 'edit');
  
  modalTitle.innerText = 'Edit project';
  addArticleButton.disabled = false;
  
  const saveChangesButton = document.getElementById('save-changes');
  
  saveChangesButton.addEventListener('click', () => {
    
    if (!checkEmptyFields(errorMessage, titleElement.value, descriptionElement.value, authorElement.value)) return;

    projects[checkedProjectIndex] = {
      ...checkedProject,
      title: titleElement.value,
      description: descriptionElement.value,
      author: authorElement.value,
      articles: checkedProject.articles
    }
    
    renderProjectsData(projects);
   
    const { articles, published, inProgress, started } = getAllArticlesQuantity();
    updateDoughnut();
    updateLinear();

    updateStatistic(projects, articles);
    closeModal('modalProject');
  })

  addArticleButton.addEventListener('click', addNewArticle);
}

export function filterProjects() {
  const titleElement = document.getElementById('filter-project-title');
  const authorElement = document.getElementById('filter-project-author');
  const articlesElement = document.getElementById('filter-articles');
  const filterButton = document.getElementById('filter-button');
  
  filterButton.addEventListener('click', (event) => {
    const title = titleElement.value?.trim() || '';
    const author = authorElement.value?.trim() || '';
    const isHasArticles = articlesElement.checked;
    
    switch(true) {
      case title && author && isHasArticles:
        filterProjectsBy(['author', 'title', 'articles'], [author, title, isHasArticles]);
        break;
      case title && isHasArticles:
        filterProjectsBy(['title', 'articles'], [title, isHasArticles]);
        break;
      case author && isHasArticles:
        filterProjectsBy(['author', 'articles'], [author, isHasArticles]);
        break;
      case !!title && !!author:
        filterProjectsBy(['author', 'title'], [author, title]);
        break;
      case !!title:
        filterProjectsBy(['title'], [title]);
        break;
      case !!author:
        filterProjectsBy(['author'], [author]);
        break;
      case isHasArticles:
        filterProjectsBy(['articles'], [isHasArticles]);
        break;
      default:
        filterProjectsBy([], []);
    }
  })

  titleElement.value = '';
  authorElement.value = '';
  articlesElement.checked = false;
}

function filterProjectsBy(fields, value) {
  if (!fields.length && !value.length) {
    document.getElementById('modal-filter-error').innerText = 'No filter conditions!';
    return;
  }
  
  const projects = getAllProjects();
  const fieldsQuantity = fields.length;
  let filtered = [];
  
  projects.forEach(project => {
    
    for (let i = 0; i < fieldsQuantity; i++) {
      const field = fields[i]
      if (field === 'articles' && project[field].length !== 0) {
        filtered.push(project)
      }
      
      if (project[field].includes(value[i]) && !filtered.find(el => +el.id === +project.id)) {
        filtered.push(project)
      }
    }
  });
  
  if (!filtered.length) {
    renderProjectsData([], true);
    closeModal('filterModal');
  }
  
  renderProjectsData(filtered, true);
  closeModal('filterModal');
}
