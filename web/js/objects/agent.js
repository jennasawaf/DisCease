const state = {
  diseased: 'diseased',
  healthy: 'healthy',
  recovered: 'recovered',
  zombie: 'zombie',
  dead: 'dead',
};

class Agent {

  constructor(game, deflections) {
    this.game = game;
    this.swarm = game.swarmManager;
    this.mass = 1;
    this.maxVelocity = 2;
    this.drag = 0.005;
    this.diameter = 10;

    // Internal State Variables:
    this.initState();
    this.velocity = this.game.p5.createVector(0.0, 0.0);
    this.numEpisodesSurvived = 1;

    // Genetic Information:
    this.deflections = this.getDeflections(deflections);

  }

  initState() {
    let side = this.game.paramsInjector.params.uiParams.side;
    this.location = this.game.p5.createVector(this.game.p5.random(10, side - 10), this.game.p5.random(10, side - 10));
    this.acceleration = this.game.p5.createVector(this.game.p5.random(-side, side), this.game.p5.random(-side, side));
    this.healthState = state.healthy;

    this.numDiseased = 1;
    this.numDiseaseSpread = 1;  // Number of times this guy spread its disease to others.

  }

  getScore() {
    return this.numEpisodesSurvived / (this.numDiseased * this.numDiseaseSpread);
  }

  getDeflections(deflections){
    if (deflections != null)
      return deflections;
    else if (this.swarm.params.perfectDeflections > 0)
      return this.getPerfectDeflections();
    else if (this.swarm.params.perfectDeflections === 0)
      return this.getZeroDeflections();
    else this.deflections = this.getRandomDeflections();
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

    this.manageMovement(neighbours);

    this._updateLocation();
  }

  manageMovement(neighbours) {

    // Applying the deflection force.
    this.applyForce(this.getNextMove(neighbours));

    // Apply socialDistancing force
    neighbours.forEach(neighbour => this.applySocialDistance(neighbour));

  }

  applySocialDistance(agent) {
    let params = this.swarm.params;

    // Add don't overlap condition
    let pushDistance = params.dontOverlap * this.diameter;

    // Check social distance trigger
    let isSocialDistancingEnabled = this.game.stats.totalDiseased >= params.socialDistancingDiseasedTrigger * this.swarm.numAgents;
    if (isSocialDistancingEnabled) {
      let socialDistance = params.socialDistanceLength;

      // Check if like agents have social distancing
      if (Agent.isHealthStateLogicallySame(this.healthState, agent.healthState))
        socialDistance *= params.socialDistanceOfLikeAgents;

      pushDistance += socialDistance;
    }

    let distanceVector = p5.Vector.sub(agent.location, this.location);
    let distance = distanceVector.mag();

    if (distance < pushDistance) {
      let pushVector = p5.Vector.mult(distanceVector, -1);
      pushVector.setMag((pushDistance - distance) / 2);
      this.velocity.add(pushVector);
    }

  }

  display(sketch) {
    sketch.fill(sketch.color(this._getColor()));
    sketch.stroke(200);
    sketch.ellipse(this.location.x, this.location.y, this.diameter, this.diameter);
  }

