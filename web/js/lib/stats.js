class Stats {
  constructor(game) {
    this.game = game;
    this.currentPopulation = {
      diseased: 0,
      recovered: 0,
      healthy: 0,
      dead: 0,
    }
  }

  perTimeStep() {
    this.game.uiManager.updateTimeStepInfo();
    this.updateCurrentPopulations();
  }

  perEpisode() {
    this.game.uiManager.updateEpisodeInfo();
  }

  updateCurrentPopulations() {
    this.currentPopulation = {
      diseased: 0,
      recovered: 0,
      healthy: 0,
      dead: 0,
    };
    for (let agent of this.game.swarmManager.agents) {
      switch (agent.healthState) {
        case state.healthy: this.currentPopulation.healthy++; break;
        case state.diseased: this.currentPopulation.diseased++; break;
        case state.recovered: this.currentPopulation.recovered++; break;
        case state.dead: this.currentPopulation.dead++; break;
      }
    }
  }


}


