class ParameterInjector {
  static instance = null;

  constructor() {
    this.params = {
      episodeParams: {
        framesPerTimeStep: 3,
        timeStepsPerEpisode: 500,
      },
      swarmParams: {
        numAgents: 150,
        mutation: 0.1,
        diseaseIntroductionRate: 0,
        forceOfAttraction: 0.002,  // global force
        diseaseIdentificationProbability: 1,
        contagionRate: 0.1,
        visualRange: 30,
        zombificationRate: 0, //0.0001,
        deathRate: 0.00005,
        recoveryRate: 0.002,
        recoveryLossRate: 0.0015,
        socialDistanceLength: 10,
        socialDistancingDiseasedTrigger: 0,
        amountOfArtificialSelection: 0.5,
        amountOfOffSprings: 0.5,
        deflectionStrength: 0.1,
        dontOverlap: 0,
        socialDistanceOfLikeAgents: 0,
      },
      uiParams: {
        side: 300,
        fps: 100,
        boxPadding: 10,
      },
    };
    this.clients = [];

    this.descriptions = [
      {
        name: 'numAgents',
        desc: "Number of agents in the simulation.",
      },
      {
        name: 'mutation',
        desc: "The scale of mutations in the genes. This number will be multiplied with a random number (0-1) and added to the genes.",
      },
      {
        name: 'diseaseIntroductionRate',
        desc: "The probability of a random agent to get diseased unconditionally.",
      },
      {
        name: 'forceOfAttraction',
        desc: "Attraction force between agents of same type.",
      },
      {
        name: 'diseaseIdentificationProbability',
        desc: "The probability with which an agent identifies the health-state of its surrounding agents in its visual range.",
      },
      {
        name: 'contagionRate',
        desc: "The probability of an agent to get infected by a diseased agent in its visual range. This number gets summed with each diseased agent in the visual range.",
      },
      {
        name: 'visualRange',
        desc: "The side length of the square area regarded as an agent's visual field.",
      },
      {
        name: 'zombificationRate',
        desc: "The probability at which a dead agent becomes a Zombie.",
      },
      {
        name: 'deathRate',
        desc: "The probability at which a diseased agent dies",
      },
      {
        name: 'recoveryRate',
        desc: "The probability at which a diseased agent recovers from the disease.",
      },
      {
        name: 'recoveryLossRate',
        desc: "The probability at which a recovered agent becomes susceptible.",
      },
      {
        name: 'socialDistanceLength',
        desc: "The distance at which the agents would want to distance themselves.",
      },
      {
        name: 'socialDistancingDiseasedTrigger',
        desc: "The fraction of diseased agents in the system when reached, social distancing will be enabled.",
      },
      {
        name: 'amountOfArtificialSelection',
        desc: "The fraction of the best agents to be picked for next episode.",
      },
      {
        name: 'amountOfOffSprings',
        desc: "The fraction of agents to be replicated with mutation.",
      },
      {
        name: 'deflectionStrength',
        desc: "The strength/scale of deflections.",
      },
      {
        name: 'dontOverlap',
        desc: "[0-1] Agents don't overlap if this value is 1.",
      },
      {
        name: 'socialDistanceOfLikeAgents',
        desc: "[0-1] The effect of social distancing between agents of same group.",
      },
    ]
  }

  static getInstance() {
    if (ParameterInjector.instance === null)
      ParameterInjector.instance = new ParameterInjector();
    return ParameterInjector.instance;
  }

  register(client) {
    this.clients.push(client);
  }

  updateAll() {
    this.clients.forEach(client => client.updateParams());
  }

}
