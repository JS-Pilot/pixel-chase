function determineTouching () {
    // touching_for_total_of_milliseconds = 1000
    if (main_sprite.isTouching(goal_sprite)) {
        if (last_touch_time != 0) {
            touching_for_total_of_milliseconds = control.millis() - last_touch_time + touching_for_total_of_milliseconds
        }
        last_touch_time = control.millis()
    } else {
        last_touch_time = 0
        touching_for_total_of_milliseconds = 0
    }
}
function pickRandomDirection () {
    Random_Value = randint(1, 8)
    if (Random_Value == 1) {
        randomDirection = 0
    } else if (Random_Value == 2) {
        randomDirection = 45
    } else if (Random_Value == 3) {
        randomDirection = 90
    } else if (Random_Value == 4) {
        randomDirection = 135
    } else if (Random_Value == 5) {
        randomDirection = 180
    } else if (Random_Value == 6) {
        randomDirection = 225
    } else if (Random_Value == 7) {
        randomDirection = 270
    } else if (Random_Value == 8) {
        randomDirection = 315
    }
    return randomDirection
}
function check_for_maxlevel_win () {
    if (level != max_game_level) {
        return false
    }
    easter_egg_is_possible = true
    basic.showIcon(IconNames.Happy, 1000)
    basic.pause(1000)
    basic.showIcon(IconNames.Heart, 1000)
    basic.pause(1000)
    basic.clearScreen()
    if (show_easter_egg == true) {
        // basic.showString("Easter Egg")
        playing_easter_egg = true
        maze_initialize()
    } else {
        control.reset()
    }
    return true
}
input.onButtonPressed(Button.A, function () {
    if (easter_egg_is_possible == true) {
        show_easter_egg = update_and_check_easter_egg_code(1)
    }
})
function deleteEnemies () {
    index_esprites = 0
    while (index_esprites < enemy_sprites.length) {
        enemy_sprites[index_esprites].delete()
        index_esprites += 1
    }
    index_esprites_del = 0
    while (index_esprites_del < index_esprites) {
        enemy_sprites.pop()
        index_esprites_del += 1
    }
}
function sanitize_lean (lean: number) {
    if (lean < -80) {
        lean = -80
    } else if (lean > 80) {
        lean = 80
    } else if (Math.abs(lean) < 10) {
        lean = 0
    }
    return lean
}
function detect_wall_collision (s: game.LedSprite) {
    maze_sprite_brightness = maze_current_section[s.get(LedSpriteProperty.X)][s.get(LedSpriteProperty.Y)]
    // if wall sprite is "active"
    if (maze_sprite_brightness > 0) {
        return true
    } else {
        return false
    }
}
function restartgame () {
    show_easter_egg = false
    entered_easter_egg_code = []
    easter_egg_is_possible = false
    level = 1
    goal_sprite.delete()
    main_sprite.delete()
    deleteEnemies()
    playLevel()
}
function determineLevelWin () {
    if (touching_for_total_of_milliseconds < touching_milliseconds_to_win) {
        return false
    }
    goal_sprite.delete()
    main_sprite.set(LedSpriteProperty.Blink, 100)
    basic.pause(2000)
    main_sprite.delete()
    deleteEnemies()
    check_for_maxlevel_win()
    if (playing_easter_egg != true) {
        level += 1
        playLevel()
    }
    return true
}
function determineQuadrant (current_roll_in_degrees: number, current_pitch_in_degrees: number) {
    let quadrant: string;
if (current_roll_in_degrees >= 0 && current_pitch_in_degrees <= 0) {
        quadrant = "top_right"
    } else if (current_roll_in_degrees >= 0 && current_pitch_in_degrees > 0) {
        quadrant = "bottom_right"
    } else if (current_roll_in_degrees < 0 && current_pitch_in_degrees >= 0) {
        quadrant = "bottom_left"
    } else {
        quadrant = "top_left"
    }
    return quadrant
}
function checkandhandleEnemytouch () {
    index_enemies = 0
    while (index_enemies < enemy_sprites.length) {
        if (main_sprite.isTouching(enemy_sprites[index_enemies])) {
            if (main_sprite.get(LedSpriteProperty.Y) == 4) {
                main_sprite.set(LedSpriteProperty.Y, 0)
            }
            while (main_sprite.get(LedSpriteProperty.Y) < 4) {
                main_sprite.set(LedSpriteProperty.Direction, 180)
                main_sprite.move(1)
                basic.pause(300)
            }
            images.iconImage(IconNames.Skull).showImage(0)
            basic.pause(500)
            restartgame()
            break;
        }
        index_enemies += 1
    }
}
input.onButtonPressed(Button.AB, function () {
    if (easter_egg_is_possible == true) {
        show_easter_egg = update_and_check_easter_egg_code(3)
    }
})
input.onButtonPressed(Button.B, function () {
    if (easter_egg_is_possible == true) {
        show_easter_egg = update_and_check_easter_egg_code(2)
    }
})
function playLevel () {
    touching_milliseconds_to_win = 500 / 2
    touching_for_total_of_milliseconds = 0
    last_touch_time = 0
    sprite_coordinates = main_sprite_starting_coordinates_by_level[level - 1]
    main_sprite = game.createSprite(sprite_coordinates[0], sprite_coordinates[1])
    main_sprite.set(LedSpriteProperty.Brightness, 200)
    sprite_coordinates = goal_sprite_starting_coordinates_by_level[level - 1]
    goal_sprite = game.createSprite(sprite_coordinates[0], sprite_coordinates[1])
    goal_sprite.set(LedSpriteProperty.Blink, 500)
    goal_sprite.set(LedSpriteProperty.Brightness, 150)
    enemy_sprites_by_level = enemy_sprites_starting_coordinates_by_level[level - 1]
    indexpl = 0
    while (indexpl < enemy_sprites_by_level.length) {
        enemy_sprite_coordinates = enemy_sprites_by_level[indexpl]
        if (enemy_sprite_coordinates[0] != 9) {
            enemy_sprite = game.createSprite(enemy_sprite_coordinates[0], enemy_sprite_coordinates[1])
            enemy_sprite.set(LedSpriteProperty.Blink, 50)
            enemy_sprites.push(enemy_sprite)
        }
        indexpl += 1
    }
}
function roll_around_sprite (s: game.LedSprite) {
    current_roll_in_degrees = sanitize_lean(input.rotation(Rotation.Roll))
    current_pitch_in_degrees = sanitize_lean(input.rotation(Rotation.Pitch))
    force = Math.sqrt(Math.abs(current_roll_in_degrees) ** 2 + Math.abs(current_pitch_in_degrees) ** 2)
    if (force <= 10) {
        return
    }
    aiming_quadrant = determineQuadrant(current_roll_in_degrees, current_pitch_in_degrees)
    sprite_direction = directionForQuadrant(Math.abs(current_roll_in_degrees), Math.abs(current_pitch_in_degrees), aiming_quadrant)
    s.set(LedSpriteProperty.Direction, sprite_direction)
    current_position = [s.get(LedSpriteProperty.X), s.get(LedSpriteProperty.Y)]
    s.move(1)
    if (playing_easter_egg == true && detect_wall_collision(s) == true) {
        s.set(LedSpriteProperty.X, current_position[0])
        s.set(LedSpriteProperty.Y, current_position[1])
    }
    basic.pause(500 - 5 * force)
}
function update_and_check_easter_egg_code (easter_egg_code_part: number) {
    entered_easter_egg_code.push(easter_egg_code_part)
    // array equality not working
    // if entered_easter_egg_code == correct_easter_egg_code:
    // return True
    if (entered_easter_egg_code.length == correct_easter_egg_code.length) {
        index_array = 0
        while (index_array < correct_easter_egg_code.length) {
            if (entered_easter_egg_code[index_array] != correct_easter_egg_code[index_array]) {
                return false
            }
            index_array += 1
        }
        return true
    }
    return false
}
function directionForQuadrant (absolute_roll: number, absolute_pitch: number, aiming_quadrant: string) {
    let direction: number;
angle = Math.atan2(absolute_roll, absolute_pitch) * 57.2958
    switch(Math.floor(angle/22.5)) {
        case 0:
            angle = 0
            break;
        case 1:
        case 2:
            angle = 45
            break;
        case 3:
        case 4:
            angle = 90
            break;
    }
if (aiming_quadrant == "top_right") {
        direction = angle
    } else if (aiming_quadrant == "bottom_right") {
        direction = 180 - angle
    } else if (aiming_quadrant == "bottom_left") {
        direction = angle + 180
    } else {
        direction = 360 - angle
    }
    return direction
}
function maze_initialize () {
    maze_current_section_coordinates = [2, 2]
    maze_screen_index_x = 0
    while (maze_screen_index_x < 5) {
        maze_sprites[maze_screen_index_x] = []
        maze_screen_index_y = 0
        while (maze_screen_index_y < 5) {
            maze_sprites[maze_screen_index_x].push(game.createSprite(maze_screen_index_x, maze_screen_index_y))
            maze_screen_index_y += 1
        }
        maze_screen_index_x += 1
    }
    main_sprite = game.createSprite(2, 4)
    maze_display_current_section()
}
function maze_display_current_section () {
    maze_current_sections_x = maze_sections[maze_current_section_coordinates[0]]
    maze_current_section = maze_current_sections_x[maze_current_section_coordinates[1]]
    maze_screen_index_x = 0
    while (maze_screen_index_x < 5) {
        maze_sprites_x = maze_sprites[maze_screen_index_x]
        maze_screen_index_y = 0
        while (maze_screen_index_y < 5) {
            maze_sprite = maze_sprites_x[maze_screen_index_y]
            // This call to set will break when switching to Python (maze_sprite becomes of unknown type)
            maze_sprite.set(LedSpriteProperty.Brightness, maze_current_section[maze_screen_index_x][maze_screen_index_y])
            maze_screen_index_y += 1
        }
        maze_screen_index_x += 1
    }
}
function move_enemies () {
    let level_coordinates: number[][];
index_mv = 0
    while (index_mv < enemy_sprites.length) {
        enemy_sprite = enemy_sprites[index_mv]
        level_coordinates = enemy_sprites_starting_coordinates_by_level[level - 1]
        es_level_coordinates = level_coordinates[index_mv]
        if (es_level_coordinates[0] != enemy_sprite.get(LedSpriteProperty.X) || es_level_coordinates[1] != enemy_sprite.get(LedSpriteProperty.Y)) {
            enemy_sprite.set(LedSpriteProperty.X, es_level_coordinates[0])
            enemy_sprite.set(LedSpriteProperty.Y, es_level_coordinates[1])
        } else {
            enemy_sprite.set(LedSpriteProperty.Direction, pickRandomDirection())
            enemy_sprite.move(1)
        }
        index_mv += 1
    }
    basic.pause(520)
}
let es_level_coordinates: number[] = []
let index_mv = 0
let maze_sprite: game.LedSprite = null
let maze_screen_index_y = 0
let maze_screen_index_x = 0
let index_array = 0
let current_position: number[] = []
let sprite_direction = 0
let aiming_quadrant = ""
let force = 0
let current_pitch_in_degrees = 0
let current_roll_in_degrees = 0
let enemy_sprite: game.LedSprite = null
let enemy_sprite_coordinates: number[] = []
let indexpl = 0
let enemy_sprites_by_level: number[][] = []
let sprite_coordinates: number[] = []
let index_enemies = 0
let touching_milliseconds_to_win = 0
let maze_sprite_brightness = 0
let lean = 0
let index_esprites_del = 0
let index_esprites = 0
let playing_easter_egg = false
let easter_egg_is_possible = false
let level = 0
let randomDirection = 0
let Random_Value = 0
let touching_for_total_of_milliseconds = 0
let last_touch_time = 0
let index_max_enemies = 0
let maze_sections: number[][][][] = []
let maze_current_section_coordinates: number[] = []
let maze_current_sections_x: number[][][] = []
let maze_current_section: number[][] = []
let maze_sprites_x: game.LedSprite[] = []
let maze_sprites: game.LedSprite[][] = []
let enemy_sprites_starting_coordinates_by_level: number[][][] = []
let goal_sprite: game.LedSprite = null
let main_sprite: game.LedSprite = null
let main_sprite_starting_coordinates_by_level: number[][] = []
let goal_sprite_starting_coordinates_by_level: number[][] = []
let max_game_level = 0
let entered_easter_egg_code: number[] = []
let correct_easter_egg_code: number[] = []
let show_easter_egg = false
let enemy_sprites : game.LedSprite[] = []
let angle = 0
show_easter_egg = false
correct_easter_egg_code = [1, 2, 3]
entered_easter_egg_code = []
max_game_level = 5
let max_enemy_sprites = 10
goal_sprite_starting_coordinates_by_level = [[0, 0], [2, 2], [2, 0], [0, 4], [2, 0]]
main_sprite_starting_coordinates_by_level = [[2, 4], [2, 4], [2, 4], [4, 0], [2, 4]]
main_sprite = game.createSprite(2, 4)
goal_sprite = game.createSprite(4, 0)
enemy_sprites_starting_coordinates_by_level = [[[9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9]], [[3, 4], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9]], [[0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0]], [[4, 1], [3, 2], [2, 3], [1, 4], [3, 0], [2, 1], [1, 2], [0, 3], [9, 9], [9, 9]], [[0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0]]]
maze_sprites = []
maze_sprites_x = []
maze_current_section = [[0]]
maze_current_sections_x = [[[0]]]
maze_current_section_coordinates = [0, 0]
maze_sections = [[[[255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255]], [[255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255]], [[255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255]]], [[[255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 0, 0], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255]], [[255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [0, 0, 0, 0, 0], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255]], [[255, 255, 255, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255]]], [[[255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 0, 0], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255]], [[255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [0, 0, 0, 0, 0], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255]], [[255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [0, 0, 0, 0, 0], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255]]], [[[255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 0], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255]], [[255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [0, 0, 0, 0, 0], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255]], [[255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 0, 255, 255], [255, 255, 255, 255, 255]]]]
while (index_max_enemies < max_enemy_sprites) {
    enemy_sprites.push(game.createSprite(0, 3))
    index_max_enemies += 1
}
restartgame()
basic.forever(function () {
    if (level == max_game_level && playing_easter_egg == false) {
        move_enemies()
    }
})
basic.forever(function () {
    if (playing_easter_egg != true) {
        roll_around_sprite(main_sprite)
        determineTouching()
        determineLevelWin()
        checkandhandleEnemytouch()
    } else {
        roll_around_sprite(main_sprite)
    }
})
