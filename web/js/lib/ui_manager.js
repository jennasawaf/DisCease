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

    this.contagionSlider.onchange = function () {
      params.params.swarmParams.contagionRate = self.contagionSlider.value;
      params.updateAll();
    };

    this.recoverySlider.onchange = function () {
      params.params.swarmParams.recoveryRate = self.recoverySlider.value;
      params.updateAll();
    };

    this.deathSlider.onchange = function () {
      params.params.swarmParams.deathRate = self.deathSlider.value;
      params.updateAll();
    };
  }

  updateTimeStepInfo() {

    let populations = this.game.stats.currentPopulation;
    let episodeNumber = this.game.episodeManager.episode;

    // TODO: Put these population numbers into a graph.
    $("#message_p").html(`Episode: ${episodeNumber}\nHealthy: ${populations.healthy}, dis: ${populations.diseased}, dead: ${populations.dead}, recovered: ${populations.recovered}`);
  }

  updateEpisodeInfo() {
    let populations = this.game.stats.currentPopulation;
    if (this.game.episodeManager.episode === 1) return;
    this.addRow(
      this.game.episodeManager.episode - 1,
      this.game.stats.totalDiseased,
      populations.diseased,
      populations.recovered,
      populations.healthy,
      populations.healthy + populations.recovered
    );
  }

  addRow(...values) {
    let row = this.episodeStatsTable.insertRow();
    for (let i = 0; i < values.length; i++) {
      let column = row.insertCell(i);  // TODO: Check if column var is necessary?
      column.innerHTML = values[i];
    }
  }

}