  _updateLocation() {
    this.checkBounds();
    this.setVelocity(p5.Vector.add(this.velocity, this.acceleration));
    this.velocity.mult(1 - this.drag);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  static isHealthStateLogicallySame(agent1Health, agent2Health) {
    if (
      (agent1Health === state.healthy || agent1Health === state.recovered) &&
      (agent2Health === state.healthy || agent2Health === state.recovered)
    ) return true;

    if (
      (agent1Health === state.diseased || agent1Health === state.zombie) &&
      (agent2Health === state.diseased || agent2Health === state.zombie)
    ) return true;
  }

  getNextMove(neighbours) {

    if (neighbours.length === 1)
      return this.game.p5.createVector(0, 0);

    if (this.swarm.params.perfectDeflections === 0) {
      if (this.game.p5.random() > 0.05)
        return this.game.p5.createVector(0, 0);
      let side = this.game.paramsInjector.params.uiParams.side;
      return this.game.p5.createVector(this.game.p5.random(-side, side), this.game.p5.random(-side, side));
    }

    let nextMove = this.game.p5.createVector(0, 0);

    for (let neighbour of neighbours) {
      nextMove = this.game.p5.createVector(0.0, 0.0);

      let observedHealth = state.healthy;
      if (this.game.p5.random() <= this.swarm.diseaseIdentificationProbability)
        observedHealth = neighbour.healthState;

      let pointer = p5.Vector.sub(neighbour.location, this.location);
      pointer.mult(this.deflections[this.healthState][observedHealth]);

      nextMove.add(pointer);
      // nextMove.normalize();
    }

    return nextMove.normalize().mult(this.swarm.params.deflectionStrength);
  }

  checkBounds() {
    let side = this.game.paramsInjector.params.uiParams.side;
    let padding = this.swarm.boxPadding + this.diameter / 2;
    if (this.location.x > side - padding) {
      this.velocity.x = -Math.abs(this.velocity.x);
      this.acceleration.x = 0;
    } else if (this.location.x < padding) {
      this.velocity.x = Math.abs(this.velocity.x);
      this.acceleration.x = 0;
    }
    if (this.location.y > side - padding) {
      this.velocity.y = -Math.abs(this.velocity.y);
      this.acceleration.y = 0;
    } else if (this.location.y < padding) {
      this.velocity.y = Math.abs(this.velocity.y);
      this.acceleration.y = 0;
    }
  }

  getObservableNeighbours(allAgents) {
    let neighbors = [];

    if (this.healthState === state.dead)
      return neighbors;

    for (let agent of allAgents) {
      if (agent.healthState !== state.dead && this.isInVisualRange(agent)) {
        neighbors.push(agent);
      }
    }

    return neighbors;
  }

  //checking if in same range
  isInVisualRange(agent) {
    let xInRange = Math.abs(agent.location.x - this.location.x) <= this.swarm.visualRange;
    let yInRange = Math.abs(agent.location.y - this.location.y) <= this.swarm.visualRange;

    return xInRange && yInRange
  }

  checkContaminated(neighbours) {

    let px = this.game.p5.random();
    let multiplier = 0.005;

    if (this.healthState === state.dead)
      return;

    if (this.healthState === state.recovered) {
      if (px <= this.swarm.recoveryLossRate * multiplier)
        this.healthState = state.healthy;
    }

    if (this.healthState === state.zombie) {
      if (px <= this.swarm.deathRate * multiplier)
        this.healthState = state.dead;
      return;
    }

    if (this.healthState === state.diseased) {

      if (px <= this.swarm.params.recoveryRate * multiplier) {
        this.healthState = state.recovered;
      }

      if (px <= this.swarm.params.deathRate * multiplier)
        this.healthState = state.dead;

      if (px <= this.swarm.params.zombificationRate * multiplier) {
        this.healthState = state.zombie;
      }
      return;
    }

    let totalContagion = 0.0;

    for (let neighbour of neighbours) {
      if (neighbour.healthState === state.diseased || neighbour.healthState === state.zombie) {
        totalContagion += this.swarm.contagionRate * multiplier;
      }
    }

    if (px <= totalContagion) {
      this.numDiseased += 1;
      neighbours.forEach(neighbour => neighbour.numDiseaseSpread++);
      if (this.healthState === state.healthy) {
        this.healthState = state.diseased;
        this.game.stats.incrementDiseased();
      }
    }

  }

  _getColor() {
    switch (this.healthState) {
      case state.healthy:
        return 'white';
      case state.diseased:
        return 'red';
      case state.recovered:
        return 'green';
      case state.zombie:
        return 'black';
      case state.dead:
        return 200;
    }
  }

  getZeroDeflections() {
    return {
      'diseased': {
        'diseased': 0,
        'healthy': 0,
        'recovered': 0,
        'zombie': 0,
        'dead': 0,
      },
      'healthy': {
        'diseased': 0,
        'healthy': 0,
        'recovered': 0,
        'zombie': 0,
        'dead': 0,
      },
      'recovered': {
        'diseased': 0,
        'healthy': 0,
        'recovered': 0,
        'zombie': 0,
        'dead': 0,
      },
      'zombie': {
        'diseased': 0,
        'healthy': 1,
        'recovered': 1,
        'zombie': 0.5,
        'dead': 0,
      },
      'dead': {
        'diseased': 0,
        'healthy': 0,
        'recovered': 0,
        'zombie': 0,
        'dead': 0,
      },
    }
  }

  getRandomSingleDeflection() {
    return this.game.p5.random(-0.1, 0.1);
  }

  getRandomDeflections() {
    return {
      'diseased': {
        'diseased': this.getRandomSingleDeflection(),
        'healthy': this.getRandomSingleDeflection(),
        'recovered': this.getRandomSingleDeflection(),
        'zombie': this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'healthy': {
        'diseased': this.getRandomSingleDeflection(),
        'healthy': this.getRandomSingleDeflection(),
        'recovered': this.getRandomSingleDeflection(),
        'zombie': this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'recovered': {
        'diseased': this.getRandomSingleDeflection(),
        'healthy': this.getRandomSingleDeflection(),
        'recovered': this.getRandomSingleDeflection(),
        'zombie': this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'zombie': {
        'diseased': 0,
        'healthy': 1,
        'recovered': 1,
        'zombie': 0.5,
        'dead': 0,
      },
      'dead': {
        'diseased': 0,
        'healthy': 0,
        'recovered': 0,
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
        'recovered': -0.5, // this.getRandomSingleDeflection(),
        'zombie': 0.5, // this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'healthy': {
        'diseased': -0.5, // this.getRandomSingleDeflection(),
        'healthy': 0.5, // this.getRandomSingleDeflection(),
        'recovered': 0.5, // this.getRandomSingleDeflection(),
        'zombie': -0.5, // this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'recovered': {
        'diseased': -0.5, // this.getRandomSingleDeflection(),
        'healthy': 0.5, // this.getRandomSingleDeflection(),
        'recovered': 0.5, // this.getRandomSingleDeflection(),
        'zombie': -0.5, // this.getRandomSingleDeflection(),
        'dead': 0,
      },
      'zombie': {
        'diseased': 0,
        'healthy': 1,
        'recovered': 1,
        'zombie': 0.5,
        'dead': 0,
      },
      'dead': {
        'diseased': 0,
        'healthy': 0,
        'recovered': 0,
        'zombie': 0,
        'dead': 0,
      },
    }
  }

}
