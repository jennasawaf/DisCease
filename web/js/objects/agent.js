const state = {
  diseased: 'diseased',
  healthy: 'healthy',
  immune: 'immune',
  zombie: 'zombie',
  dead: 'dead',
};

const stateDetails = {
  'diseased': {
    'color': 'red',
  },
  'healthy': {
    'color': 'white',
  },
  'immune': {
    'color': 'green',
  },
  'zombie': {
    'color': 'black',
  },
  'dead': {
    'color': 200,
  }
};

class Agent {

  constructor(deflections) {
    this.mass = 1;
    this.maxVelocity = 2;
    this.drag = 0.005;

    this.location = createVector(random(10, width - 10), random(10, height - 10));
    this.velocity = createVector(0.0, 0.0);
    this.acceleration = createVector(random(-width, width), random(-height, height));

    // Hyper-parameters
    this.diseaseIdentificationProbability = 0.8;
    this.contagionRate = 0.01;
    this.visualRange = 20;
    this.zombificationRate = 0.0001;
    this.deathRate = 0.0015;
    this.immunizationRate = 0.0015;
    this.immunizationLossRate = 0.001;

    // Internal State Variables:
    this.healthState = state.healthy;
    this.numDiseased = 0;
    this.numEpisodesSurvived = 0;
    this.numDiseaseSpread = 1;  // Number of times this guy spread its disease to others.

    // Genetic Information:
    if (deflections != null)
      this.deflections = deflections;
    else
      this.deflections = this.getRandomDeflections();

  }

  getScore() {
    return this.numEpisodesSurvived / this.numDiseased / this.numDiseaseSpread;
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

    this.checkContaminated(neighbours);
    this.applyForce(this.getNextMove(neighbours).mult(0.1));

    this._updateLocation();

  }

  display() {
    fill(color(stateDetails[this.healthState]['color']));
    ellipse(this.location.x, this.location.y, 10, 10);
  }

  _updateLocation() {
    this.checkBounds();
    this.setVelocity(p5.Vector.add(this.velocity, this.acceleration));
    this.velocity.mult(1 - this.drag);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  getNextMove(neighbours) {
    if (neighbours.length === 1) {
      return this.getVectorToCenter().normalize().mult(0.01);
    }

    var nextMove = createVector(0, 0);

    for (let neighbour of neighbours) {
      nextMove = createVector(0.0, 0.0);
      let observedHealth = state.healthy;
      if (random() <= this.diseaseIdentificationProbability) {
        observedHealth = neighbour.healthState;
      }
      let pointer = p5.Vector.sub(neighbour.location, this.location);
      pointer.mult(this.deflections[this.healthState][neighbour.healthState]);
      nextMove.add(pointer);
      nextMove.normalize();
    }

    return nextMove;
  }

  checkBounds() {
    let padding = 5;
    if (this.location.x > width - padding) {
      this.velocity.x = -Math.abs(this.velocity.x);
      this.acceleration.x = 0;
    } else if (this.location.x < padding) {
      this.velocity.x = Math.abs(this.velocity.x);
      this.acceleration.x = 0;
    }
    if (this.location.y > height - padding) {
      this.velocity.y = -Math.abs(this.velocity.y);
      this.acceleration.y = 0;
    } else if (this.location.y < padding) {
      this.velocity.y = Math.abs(this.velocity.y);
      this.acceleration.y = 0;
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
      if (this.isInVisualRange(this.location.x, this.location.y, agent)) {
        neighbors.push(agent);
      }
    }

    return neighbors;
  }

  //checking if in same range
  isInVisualRange(x, y, agent) {
    return (Math.abs(agent.location.x - x) <= this.visualRange && Math.abs(agent.location.y - y) <= this.visualRange);
  }

  checkContaminated(neighbours) {

    let px = random();

    if (this.healthState === state.healthy) {
      if (px <= this.immunizationRate) {
        this.healthState = state.immune;
        return;
      }
    }

    if (this.healthState === state.dead) {
      return;
    }

    if (this.healthState === state.immune) {
      if (px <= this.immunizationLossRate) {
        this.healthState = state.healthy;
      }
      return;
    }

    if (this.healthState === state.zombie) {
      if (px <= this.deathRate) {
        this.healthState = state.dead;
      }
      return;
    }

    if (this.healthState === state.diseased) {
      if (px/this.numDiseaseSpread <= this.deathRate) {
        this.healthState = state.dead;
        return;
      }
      if (px <= this.immunizationRate) {
        this.healthState = state.immune;
        return;
      }
      if (px <= this.zombificationRate) {
        this.healthState = state.zombie;
        return;
      }
      return;
    }

    let totalContagion = 0.0;

    for (let neighbour of neighbours) {
      if (neighbour.healthState === state.diseased || neighbour.healthState === state.zombie) {
        totalContagion += this.contagionRate;
      }
    }

    if (px <= totalContagion) {
      this.healthState = state.diseased;
      this.numDiseased += 1;
      neighbours.forEach(neighbour => neighbour.numDiseaseSpread++);
    }

  }

  getVectorToCenter() {
    let center = createVector(width/2, height/2);
    return p5.Vector.sub(center, this.location);
  }

  getRandomSingleDeflection() {
    return random(-0.1, 0.1);
  }

  getRandomDeflections() {
    return {
      'diseased': {
      'diseased': this.getRandomSingleDeflection(),
        'healthy': this.getRandomSingleDeflection(),
        'immune': this.getRandomSingleDeflection(),
        'zombie': this.getRandomSingleDeflection(),
        'dead': 0,
    },
      'healthy': {
      'diseased': this.getRandomSingleDeflection(),
        'healthy': this.getRandomSingleDeflection(),
        'immune': this.getRandomSingleDeflection(),
        'zombie': this.getRandomSingleDeflection(),
        'dead': 0,
    },
      'immune': {
      'diseased': this.getRandomSingleDeflection(),
        'healthy': this.getRandomSingleDeflection(),
        'immune': this.getRandomSingleDeflection(),
        'zombie': this.getRandomSingleDeflection(),
        'dead': 0,
    },
      'zombie': {
      'diseased': 0,
        'healthy': 1,
        'immune': 1,
        'zombie': 0.5,
        'dead': 0,
    },
      'dead': {
      'diseased': 0,
        'healthy': 0,
        'immune': 0,
        'zombie': 0,
        'dead': 0,
    },
    }
  }

  getPerfectDeflections() {
    return {
      'diseased': {
        'diseased': 0.5, // this.getRandomSingleDeflection(),
        'healthy': -0.5, //this.getRandomSingleDeflection(),
        'immune': -0.5, // this.getRandomSingleDeflection(),
        'zombie': 0.5, // this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'healthy': {
        'diseased': -0.5, // this.getRandomSingleDeflection(),
        'healthy': 0.5, // this.getRandomSingleDeflection(),
        'immune': 0.5, // this.getRandomSingleDeflection(),
        'zombie': -0.5, // this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'immune': {
        'diseased': -0.5, // this.getRandomSingleDeflection(),
        'healthy': 0.5, // this.getRandomSingleDeflection(),
        'immune': 0.5, // this.getRandomSingleDeflection(),
        'zombie': -0.5, // this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'zombie': {
        'diseased': 0,
        'healthy': 1,
        'immune': 1,
        'zombie': 0.5,
        'dead': 0,
      },
      'dead': {
        'diseased': 0,
        'healthy': 0,
        'immune': 0,
        'zombie': 0,
        'dead': 0,
      },
    }
  }

}
