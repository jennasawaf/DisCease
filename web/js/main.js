let swarmManager;
let episodeManager;
let fps = 60;
let stats;

function setup() {
  var canvas = createCanvas(300, 300);
  frameRate(fps);

  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');

  episodeManager = new EpisodeManager(3, 300);
  swarmManager = new SwarmManager(50, 0.1, 0.01);

  stats = new Stats();
}

function draw() {

  episodeManager.update();

  if (episodeManager.isNewEpisode()) {
    swarmManager.finishEpisode();
    swarmManager.initEpisode();
  }

  swarmManager.updateAll(episodeManager);
  stats.update();

  background(230);
  swarmManager.displayAll();
}
