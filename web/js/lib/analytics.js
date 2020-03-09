class Stats {
  constructor(){
    console.log(swarmManager.agents.length);
  }
  update() {
    $("#message_p").html("Episode: "+episodeManager.episodeNumber);
  }
}


