var _swarmManager;

class SwarmManager {
  constructor(numAgents = 10, mutation = 0.01, diseaseIntroductionRate = 0.001) {
    this.agents = [];
    this.numAgents = numAgents;
    this.diseaseIntroductionRate = diseaseIntroductionRate;
    // TODO: Load the stored genes from JSON file at web/js/data/genes.json
    // TODO: Create all agents from the loaded genes.
  }

  static getInstance(numAgents = 10, mutation = 0.01, diseaseIntroductionRate = 0.001) {
    if (_swarmManager == null) {
      return new SwarmManager(numAgents, mutation, diseaseIntroductionRate);
    } else {
      return _swarmManager;
    }
  }

  initEpisode() {

    // Add new agents into the mix
    for (let i = this.agents.length; i < this.numAgents; i++) {
      let agent = new Agent();
      // TODO: Give the new agent genes from roulette wheel (high prob to best gene (best = max of agent.getScore()))
      // TODO: Perform a perturbation of this.mutation on the genes.
      this.agents.push(agent);
    }

    for (let i = 0; i < this.numAgents; i++) {
      this.agents[i].location = createVector(random(10, width - 10), random(10, height - 10));
      this.agents[i].acceleration = createVector(random(-width, width), random(-height, height));
      this.agents[i].healthState = state.healthy;
    }

  }

  finishEpisode() {
    // TODO: Store genes to json file.

    // Remove dead ones.
    this.agents = this.agents.filter(agent => agent.healthState !== state.dead);
  }

  updateAll(episodeManager) {
    this.introduceDisease(episodeManager);
    this.agents.forEach(agent => agent.update(this.agents));
    // this.agents.forEach(agent => agent.applyForce(agent.getVectorToCenter()))
  }

  displayAll() {
    this.agents.forEach(agent => agent.display());
  }

  introduceDisease(episodeManager) {
    if (episodeManager.timeStep === 0 || random() <= this.diseaseIntroductionRate) {
      // TODO: Introduce disease at a random location or to a random agent.
      random(this.agents).healthState = state.diseased;
    }
  }

}
