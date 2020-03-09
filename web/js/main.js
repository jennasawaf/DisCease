let swarmManager;
let episodeManager;
let fps = 30;

function setup() {
  createCanvas(300, 300);
  frameRate(fps);

  episodeManager = new EpisodeManager(3, 100);
  swarmManager = new SwarmManager(100, 0.1, 0.01);
}

function draw() {

  episodeManager.update();

  if (episodeManager.isNewEpisode()) {
    swarmManager.finishEpisode();
    swarmManager.initEpisode();
  }

  swarmManager.updateAll(episodeManager);
  background(230);
  swarmManager.displayAll();
}
