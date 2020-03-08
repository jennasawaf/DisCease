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
  dead: {
    color: 'yellow',
  }
};

class Agent {

  constructor(deflections) {
    this.mass = 1;
    this.maxVelocity = 3;

    this.location = createVector(width / 2, height / 2);
    this.velocity = createVector(0.0, 0.0);
    this.acceleration = createVector(0.0, 0.0);

    // Hyper-parameters
    this.diseaseIdentificationProbability = 0.8;
    this.contagionRate = 0.1;
    this.visualRange = 10;
    this.zombificationRate = 0.01;
    this.deathRate = 0.3;

    // Internal State Variables:
    this.healthState = state.healthy;
    this.numDiseased = 0;
    this.numEpisodesSurvived = 0;

    // Genetic Information:
    if (deflections != null)
      this.deflection = deflections;
    else
      this.deflection = {
        diseased: random(-1, 1),
        healthy: random(-1, 1),
        immune: random(-1, 1),
        zombie: random(-1, 1),
      };

  }

  getScore(){
    return this.numEpisodesSurvived / this.numDiseased;
  }

  setVelocity(velocity) {
    this.velocity = velocity;
    this.velocity.limit(this.maxVelocity);
  }

  applyForce(force) {
    let acceleration = p5.Vector.div(force, this.mass);
    this.acceleration.add(acceleration);
  }

  update(allAgents) {
    let neighbours = this.getObservableNeighbours(allAgents);

    this.checkBounds();
    this.checkContaminated(neighbours);
    this.applyForce(this.getNextMove(neighbours));

    this._updateLocation();

  }

  display() {
    fill(color(this.healthState.color));
    ellipse(this.location.x, this.location.y, 10, 10);
  }

  _updateLocation(){
    this.setVelocity(p5.Vector.add(this.velocity, this.acceleration));
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  getNextMove(neighbours){
    let nextMove = createVector(0.0, 0.0);

    for (let neighbour of neighbours){
      let observedHealth = state.healthy;
      if (random() <= this.diseaseIdentificationProbability) {
        observedHealth = neighbour.healthState;
      }
      // TODO: nextMove += (distance vector from this.location to neighbour.location) * this.deflection(neighbour.healthState)
    }

    return nextMove;
  }

  checkBounds() {
    if (this.location.x > width || this.location.x < 0) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.y > height || this.location.y < 0) {
      this.velocity.y = this.velocity.y * -1;
    }
  }

  getObservableNeighbours(allAgents) {
    // TODO: Implement get neighbours.
    /*
    I think performing a euclidean distance from this.location to all other agents will be computationally challenging.
    So, lets draw a square box of size 2*this.visualRange around the agent and find agents whose location fall into this box.
    This should be a circle instead of a square, but circle will add more computational complexity.
     */

    let neighbors = [];

    for (let agent of allAgents) {
    	if(this.isInVisualRange(this.location.x, this.location.y, agent)) {
    		neighbors.push(agent);
    	}
    }

    return neighbors;
  }

  //checking if in same range
  isInVisualRange(x, y, agent) {
  	return (Math.abs(agent.location.x - x) >= this.visualRange && Math.abs(agent.location.y - y) >= this.visualRange);
  }

  checkContaminated(neighbours) {

    if(this.healthState === state.dead || this.healthState === state.zombie) {
    	return;
    }

    if(this.healthState === state.diseased) {
      if(random() <= this.zombificationRate) {
        this.healthState = state.zombie;
        return;
      }
    }

    let totalContagion = 0.0;

    for (let neighbour of neighbours){
      if (neighbour.healthState in [state.diseased, state.zombie]) {
        totalContagion += this.contagionRate;
      }
    }

    if (random() <= totalContagion) {
      if (random() <= this.deathRate){
        this.healthState = state.dead;
      } else{
        this.healthState = state.diseased;
      }
    }

  }

}
