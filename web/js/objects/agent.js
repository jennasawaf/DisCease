const state = {
  diseased: {
    color: 'red',
  },
  healthy: {
    color: 'white',
  },
  immune: {
    color: 'green',
  },
  zombie: {
    color: 'black',
  },
};

class Agent {

  constructor() {
    this.mass = 1;
    this.maxVelocity = 10;

    this.location = createVector(width / 2, height / 2);
    this.velocity = createVector(0.0, 0.0);
    this.acceleration = createVector(0.0, 0.0);

    this.neighbours = [];

    // Internal State Variables:
    this.healthState = state.healthy;
    this.numDiseased = 0;
    this.numEpisodesSurvived = 0;

    // Genetic Information:
    this.deflection = {
      diseased: -0.5,
      healthy: 0.0,
      immune: 0.5,
      zombie: -0.9,
    };

  }

  setVelocity(velocity) {
    this.velocity = velocity;
    this.velocity.limit(this.maxVelocity);
  }

  applyForce(force) {
    let acceleration = p5.Vector.div(force, this.mass);
    this.acceleration.add(acceleration);
  }

  update() {
    this.checkBounds();
    this.checkContaminated();
    this.applyForce(this.getNextMove());
    this.setVelocity(p5.Vector.add(this.velocity, this.acceleration));
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    fill(color(this.healthState.color));
    ellipse(this.location.x, this.location.y, 10, 10);
  }

  getNextMove() {
    return p5.Vector.random2D();
  }

  checkBounds() {
    if (this.location.x > width || this.location.x < 0) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.y > height || this.location.y < 0) {
      this.velocity.y = this.velocity.y * -1;
    }
  }

  // TODO: This is where you check if agent touched another agent
  checkContaminated() {

  }

  setHealthState(healthState) {
    this.healthState = healthState;
  }

}
