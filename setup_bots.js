// Optionally include this function if you'd like to always reset to a
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}

// These are what you want to touch
BOT_1 = RandoBot
BOT_2 = SimpleBot


// Reverse for BOT_2
BOT_2.get_my_x = get_opponent_x
BOT_2.get_my_y = get_opponent_y
BOT_2.get_my_item_count = get_opponent_item_count
BOT_2.get_opponent_x = get_my_x
BOT_2.get_opponent_y = get_my_y
BOT_2.get_opponent_item_count = get_my_item_count

function make_move()
{
    return BOT_1.make_move()
}

function new_game()
{
    BOT_1.new_game()
    BOT_2.new_game()
}