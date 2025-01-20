import Chart from 'chart.js/auto';

const canvas = document.getElementById('my-chart-linear');
const canvasDoughnut = document.getElementById('my-chart-doughnut');
const ctx = canvas.getContext('2d');
const ctxD = canvasDoughnut.getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(15,18,59,0.5)');
gradient.addColorStop(1, 'rgba(0,117,255,0.74)');

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// const data = {
//   labels: labels,
//   datasets: [{
//     label: 'Projects & Articles statistics',
//     data: [65, 59, 80, 81, 56, 55, 40, 5, 10, 25, 15, 80],
//     fill: true,
//     borderColor: '#0075FF',
//     backgroundColor: gradient,
//     tension: 0.1
//   }]
// };

export function createLinear(projects, articles) {
  return new Chart(ctx, {
    type: 'line',
    data:
      {
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
          max: 100,
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
}



export function createDoughnutChart(data) {
  return new Chart(ctxD, {
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
}