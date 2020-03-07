let swarmManager;
let episodeManager;
let fps = 10;

function setup() {
  createCanvas(640, 480);
  frameRate(fps);

  episodeManager = new EpisodeManager(3, 60);
  swarmManager = new SwarmManager(10, 0.1, 0.01);
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
