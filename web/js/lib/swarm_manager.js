class SwarmManager {
  constructor(numAgents=10) {
    this.agents = [];
    this.numAgents = numAgents;
  }

  initEpisode() {
    // Create all the agents.

    let genes = this.getGenes();

    for (let i = 0; i < this.numAgents; i++) {
      let agent = new Agent();
      // Update agent location to uniform random location.

      this.agents.push(agent);
    }
  }

  finishEpisode() {
    // Store genes to json file.
  }

  updateAll() {
    this.agents.forEach(agent => agent.update());
  }

  displayAll() {
    this.agents.forEach(agent => agent.display());
  }

  getGenes(){
    // Get agent genes from json.
    //alert(genes);
  }
}
