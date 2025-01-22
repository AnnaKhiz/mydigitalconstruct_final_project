import Chart from 'chart.js/auto';
import { getAllProjects } from "./projectsCRUD";
import { getAllArticlesQuantity } from "./articlesCRUD";

let chartLinear;
let chartDoughnut;
function createLinear(projects, articles) {
  if (chartLinear) {
    chartLinear.data.labels = projects;
    chartLinear.data.datasets[0].data = articles;
    chartLinear.update();
    return chartLinear
  }

  const canvas = document.getElementById('my-chart-linear');
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(15,18,59,0.5)');
  gradient.addColorStop(1, 'rgba(0,117,255,0.74)');
  
  chartLinear = new Chart(ctx, {
    type: 'line',
    data: {
      labels: projects,
      datasets: [{
        label: 'Projects & Articles statistics',
        data: articles,
        fill: true,
        borderColor: '#0075FF',
        backgroundColor: gradient,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          max: 50,
          min: 0,
          grid: {
            color: '#1A1F37'
          },
          ticks: {
            stepSize: 10,
            color: '#c7c7c7'
          },
          border: {
            color: '#c7c7c7'
          },
        },
        x: {
          border: {
            color: '#c7c7c7'
          },
          grid: {
            color: '#1A1F37'
          },
          ticks: {
            color: '#c7c7c7'
          },
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#c7c7c7'
          },
        }
      }
    }
  });
  
  return chartLinear;
}
function createDoughnutChart(data) {
  if (chartDoughnut) {
    chartDoughnut.data.datasets[0].data = data;
    chartDoughnut.update();
    return chartDoughnut
  }

  const canvasDoughnut = document.getElementById('my-chart-doughnut');

  if (!canvasDoughnut) {
    return;
  }
  const ctxD = canvasDoughnut.getContext('2d');
  
  chartDoughnut = new Chart(ctxD, {
    type: 'doughnut',
    data: {
      labels: [
        'Published',
        'In progress',
        'Started'
      ],
      datasets: [{
        label: 'Articles',
        data: data,
        backgroundColor: [
          'rgba(25,135,84,0.93)',
          'rgb(255, 205, 86)',
          'rgba(220,53,69,0.94)'
        ],
        hoverOffset: 4
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
    },
  })
  
  return chartDoughnut;
}
export function updateLinear() {
  const projects = getAllProjects();

  const projectTitles = projects.map(project => {
    const articles = project.articles.length ? project.articles : []
    return {
      key: project.title,
      value: articles.length
    }
  })

  const projectsArgs = projectTitles.map(el => el.key);
  const articlesArgs = projectTitles.map(el => el.value);
  
  createLinear(projectsArgs, articlesArgs);
}
export function updateDoughnut() {
  const { published, inProgress, started } = getAllArticlesQuantity();
  
  createDoughnutChart([published, inProgress, started]);
}