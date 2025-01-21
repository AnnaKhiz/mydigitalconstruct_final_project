import * as bootstrap from 'bootstrap';
export const titleElement = document.getElementById('project-name');
export const descriptionElement = document.getElementById('project-description');
export const authorElement = document.getElementById('project-author');

export const errorMessage = document.getElementById('modal-error');
export const modalTitle = document.getElementById('modal-title');
const dialogElement = document.getElementById('modalProject');

export const addArticle = document.getElementById('add-article');
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

export function closeModal(name) {
  const dialogElement = document.getElementById(name);
  const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
  modal.hide();
}

export function openModal(name) {
  const dialogElement = document.getElementById(name);
  console.log(dialogElement)
  const modal = bootstrap.Modal.getOrCreateInstance(dialogElement);
  modal.show();
}

