class SwarmManager {
  constructor(numAgents = 10, mutation=0.01, diseaseIntroductionRate=0.001) {
    this.agents = [];
    this.numAgents = numAgents;
    this.diseaseIntroductionRate = diseaseIntroductionRate;
    // TODO: Load the stored genes from JSON file at web/js/data/genes.json
    // TODO: Create all agents from the loaded genes.
  }

  initEpisode() {

    // Add new agents into the mix
    for (let i = this.agents.length; i < this.numAgents; i++) {
      let agent = new Agent();
      // TODO: Give the new agent genes from roulette wheel (high prob to best gene (best = max of agent.getScore()))
      // TODO: Perform a perturbation of this.mutation on the genes.
      agent.deflection = this.getGenes(1)[0];
      this.agents.push(agent);
    }

    for (let i = 0; i < this.numAgents; i++) {
      this.agents[i].location = createVector(Math.random() * width, Math.random() * height);
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
  }

  displayAll() {
    this.agents.forEach(agent => agent.display());
  }

  introduceDisease(episodeManager) {
    if (episodeManager.timeStep === 0 || random() <= this.diseaseIntroductionRate){
      // TODO: Introduce disease at a random location or to a random agent.
      random(this.agents).healthState = state.diseased;
    }
  }

  getGenes(num) {
    // TODO: Get agent genes from json.
    let genes = [];
    for (let i=0; i< num; i++){
      genes.push({
        'diseased': random(-1, 1),
        'healthy': random(-1, 1),
        'immune': random(-1, 1),
        'zombie': random(-1, 1),
        'dead': 0,
      });
    }
    return genes;
  }

}
