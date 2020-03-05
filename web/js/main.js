let agents;

function setup() {
  createCanvas(640, 480);
  agents = [new Agent()];
}

function draw() {
  background(230);
  agents.forEach(agent => agent.update());
  agents.forEach(agent => agent.display());
}
