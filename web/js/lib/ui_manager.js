class UIManager {
  constructor(game) {
    this.game = game;
    this.sketch = game.sketch;
    this.params = this.game.paramsInjector.params.uiParams;

    this.episodeStatsTable = document.getElementById('episodeStats');
    this.graphsRef = document.getElementById('graphs');
    this.currentEpisodePopulationChart = null;
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.restartBtn = document.getElementById("restartBtn");
    this.updateParamsBtn = document.getElementById("updateParamsBtn");

    this.initEpisodeCharts();
    this.createParamInputs();
    this.setButtonFunctions();

  }

  setupSketch() {
    this.sketch.frameRate(this.params.fps);

    let canvas = this.sketch.createCanvas(this.params.side, this.params.side);
    canvas.parent('sketch-holder');

  }

  setButtonFunctions() {
    this.startBtn.onclick = () => {
      this.game.running = true;
    };

    this.pauseBtn.onclick = () => {
      this.game.running = false;
    };

    this.restartBtn.onclick = () => {
      this.game.setup(this.sketch);
      this.game.running = true
    };
  }

  createParamInputs() {
    let allParamsTable = document.getElementById('hyper-parameters');

    this.game.paramsInjector.descriptions.forEach((param) => {

      let paramLabel = document.createElement('label');
      paramLabel.setAttribute('for', `${param.name}Input`);
      paramLabel.innerHTML = param.name;

      this.addRow(
        allParamsTable,
        paramLabel.innerHTML,
        `<input id="${param.name}" type="number" value="${this.game.paramsInjector.params.swarmParams[param.name]}">`,
        param.desc
      );

    });

  }

  registerSliders() {
    this.contagionInput = document.getElementById("contagionInput");
    this.recoveryInput = document.getElementById("recoveryInput");
    this.deathInput = document.getElementById("deathInput");
    this.recoveryLossInput = document.getElementById("recoveryLossInput");

    let self = this;
    let params = this.game.paramsInjector;

    // TODO: Update slider to the values in params.

    this.contagionInput.onchange = function () {
      params.params.swarmParams.contagionRate = self.contagionInput.value;
      params.updateAll();
    };

    this.recoveryInput.onchange = function () {
      params.params.swarmParams.recoveryRate = self.recoveryInput.value;
      params.updateAll();
    };

    this.deathInput.onchange = function () {
      params.params.swarmParams.deathRate = self.deathInput.value;
      params.updateAll();
    };

    this.recoveryLossInput.onchange = function () {
      params.params.swarmParams.recoveryLossRate = self.recoveryLossInput.value;
      params.updateAll();
    };
  }

  updateTimeStepInfo() {

    let populations = this.game.stats.currentPopulation;
    let episodeNumber = this.game.episodeManager.episode;

    // TODO: Put these population numbers into a graph.
    $("#message_p").html(`Episode: ${episodeNumber}\nHealthy: ${populations.healthy}, dis: ${populations.diseased}, dead: ${populations.dead}, recovered: ${populations.recovered}`);

    if (this.game.episodeManager.timeStep % 10 === 0) {
      this.currentEpisodePopulationChart.data.datasets[0].data.push(populations.healthy);
      this.currentEpisodePopulationChart.data.datasets[1].data.push(populations.diseased);
      this.currentEpisodePopulationChart.data.datasets[2].data.push(populations.recovered);
      this.currentEpisodePopulationChart.data.datasets[3].data.push(populations.dead);
      this.currentEpisodePopulationChart.data.labels.push(this.game.episodeManager.timeStep);

      this.currentEpisodePopulationChart.update(this.game.episodeManager.timeStep);
    }

  }

  updateEpisodeInfo() {
    let populations = this.game.stats.currentPopulation;
    let numAgents = this.game.swarmManager.numAgents;
    if (this.game.episodeManager.episode === 1) return;
    this.addRow(this.episodeStatsTable,
      this.game.episodeManager.episode - 1,
      (this.game.stats.totalDiseased / numAgents).toFixed(2),
      (populations.diseased / numAgents).toFixed(2),
      (populations.recovered / numAgents).toFixed(2),
      (populations.healthy / numAgents).toFixed(2),
      ((populations.healthy + populations.recovered) / numAgents).toFixed(2),
      this.game.stats.meanScore.toFixed(4),
    );
    this.initEpisodeCharts();
  }

  initEpisodeCharts() {
    let populationChart = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'healthy',
          data: [],
          backgroundColor: 'transparent',
          borderColor: 'blue',
          borderWidth: 1,
          pointRadius: 0,
        }, {
          label: 'diseased',
          data: [],
          backgroundColor: 'transparent',
          borderColor: 'red',
          borderWidth: 1,
          pointRadius: 0,
        }, {
          label: 'recovered',
          data: [],
          backgroundColor: 'transparent',
          borderColor: 'green',
          borderWidth: 1,
          pointRadius: 0,
        }, {
          label: 'dead',
          data: [],
          backgroundColor: 'transparent',
          borderColor: 'gray',
          borderWidth: 1,
          pointRadius: 0,
        }]
      },
      options: {
        title: {
          display: true,
          text: `Episode: ${this.game.episodeManager.episode} | Population`
        },
        elements: {
          line: {
            tension: 0
          }
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Population'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'TimeSteps'
            }
          }],
        },
      }
    };
    this.currentEpisodePopulationChart = this.addChartToPage(populationChart);

    let heatmapConfig = {
      title: `Episode: ${this.game.episodeManager.episode} | Mean Genes`,
      data: this.game.stats.currentEpochAvgGenes,
    };
    this.createHeatmap(heatmapConfig);
  }

  addRow(tableReference, ...values) {
    let row = tableReference.insertRow();
    for (let i = 0; i < values.length; i++) {
      row.insertCell(i).innerHTML = values[i];
    }
  }

  createHeatmap(heatmapConfig) {
    /*
    heatmapConfig = {
      title: "Title",
      data: [[0,0,1], [0, 1, 12], .. ]
    }
     */
    let chartDiv = document.createElement('div');
    chartDiv.className = 'col-auto';
    chartDiv.style.width = '600px';
    chartDiv.style.height = '400px';

    let figure = document.createElement('figure');
    figure.className = "highcharts-figure";

    let mapContainer = document.createElement("div");

    figure.appendChild(mapContainer);
    chartDiv.appendChild(figure);
    this.graphsRef.prepend(chartDiv);

    Highcharts.chart(mapContainer, {

      chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
      },

      title: {
        text: heatmapConfig.title,
      },

      xAxis: {
        categories: ['healthy', 'diseased', 'recovered']
      },

      yAxis: {
        categories: ['healthy', 'diseased', 'recovered'],
        title: null,
        reversed: true
      },

      accessibility: {
        point: {
          descriptionFormatter: function (point) {
            var ix = point.index + 1,
              xName = getPointCategoryName(point, 'x'),
              yName = getPointCategoryName(point, 'y'),
              val = point.value;
            return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
          }
        }
      },

      /*colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
      },*/

      colorAxis: {
        stops: [
          [0, '#c4463a'],
          [0.5, '#ffffff'],
          [1, '#3060cf']
        ],
        min: -0.2,
        max: 0.2,
        startOnTick: false,
        endOnTick: false,
        labels: {
          format: '{value}℃'
        }
      },

      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
      },

      tooltip: {
        formatter: function () {
          return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
            this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
        }
      },

      series: [{
        name: 'Genes',
        borderWidth: 1,
        data: heatmapConfig.data,
        dataLabels: {
          enabled: true,
          color: '#000000'
        }
      }],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            yAxis: {
              labels: {
                formatter: function () {
                  return this.value.charAt(0);
                }
              }
            }
          }
        }]
      }

    });

    return mapContainer;

  }

  addChartToPage(chartConfig) {
    let chartDiv = document.createElement('div');
    chartDiv.className = 'col-auto';
    chartDiv.style.width = '600px';
    chartDiv.style.height = '400px';
    let chartCanvas = document.createElement('canvas');

    let timeStepChart = new Chart(chartCanvas, chartConfig);

    chartDiv.appendChild(chartCanvas);
    this.graphsRef.prepend(chartDiv);

    return timeStepChart;
  }

}


function getPointCategoryName(point, dimension) {
  let series = point.series,
    isY = dimension === 'y',
    axis = series[isY ? 'yAxis' : 'xAxis'];
  return axis.categories[point[isY ? 'y' : 'x']];
}
