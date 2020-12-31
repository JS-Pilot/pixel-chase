function determineTouching () {
    if (main_sprite.isTouching(goal_sprite)) {
        if (last_touch_time != 0) {
            touching_for_total_of_milliseconds = control.millis() - last_touch_time + touching_for_total_of_milliseconds
        }
        last_touch_time = control.millis()
        touching_for_total_of_milliseconds = 1000
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
    deleteEnemies()
    goal_sprite.delete()
    main_sprite.delete()
    easter_egg_is_possible = true
    basic.showIcon(IconNames.Happy, 1000)
basic.pause(1000)
    basic.showIcon(IconNames.Heart, 1000)
basic.pause(1000)
    basic.clearScreen()
    if (show_easter_egg == true) {
        basic.showString("Easter Egg")
        playing_easter_egg == true
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
    while (index_esprites <= enemy_sprites.length - 1) {
        enemy_sprites[index_esprites].delete()
        index_esprites += 1
    }
    index_esprites_del = 0
    while (index_esprites_del <= index_esprites - 1) {
        _py.py_array_pop(enemy_sprites)
index_esprites_del += 1
    }
}
function sanitize_lean (lean: number) {
    if (Math.abs(lean) < 10) {
        lean = 0
    } else if (lean > 80) {
        lean = 80
    } else if (lean < -80) {
        lean = -80
    }
    return lean
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
    check_for_maxlevel_win()
    deleteEnemies()
    level += 1
    playLevel()
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
    while (index_enemies <= enemy_sprites.length - 1) {
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
    touching_milliseconds_to_win = 1
    touching_for_total_of_milliseconds = 0
    last_touch_time = 0
    sprite_coordinates = main_sprite_starting_coordinates_by_level[level - 1]
    main_sprite = game.createSprite(sprite_coordinates[0], sprite_coordinates[1])
    sprite_coordinates = goal_sprite_starting_coordinates_by_level[level - 1]
    goal_sprite = game.createSprite(sprite_coordinates[0], sprite_coordinates[1])
    goal_sprite.set(LedSpriteProperty.Blink, 500)
    enemy_sprites_by_level = enemy_sprites_starting_coordinates_by_level[level - 1]
    indexpl = 0
    while (indexpl <= enemy_sprites_by_level.length - 1) {
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
    aiming_quadrant = determineQuadrant(current_roll_in_degrees, current_pitch_in_degrees)
    sprite_direction = directionForQuadrant(Math.abs(current_roll_in_degrees), Math.abs(current_pitch_in_degrees), aiming_quadrant)
    main_sprite.set(LedSpriteProperty.Direction, sprite_direction)
    force = Math.sqrt(Math.abs(current_roll_in_degrees) ** 2 + Math.abs(current_pitch_in_degrees) ** 2)
    if (force > 0.5) {
        main_sprite.move(1)
        basic.pause(500 - 5 * force)
    }
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
angle = Math.atan(absolute_roll / Math.max(absolute_pitch, 0.001)) * 57.2958
    if (aiming_quadrant == "top_right") {
        direction = angle
    } else if (aiming_quadrant == "bottom_right") {
        direction = angle + 90
    } else if (aiming_quadrant == "bottom_left") {
        direction = angle + 180
    } else {
        direction = angle + 270
    }
    return direction
}
function move_enemies () {
    let level_coordinates: number[][];
index_mv = 0
    while (index_mv <= enemy_sprites.length - 1) {
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
let angle = 0
let index_array = 0
let force = 0
let sprite_direction = 0
let aiming_quadrant = ""
let current_pitch_in_degrees = 0
let current_roll_in_degrees = 0
let enemy_sprite: game.LedSprite = null
let enemy_sprite_coordinates: number[] = []
let indexpl = 0
let enemy_sprites_by_level: number[][] = []
let sprite_coordinates: number[] = []
let index_enemies = 0
let touching_milliseconds_to_win = 0
let lean = 0
let index_esprites_del = 0
let index_esprites = 0
let easter_egg_is_possible = false
let level = 0
let randomDirection = 0
let Random_Value = 0
let touching_for_total_of_milliseconds = 0
let last_touch_time = 0
let index_max_enemies = 0
let enemy_sprites_starting_coordinates_by_level: number[][][] = []
let goal_sprite: game.LedSprite = null
let main_sprite: game.LedSprite = null
let main_sprite_starting_coordinates_by_level: number[][] = []
let goal_sprite_starting_coordinates_by_level: number[][] = []
let max_game_level = 0
let entered_easter_egg_code: number[] = []
let correct_easter_egg_code: number[] = []
let show_easter_egg = false
let playing_easter_egg = false
let enemy_sprites : game.LedSprite[] = []
show_easter_egg = false
correct_easter_egg_code = [1, 2, 3]
entered_easter_egg_code = []
max_game_level = 5
let max_enemy_sprites = 10
goal_sprite_starting_coordinates_by_level = [[0, 0], [2, 2], [2, 0], [0, 4], [2, 0]]
main_sprite_starting_coordinates_by_level = [[2, 4], [2, 4], [2, 4], [4, 0], [2, 4]]
main_sprite = game.createSprite(0, 4)
goal_sprite = game.createSprite(4, 0)
enemy_sprites_starting_coordinates_by_level = [[[9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9]], [[3, 4], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9], [9, 9]], [[0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0]], [[4, 1], [3, 2], [2, 3], [1, 4], [3, 0], [2, 1], [1, 2], [0, 3], [9, 9], [9, 9]], [[0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0]]]
while (index_max_enemies <= max_enemy_sprites - 1) {
    enemy_sprites.push(game.createSprite(0, 3))
    index_max_enemies += 1
}
restartgame()
basic.forever(function () {
    if (playing_easter_egg == false) {
        roll_around_sprite(main_sprite)
        determineTouching()
        determineLevelWin()
        checkandhandleEnemytouch()
    } else {
        roll_around_sprite(main_sprite)
    }
})
basic.forever(function () {
    if (level == max_game_level && playing_easter_egg == false) {
        move_enemies()
    }
})
