class SwarmManager {
  constructor(numAgents = 10, mutation=0.01, diseaseIntroductionRate=0.01) {
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
    if (episodeManager.timeStep === 0 || random() >= this.diseaseIntroductionRate){
      // TODO: Introduce disease at a random location or to a random agent.
      random(this.agents).healthState = state.diseased;
    }
  }

  getGenes(num) {
    // TODO: Get agent genes from json.
    let genes = [];
    for (let i=0; i< num; i++){
      genes.push({
        diseased: this.getRandomProbability(),
        healthy: this.getRandomProbability(),
        immune: this.getRandomProbability(),
        zombie: this.getRandomProbability(),
      });
    }
    return genes;
  }

  getRandomProbability(){
    return random(-1, 1);
  }
}