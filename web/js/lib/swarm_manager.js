class SwarmManager {

  constructor(game) {
    this.game = game;
    game.paramsInjector.register(this);

    this.updateParams();

    this.agents = [];

    // TODO: Load the stored genes from JSON file at web/js/data/genes.json
    // TODO: Create all agents from the loaded genes.
  }

  updateParams() {
    this.params = this.game.paramsInjector.params.swarmParams;
    this.numAgents = this.params.numAgents;
    this.diseaseIntroductionRate = this.params.diseaseIntroductionRate;
    this.forceOfAttraction = this.params.forceOfAttraction;
    this.contagionRate = this.params.contagionRate;
    this.recoveryRate = this.params.recoveryRate;
    this.zombificationRate = this.params.zombificationRate;
    this.diseaseIdentificationProbability = this.params.diseaseIdentificationProbability;
    this.recoveryLossRate = this.params.recoveryLossRate;
    this.visualRange = this.params.visualRange;
    this.boxPadding = this.game.paramsInjector.params.uiParams.boxPadding;
  }

  initEpisode() {

    this.populateWithAgents();

    // Randomize their positions and make them healthy
    this.agents.forEach((agent) => agent.initState());

  }

  populateWithAgents() {

    if (this.agents.length === 0) {
      for (let i = 0; i < this.numAgents; i++)
        this.agents.push(new Agent(this.game));
      return;
    }

    this.agents.sort((agent_1, agent_2) => agent_2.getScore() - agent_1.getScore());
    let nextGenAgents = this.agents.slice(0, this.numAgents * this.params.amountOfArtificialSelection);
    nextGenAgents.forEach(agent => agent.numEpisodesSurvived++);

    // Add new agents into the mix
    let rouletteWheelAgents = this.getRouletteWheelAgents();
    for (let i = nextGenAgents.length; i < this.numAgents; i++) {
      if (Math.random() < this.params.amountOfOffSprings) {
        nextGenAgents.push(new Agent(this.game));
      } else {
        // nextGenAgents.push(new Agent(this.game));
        let randomIndex = Math.floor(Math.random() * rouletteWheelAgents.length);
        this.mutate([rouletteWheelAgents[randomIndex]]);
        nextGenAgents.push(rouletteWheelAgents[randomIndex]);
      }
    }

    this.agents = nextGenAgents;
  }

  getRouletteWheelAgents() {
    // Give the new agent genes from roulette wheel (high prob to best gene (best = max of agent.getScore()))
    let agentProbabilities = this.getRouletteWheelProbabilities();
    let agentToPick = [];
    for (let i = 0; i < agentProbabilities.length; i++) {
      let agentCount = agentProbabilities[i] * this.numAgents;
      for (let j = 0; j < agentCount; j++) {
        agentToPick.push(new Agent(this.game, this.agents[i].deflections));
      }
    }
    return agentToPick;
  }

  getRouletteWheelProbabilities() {
    let scores = this.agents.map((agent) => agent.getScore());
    let sumOfScores = scores.reduce((a, b) => a + b);
    scores = scores.map((score) => score / sumOfScores);
    return scores;
  }

  mutate(agents) {
    let states = ['diseased', 'recovered', 'healthy'];
    agents.forEach(agent => {
      states.forEach(selfState => {
        states.forEach(otherState => {
          let perturbation = this.game.p5.random(-1, 1) * this.params.mutation;
          agent.deflections[selfState][otherState] += perturbation;
        })
      })
    });
  }

  finishEpisode() {
    // TODO: Store genes to json file.

    // Remove dead ones.
    // this.aliveAgents = this.agents.filter(agent => agent.healthState !== state.dead);
  }

  updateAll(episodeManager) {
    this.introduceDisease(episodeManager);
    this.agents.forEach(agent => agent.update(this.agents));
    let groupCenters = this.getGroupCenters();
    this.agents.forEach(agent => agent.applyForce(this.getGroupCenterVector(agent, groupCenters[agent.healthState])))
  }

  displayAll(sketch) {
    this.agents.forEach(agent => agent.display(sketch));
    sketch.stroke(150);
    sketch.noFill();
    let side = this.game.paramsInjector.params.uiParams.side;
    sketch.rect(this.boxPadding, this.boxPadding, side - 2 * this.boxPadding, side - 2 * this.boxPadding);
  }

  introduceDisease(episodeManager) {
    if (episodeManager.frame === 1 /*|| this.game.stats.currentPopulation.diseased === 0*/ || this.game.p5.random() <= this.diseaseIntroductionRate) {
      let randomAgent = this.game.p5.random(this.agents);
      if (randomAgent.healthState !== state.dead)
        randomAgent.healthState = state.diseased;
      else this.introduceDisease(episodeManager);
    }
  }

  getGroupCenters() {
    return {
      'diseased': this.getGroupCenter(state.diseased),
      'healthy': this.getGroupCenter(state.healthy),
      'recovered': this.getGroupCenter(state.recovered),
      'zombie': this.getGroupCenter(state.zombie),
      'dead': this.getGroupCenter(state.dead),
    }
  }

  getGroupCenter(group) {
    let meanX = 0;
    let meanY = 0;
    this.agents.forEach(agent=>{
      if (Agent.isHealthStateLogicallySame(agent.healthState, group)) {
        meanX += agent.location.x;
        meanY += agent.location.y;
      }
    });
    meanX /= this.agents.length;
    meanY /= this.agents.length;
    return this.game.p5.createVector(meanX, meanY);
  }

  getGroupCenterVector(agent, center) {
    return p5.Vector.sub(center, agent.location).normalize().mult(this.forceOfAttraction); // Vector from agent to center.
  }

}
