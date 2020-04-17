class Game {
  constructor(){
    this.paramsInjector = ParameterInjector.getInstance();
    this.episodeManager = new EpisodeManager(this);
    this.swarmManager = new SwarmManager(this);
    this.stats = new Stats(this);
    this.uiManager = new UIManager(this);
    this.sketch = null;
    this.p5 = null;
  }

  run(){
    this.p5 = new p5((sketch) => {
      sketch.setup = () => this.setup(sketch);
      sketch.draw = () => this.draw(sketch);
    });
  }

  setup(sketch){
    this.sketch = sketch;
    this.uiManager.sketch = sketch;

    this.uiManager.setupSketch();

  }

  draw(sketch){
    this.episodeManager.update();

    if (this.episodeManager.isNewTimeStep()) {
      this.stats.perTimeStep();
    }

    if (this.episodeManager.isNewEpisode()) {
      this.stats.perEpisode();
      this.swarmManager.finishEpisode();
      this.swarmManager.initEpisode();
    }

    this.swarmManager.updateAll(this.episodeManager);

    sketch.background(230);
    this.swarmManager.displayAll(sketch);
  }
}

$(document).ready(function () {

  new Game().run();

});

