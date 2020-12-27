function determineTouching () {
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
function sanitize_lean (lean: number) {
    if (Math.abs(lean) < 0.5) {
        lean = 0
    } else if (lean > 80) {
        lean = 80
    } else if (lean < -80) {
        lean = -80
    }
    return lean
}
function restartgame () {
    level = 1
    enemy_sprite.delete()
    goal_sprite.delete()
    main_sprite.delete()
    playLevel()
}
function determineLevelWin () {
    if (touching_for_total_of_milliseconds >= touching_milliseconds_to_win) {
        goal_sprite.delete()
        main_sprite.set(LedSpriteProperty.Blink, 100)
        level += 1
        basic.pause(2000)
        main_sprite.delete()
        playLevel()
    }
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
    if (main_sprite.isTouching(enemy_sprite)) {
        if (main_sprite.get(LedSpriteProperty.Y) == 4) {
            main_sprite.set(LedSpriteProperty.Y, 0)
        }
        while (main_sprite.get(LedSpriteProperty.Y) < 4) {
            main_sprite.set(LedSpriteProperty.Direction, 180)
            main_sprite.move(1)
            basic.pause(300)
        }
        restartgame()
    }
}
function playLevel () {
    touching_milliseconds_to_win = 500
    touching_for_total_of_milliseconds = 0
    last_touch_time = 0
    main_sprite = game.createSprite(2, 2)
    goal_sprite = game.createSprite(0, 0)
    goal_sprite.set(LedSpriteProperty.Blink, 500)
    if (level == 2) {
        enemy_sprite = game.createSprite(3, 4)
        enemy_sprite.set(LedSpriteProperty.Blink, 50)
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
let angle = 0
let force = 0
let sprite_direction = 0
let aiming_quadrant = ""
let current_pitch_in_degrees = 0
let current_roll_in_degrees = 0
let touching_milliseconds_to_win = 0
let level = 0
let lean = 0
let touching_for_total_of_milliseconds = 0
let last_touch_time = 0
let enemy_sprite: game.LedSprite = null
let goal_sprite: game.LedSprite = null
let main_sprite: game.LedSprite = null
main_sprite = game.createSprite(0, 0)
goal_sprite = game.createSprite(0, 0)
enemy_sprite = game.createSprite(0, 0)
restartgame()
basic.forever(function () {
    roll_around_sprite(main_sprite)
    determineTouching()
    determineLevelWin()
    checkandhandleEnemytouch()
})
