class SwarmManager {
  constructor() {
    this.agents = [];
  }

  setup() {
    // Get agent genes from file.

    for (let i = 0; i < 10; i++) {
      let agent = new Agent();
      // Update agent location to uniform random location.

      this.agents.add(agent);
    }
  }

  updateAll() {
    this.agents.forEach(agent => agent.update());
  }

  displayAll() {
    this.agents.forEach(agent => agent.display());
  }
}
