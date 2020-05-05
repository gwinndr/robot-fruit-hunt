// Extension to SimpleBot.
// Goes after the most valuable fruit- furit with the least amount in total
// Only goes to contested fruit-  fruit type whose category has not had a majority reached yet

var PositionBot = {
    // Use these functions for compatibility with testing framework
    // ex: "this.get_my_x()"
    get_my_x: get_my_x ,
    get_my_y: get_my_y ,
    get_my_item_count: get_my_item_count ,
    get_opponent_x: get_opponent_x ,
    get_opponent_y: get_opponent_y ,
    get_opponent_item_count: get_opponent_item_count ,

    get_name: function()
    {
        return "PositionBot";
    } ,


    // Called when starting a new_game
    new_game: function()
    {
    } ,

    // Called to make a move
    make_move: function() {
       // to disable to opponent, uncomment the next line
       // return PASS;

       PositionBot.board = get_board();

       // we found a contested item! take it!
       if (PositionBot.isContestedFruit(this.get_my_x(), this.get_my_y()) && PositionBot.closerToMe(this.get_my_x(), this.get_my_y())) {
           return TAKE;
       }

       // looks like we'll have to keep track of what moves we've looked at
       PositionBot.toConsider = new Array();
       PositionBot.considered = new Array(HEIGHT);
       for (var i = 0; i < WIDTH; i++) {
           PositionBot.considered[i] = new Array(HEIGHT);
           for (var j = 0; j < HEIGHT; j++) {
               PositionBot.considered[i][j] = 0;
           }
       }

       // let's find the move that will start leading us to the closest item
       return PositionBot.findMove(new node(this.get_my_x(), this.get_my_y(), -1));
    },


    findMove: function(n) {

      //*************************************************************************
       // closest contested item! we will go to it
       if (PositionBot.isContestedFruit(n.x, n.y) && PositionBot.closerToMe(n.x, n.y))
           return n.move;
      //*************************************************************************


       var possibleMove = n.move;

       // NORTH
       if (PositionBot.considerMove(n.x, n.y-1)) {
           if (n.move == -1) {
               possibleMove = NORTH;
           }
           PositionBot.toConsider.push(new node(n.x, n.y-1, possibleMove));
       }

       // SOUTH
       if (PositionBot.considerMove(n.x, n.y+1)) {
           if (n.move == -1) {
               possibleMove = SOUTH;
           }
           PositionBot.toConsider.push(new node(n.x, n.y+1, possibleMove));
       }

       // WEST
       if (PositionBot.considerMove(n.x-1, n.y)) {
           if (n.move == -1) {
               possibleMove = WEST;
           }
           PositionBot.toConsider.push(new node(n.x-1, n.y, possibleMove));
       }

       // EAST
       if (PositionBot.considerMove(n.x+1, n.y)) {
           if (n.move == -1) {
               possibleMove = EAST;
           }
           PositionBot.toConsider.push(new node(n.x+1, n.y, possibleMove));
       }

       // take next node to bloom out from
       if (PositionBot.toConsider.length > 0) {
           var next = PositionBot.toConsider.shift();
           return PositionBot.findMove(next);
       }

       // no move found
       return -1;
    },

    considerMove: function(x, y) {
       if (!PositionBot.isValidMove(x, y)) return false;
       if (PositionBot.considered[x][y] > 0) return false;
       PositionBot.considered[x][y] = 1;
       return true;
    },


    // Checks if a fruit category is contested or if the category is decided whether or not there's
    // still fruit of that type in play
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

    // checks if closer to me
    closerToMe: function(x, y)
    {
        // ***************************************************************************************
        // want to check to make sure it is not the last fruit on the board
        for (var i=0; i < PositionBot.board.numberOfItemTypes; i++)  {
            var numleft = PositionBot.board.totalItems[i] - PositionBot.board.myBotCollected[i] - PositionBot.board.simpleBotCollected[i];
        }

        //want to go for the last fruit
        if (numleft == 1) {
            return true;
        }
        else {
            var myDist = this.euclideanDistance(this.get_my_x(), x, this.get_my_y(), y);
            var oppDist = this.euclideanDistance(this.get_opponent_x(), x, this.get_opponent_y(), y);
            if(myDist < oppDist) {
                return true;
            }
            else {
                return false;
            }
        }

    },
    //*************************************************************************

    euclideanDistance: function(x1, x2, y1, y2)
    {
        d_x = Math.pow(x1-x2, 2);
        d_y = Math.pow(y1-y2, 2);

        return Math.abs(d_x + d_y);
    },


    isValidMove: function(x, y) {
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
            return false;
        return true;
    }
}

function node(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
}
