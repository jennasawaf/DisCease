class Relocator {
  relocate(agent, grid){}
}

class RandomRelocator extends Relocator {
  constructor(maxCheck) {
    super();
    this.maxCheck = maxCheck; // This is q
  }

  relocate(agent, grid) {
    /*
    1. Find all the empty cells.
    2. Shuffle them.
    3. Iterate this empty cells array from 0 to q.
       a. Keep track of happiest cell
       b. if happy, then select that cell.
    4. If happiest is happier than current, then return happiest
    5. Else return current location.
     */

    let emptyCells = grid.getEmptyCells();
    grid.shuffle(emptyCells);

    let maxHappyLocation = [agent.x, agent.y];
    let maxHappyScore =  grid.getHappyScore(agent.x, agent.y, agent.type);;

    for (let i = 0; i < this.maxCheck; i++) {
      if (i >= emptyCells.length)
        break;
      let happyScore = grid.getHappyScore(emptyCells[i][0], emptyCells[i][1], agent.type);
      if (happyScore >= k_neighbours) {
        maxHappyLocation = emptyCells[i];
        break;
      }
      if (happyScore > maxHappyScore) {
        maxHappyScore = happyScore;
        maxHappyLocation = emptyCells[i];
      }
    }

    grid.matrix[agent.x][agent.y] = cellState.empty;
    grid.matrix[maxHappyLocation[0]][maxHappyLocation[1]] = agent.type;

  }
}

class FriendRelocator extends Relocator {
  constructor(numberOfFriends, p) {
    super();
    this.numberOfFriends = numberOfFriends;
    this.p = p;
  }

  relocate(agent, grid) {
    /*
    1- decide who the n friends are
    2- when the agent wants to move it informs its friends. 
      a. if the friends have an empty spot around them, they tell it 
      b. else it picks a spot randomly
    3- 


    */

    let emptyCells = grid.getEmptyCells();
    grid.shuffle(emptyCells);

    let maxHappyLocation = [agent.x, agent.y];
    let maxHappyScore =  grid.getHappyScore(agent.x, agent.y, agent.type);;
  }
}