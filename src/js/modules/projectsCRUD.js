const projectsList = document.getElementById('projects-list');
const noProjectsNotify = document.getElementById('no-projects-notify');
const tableElement = document.getElementById('projects-table');
export function renderProjectsData() {
  const projects = getAllProjects();

  if (!projects.length) {
    tableElement.classList.add('hidden');
    noProjectsNotify.innerText = 'No projects yet';
    return
  }
  tableElement.classList.remove('hidden');
  noProjectsNotify.innerText = '';
  projectsList.innerHTML = ''

  projectsList.insertAdjacentHTML('beforeend', `
    ${projects.map(project =>
    `<tr>
        <th scope="row">${project.id}</th>
        <td class="text-truncate">${project.title}</td>
        <td class="text-truncate" style="max-width: 150px;">${project.description}</td>
        <td class="text-truncate">${project.author}</td>
        <td>
          <div class="progress" role="progressbar" aria-valuenow="${project.status}" aria-valuemin="0" aria-valuemax="100">
            <div 
            class="progress-bar bg-${project.status == 100 ? 'success' : (project.status <= 20 ? 'danger' : 'warning')} text-bg-warning" 
            style="width: ${project.status}%"
           >${project.status}%</div>
          </div>
        </td>
        <td class="text-end">
          <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button type="button" class="btn btn-sm btn-primary " data-done="${project.id}">Done</button>
            <button type="button" class="btn btn-sm btn-warning " data-edit="${project.id}">Edit</button>
            <button type="button" class="btn btn-sm btn-danger" data-delete="${project.id}" >Delete</button>
          </div>
        </td>
      </tr>
      `).join('')}
   `)
}

export function getAllProjects() {
  return localStorage.getItem('db_projects') ? JSON.parse(localStorage.getItem('db_projects')) : [];
}

export function removeProject() {
  projectsList.addEventListener('click', (event) => {
    event.preventDefault();
    
    const projectId = +event.target.dataset.delete;
    console.log('projectId', projectId)
    const projects = getAllProjects();
    
    if (!projects.length) return;
    
    console.log(projects)
    const index = projects.findIndex(project => +project.id === projectId);
    console.log(index)
    
    if (index === -1) return;

    projects.splice(index, 1)

    localStorage.setItem('db_projects', JSON.stringify(projects));
    
    renderProjectsData()
    
  })
}