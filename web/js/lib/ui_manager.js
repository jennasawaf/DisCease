class UIManager {
  constructor(game) {
    this.game = game;
    this.params = this.game.paramsInjector.params.uiParams;

    this.sketch = null;

    this.registerSliders();
    this.episodeStatsTable = document.getElementById('episodeStats');

  }

  setupSketch() {
    this.sketch.frameRate(this.params.fps);

    let canvas = this.sketch.createCanvas(this.params.side, this.params.side);
    canvas.parent('sketch-holder');

  }

  registerSliders() {
    this.contagionSlider = document.getElementById("contagionSlider");
    this.recoverySlider = document.getElementById("recoverySlider");
    this.deathSlider = document.getElementById("deathSlider");

    let self = this;
    let params = this.game.paramsInjector;

    // TODO: Update slider to the values in params.

    this.contagionSlider.onchange = function() {
      params.params.swarmParams.contagionRate = self.contagionSlider.value;
      params.updateAll();
    };

    this.recoverySlider.onchange = function() {
      params.params.swarmParams.immunizationRate = self.recoverySlider.value;
      params.updateAll();
    };

    this.deathSlider.onchange = function() {
      params.params.swarmParams.deathRate = self.deathSlider.value;
      params.updateAll();
    };
  }

  updateStatsTable() {
    let episodeNumber = this.game.episodeManager.episode;
    let totalDiseased = this.game.swarmManager.getgetTotalDiseased;
    let totalImmunized = this.game.swarmManager.getTotalImmunized;
    let totalHealthy = this.game.swarmManager,getTotalHealthy;
    //let totalSurvived=

    // this.addRow(episodeNumber, totalDiseased, totalSurvived, totalImmunized, 0);
  }

  addRow(episodeNumber, totalDiseased, totalSurvived, totalImmunized, totalHealthy) {
    let row = this.episodeStatsTable.insertRow();

    let episodeColumn = row.insertCell(0);
    let totalDiseasedColumn = row.insertCell(1);
    let totalImmunizedColumn = row.insertCell(2);
    let totalHealthyColumn = row.insertCell(3);
    let totalSurvivedColumn = row.insertCell(4);

    episode.innerHTML = episodeNumber;
    totalDiseasedColumn.innerHTML = totalDiseased;
    totalImmunizedColumn.innerHTML = totalImmunized;
    totalHealthyColumn.innerHTML = totalHealthy;
    totalSurvivedColumn.innerHTML = totalSurvived;
  }
}
