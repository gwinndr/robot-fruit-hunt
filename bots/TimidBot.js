// Andrew Shaw
//
// Fruitbot AI: TimidBot
//
// Similar to CompetitiveBot . . . but the opposite.
// TimidBot avoids the fruit recently picked up by the opponent

var TimidBot =
{
    // Copied from SimpleBot 2.0
    get_my_x: get_my_x ,
    get_my_y: get_my_y ,
    get_my_item_count: get_my_item_count ,
    get_opponent_x: get_opponent_x ,
    get_opponent_y: get_opponent_y ,
    get_opponent_item_count: get_opponent_item_count ,

    // Variables unique to TimidBot
    get_my_recent_fruit: get_my_recent_fruit ,
    get_opponent_recent_fruit: get_opponent_recent_fruit ,


//-------------------------------
    get_name: function()
    {
        return "TimidBot";
    } ,

//-------------------------------
    new_game: function()
    {
    } ,

//-------------------------------
    make_move: function()
    {
      // to disable to opponent, uncomment the next line
      // return PASS;

      TimidBot.board = get_board();

      // we found a contested item! take it!
      if (TimidBot.isContestedFruit(this.get_my_x(), this.get_my_y())) {
        // If CompetitiveBot walks over a fruit recently picked by the opponent, pick up
          if (this.get_opponent_recent_fruit() != get_board()[this.get_my_x()][this.get_my_y()] || this.get_opponent_recent_fruit() == 0)
            return TAKE;
      }



      // looks like we'll have to keep track of what moves we've looked at
      TimidBot.toConsider = new Array();
      TimidBot.considered = new Array(HEIGHT);
      for (var i = 0; i < WIDTH; i++) {
          TimidBot.considered[i] = new Array(HEIGHT);
          for (var j = 0; j < HEIGHT; j++) {
              TimidBot.considered[i][j] = 0;
          }
      }

      // let's find the move that will start leading us to the closest item
      return TimidBot.findMove(new node(this.get_my_x(), this.get_my_y(), -1));
    },

//-------------------------------
    findMove: function(n) {
       // closest contested item! we will go to it

//NEW, looks for the closest contested fruit that was last picked by the opponent
//Beginning when opponent has not gotten a fruit yet
      if (this.get_opponent_recent_fruit() == 0) {
        if (TimidBot.isContestedFruit(n.x, n.y))
            return n.move;
      }
//During the game, makes sure TimidBot avoids opponent's fruit
      else if (this.get_opponent_recent_fruit() != get_board()[n.x][n.y]) {
         if (TimidBot.isContestedFruit(n.x, n.y))
            return n.move;
      }

       var possibleMove = n.move;

       // NORTH
       if (TimidBot.considerMove(n.x, n.y-1)) {
           if (n.move == -1) {
               possibleMove = NORTH;
           }
           TimidBot.toConsider.push(new node(n.x, n.y-1, possibleMove));
       }

       // SOUTH
       if (TimidBot.considerMove(n.x, n.y+1)) {
           if (n.move == -1) {
               possibleMove = SOUTH;
           }
           TimidBot.toConsider.push(new node(n.x, n.y+1, possibleMove));
       }

       // WEST
       if (TimidBot.considerMove(n.x-1, n.y)) {
           if (n.move == -1) {
               possibleMove = WEST;
           }
           TimidBot.toConsider.push(new node(n.x-1, n.y, possibleMove));
       }

       // EAST
       if (TimidBot.considerMove(n.x+1, n.y)) {
           if (n.move == -1) {
               possibleMove = EAST;
           }
           TimidBot.toConsider.push(new node(n.x+1, n.y, possibleMove));
       }

       // take next node to bloom out from
       if (TimidBot.toConsider.length > 0) {
           var next = TimidBot.toConsider.shift();
           return TimidBot.findMove(next);
       }

       // no move found
       return -1;
    },

//-----------------------
    isContestedFruit: function(x, y)
      {
          // A fruit on a board position means a number greater than 0
          var fruit_type = get_board()[x][y]
          if(fruit_type == 0)
            return false;

          var total_fruit = get_total_item_count(fruit_type)
          var my_fruit = get_my_item_count(fruit_type)
          var opp_fruit = get_opponent_item_count(fruit_type)

    // A contested fruit type is one where min can never even tie the max
    // i.e. the bot with the least fruit of this type cannot recover, the category is decided.
          var min_fruit = Math.min(my_fruit, opp_fruit)
          var max_fruit = Math.max(my_fruit, opp_fruit);
          var fruit_left = total_fruit - (min_fruit + max_fruit);

          var possible_comeback = min_fruit + fruit_left;
      if(possible_comeback < max_fruit)
        return false;
      else
        return true;
      },

//-------------------------------
    isContestedFruitType: function(t)
    {
      //Modified "isContested" function which takes a specific fruit type instead of coordinates.
      //Returns true if the type of fruit is still able to be contested
        if(t == 0)
          return false;

        var total_fruit = get_total_item_count(t)
        var my_fruit = get_my_item_count(t)
        var opp_fruit = get_opponent_item_count(t)

// A contested fruit type is one where min can never even tie the max
// i.e. the bot with the least fruit of this type cannot recover, the category is decided.
        var min_fruit = Math.min(my_fruit, opp_fruit)
        var max_fruit = Math.max(my_fruit, opp_fruit);
        var fruit_left = total_fruit - (min_fruit + max_fruit);

        var possible_comeback = min_fruit + fruit_left;
      if(possible_comeback < max_fruit)
        return false;
      else
        return true;
    } ,

//-------------------------------
    considerMove: function(x, y) {
         if (!TimidBot.isValidMove(x, y)) return false;
         if (TimidBot.considered[x][y] > 0) return false;
         TimidBot.considered[x][y] = 1;
         return true;
      },

//-------------------------------
    isValidMove: function(x, y) {
          if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
              return false;
          return true;
      },
}
//-------------------------------
function node(x, y, move) {
      this.x = x;
      this.y = y;
      this.move = move;
}
