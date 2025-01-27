import * as bootstrap from 'bootstrap';
const titleElement = document.getElementById('project-name');
const descriptionElement = document.getElementById('project-description');
const authorElement = document.getElementById('project-author');
const modalTitle = document.getElementById('modal-title');
const dialogElement = document.getElementById('modalProject');
const addArticle = document.getElementById('add-article');

if (document.location.href.includes('main.html')) {
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

  
}

export function closeModal(name) {
  const dialogElement = document.getElementById(name);
  const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
  modal.hide();
}

export function openModal(name) {
  const dialogElement = document.getElementById(name);
  const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
  modal.show();
}


