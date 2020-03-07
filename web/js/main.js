let swarmManager;
let episodeManager;
let fps = 10;

function setup() {
  createCanvas(640, 480);
  frameRate(fps);

  swarmManager = new SwarmManager(10);
  episodeManager = new EpisodeManager(3, 60);
}

function draw() {

  episodeManager.update();

  if (episodeManager.isNewEpisode()) {
    swarmManager.finishEpisode();
    swarmManager.initEpisode();
  }

  swarmManager.updateAll();
  background(230);
  swarmManager.displayAll();
}
