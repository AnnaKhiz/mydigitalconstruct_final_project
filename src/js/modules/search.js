import { getAllProjects, renderProjectsData } from "./projectsCRUD";

export function searchData(value) {
  const projects = getAllProjects();
  const searchedProjects = projects.filter(project => project.title.includes(value));
  renderProjectsData(searchedProjects, true);
}