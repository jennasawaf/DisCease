let swarmManager;

function setup() {
  createCanvas(640, 480);
  swarmManager = new SwarmManager();
  swarmManager.setup();
}

function draw() {
  background(230);
  swarmManager.updateAll();
  swarmManager.displayAll();
}
