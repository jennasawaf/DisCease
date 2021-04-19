class Stats {
  constructor(game) {
    this.game = game;
    this.currentPopulation = {
      diseased: 0,
      recovered: 0,
      healthy: 0,
      dead: 0,
    };
    this.totalDiseased = 0;
    this.meanScore = null;
    this.scoreDensity = []
  }

  perTimeStep() {
    this.game.uiManager.updateTimeStepInfo();
    this.updateCurrentPopulations();
  }

  perEpisode() {
    this.currentEpochAvgGenes = this.collectMeanGenes();
    this.meanScore = this.getMeanScore();
    this.scoreDensity = this.getScoreDensity();

    this.game.uiManager.updateEpisodeInfo();
    this.totalDiseased = 0;
  }

  getScoreDensity() {
    let scores = [];
    this.game.swarmManager.agents.forEach(agent => scores.push(agent.getScore()));
    scores.sort();

    let bins = [];
    let binCount = 0;
    let interval = .005;
    let min = Math.min(...scores);
    let max = Math.max(...scores);

    //Setup Bins
    for (let i = min; i < max; i += interval) {
      bins.push({
        binNum: binCount,
        minNum: i,
        maxNum: i + interval,
        avg: 0,
        count: 0
      });
      binCount++;
    }

    //Loop through data and add to bin's count
    for (let i = 0; i < scores.length; i++) {
      let item = scores[i];
      for (let j = 0; j < bins.length; j++) {
        let bin = bins[j];
        if (item > bin.minNum && item <= bin.maxNum) {
          bin.avg = ((bin.avg * bin.count) + item) / (bin.count + 1);
          bin.count++;
        }
      }
    }

    bins.sort((a, b) => a.avg - b.avg);
    bins = bins.filter(bin=>bin.avg > 0);

    return bins;
  }

  getMeanScore() {
    let meanScore = 0;
    this.game.swarmManager.agents.forEach(agent => meanScore += agent.getScore());
    meanScore /= this.game.swarmManager.agents.length;
    return meanScore;
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
        case state.healthy:
          this.currentPopulation.healthy++;
          break;
        case state.diseased:
          this.currentPopulation.diseased++;
          break;
        case state.recovered:
          this.currentPopulation.recovered++;
          break;
        case state.dead:
          this.currentPopulation.dead++;
          break;
      }
    }
  }

  incrementDiseased() {
    this.totalDiseased++;
  }

  collectMeanGenes() {
    let avgGenes = [];
    let types = ['healthy', 'diseased', 'recovered'];

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < types.length; j++) {
        let avgGene = [i, j, 0];
        for (let agent of this.game.swarmManager.agents) {
          avgGene[2] += agent.deflections[types[i]][types[j]];
        }
        avgGene[2] /= this.game.swarmManager.agents.length;
        avgGene[2] = parseFloat(avgGene[2].toFixed(5));
        avgGenes.push(avgGene);
      }
    }
    return avgGenes;
  }

}


