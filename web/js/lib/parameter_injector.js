class ParameterInjector {
  static instance = null;

  constructor() {
    this.params = {
      episodeParams: {
        framesPerTimeStep: 3,
        timeStepsPerEpisode: 1500,
        totalEpisodes: 5,
      },
      swarmParams: {
        numAgents: 100,
        mutation: 0.1,
        diseaseIntroductionRate: 0,
        forceOfAttraction: 0.002,  // global force
        diseaseIdentificationProbability: 1,
        contagionRate: 0.25,
        visualRange: 30,
        zombificationRate: 0, //0.0001,
        deathRate: 0.01,  // 0.00005,
        recoveryRate: 0.1,
        recoveryLossRate: 0.01,
        socialDistanceLength: 10,
        socialDistancingDiseasedTrigger: 0,
        amountOfArtificialSelection: 0.3,
        amountOfOffSprings: 0.8,
        deflectionStrength: 0.1,
        dontOverlap: 0,
        socialDistanceOfLikeAgents: 0,
        perfectDeflections: 1,
      },
      uiParams: {
        side: 300,
        fps: 200,
        boxPadding: 10,
        createGraphs: true,
      },
    };
    this.clients = [];

    this.descriptions = [
      {
        name: 'numAgents',
        desc: "Number of agents in the simulation.",
      },
      {
        name: 'contagionRate',
        desc: "The probability of an agent to get infected by a diseased agent in its visual range. This number gets summed with each diseased agent in the visual range.",
      },
      {
        name: 'recoveryRate',
        desc: "The probability at which a diseased agent recovers from the disease.",
      },
      {
        name: 'deathRate',
        desc: "The probability at which a diseased agent dies",
      },
      {
        name: 'recoveryLossRate',
        desc: "The probability at which a recovered agent becomes susceptible.",
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
        name: 'visualRange',
        desc: "The side length of the square area regarded as an agent's visual field.",
      },
      {
        name: 'zombificationRate',
        desc: "The probability at which a dead agent becomes a Zombie.",
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
        desc: "The fraction of new agents to be replicated with mutation.",
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
      {
        name: 'perfectDeflections',
        desc: "All agents will have perfect deflections if this value is greater than 0, No deflections if 0, Random deflections if less than 0.",
      },
    ];

    this.gameTypeParams = [
      {
        desc: "SN1",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 0,
        }
      },
      {
        desc: "SN2",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.7,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 0,
        },
      },
      {
        desc: "SN3",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.7,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 0,
        }
      },
      {
        desc: "SN4",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.01,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 0,
        }
      },
      {
        desc: "SN5",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.7,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 0,
        }
      },
      {
        desc: "SN6",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.2,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 0,
        }
      },
      {
        desc: "SN7",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 15,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0,
          dontOverlap: 1,
          socialDistanceOfLikeAgents: 1,
          perfectDeflections: 0,
        }
      },
      {
        desc: "SN8",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0.1,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 1,
        }
      },
      {
        desc: "SN9",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0.1,
          dontOverlap: 1,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 1,
        }
      },
      {
        desc: "SN10",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 15,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0.1,
          dontOverlap: 1,
          socialDistanceOfLikeAgents: 1,
          perfectDeflections: 1,
        }
      },
      {
        desc: "SN11",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 15,
          socialDistancingDiseasedTrigger: 0.2,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0.1,
          dontOverlap: 1,
          socialDistanceOfLikeAgents: 1,
          perfectDeflections: 1,
        }
      },
      {
        desc: "SN12",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 15,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0.1,
          dontOverlap: 1,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 1,
        }
      },
      {
        desc: "SN13",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 15,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0.3,
          dontOverlap: 1,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: 1,
        }
      },
      {
        desc: "SN14",
        params: {
          numAgents: 100,
          mutation: 0,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0,
          amountOfOffSprings: 0,
          deflectionStrength: 0.1,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: -1,
        }
      },
      {
        desc: "SN15",
        params: {
          numAgents: 100,
          mutation: 0.1,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0.5,
          amountOfOffSprings: 0.8,
          deflectionStrength: 0.1,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: -1,
        }
      },
      {
        desc: "SN16",
        params: {
          numAgents: 100,
          mutation: 0.1,
          diseaseIntroductionRate: 0,
          forceOfAttraction: 0.002,  // global force
          diseaseIdentificationProbability: 1,
          contagionRate: 0.25,
          visualRange: 30,
          zombificationRate: 0, //0.0001,
          deathRate: 0.01,
          recoveryRate: 0.1,
          recoveryLossRate: 0.01,
          socialDistanceLength: 0,
          socialDistancingDiseasedTrigger: 0,
          amountOfArtificialSelection: 0.2,
          amountOfOffSprings: 0.8,
          deflectionStrength: 0.1,
          dontOverlap: 0,
          socialDistanceOfLikeAgents: 0,
          perfectDeflections: -1,
        }
      },
    ];
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
