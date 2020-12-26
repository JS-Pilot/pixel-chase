function determineQuadrant () {
    if (current_roll_in_degrees >= 0 && current_pitch_in_degrees <= 0) {
        current_quadrant = "top_right"
    } else if (current_roll_in_degrees >= 0 && current_pitch_in_degrees > 0) {
        current_quadrant = "bottom_right"
    } else if (current_roll_in_degrees < 0 && current_pitch_in_degrees >= 0) {
        current_quadrant = "bottom_left"
    } else {
        current_quadrant = "top_left"
    }
}
let direction = 0
let current_pitch_in_degrees = 0
let current_roll_in_degrees = 0
let current_quadrant = ""
let absolute_roll = 0
let absolute_pitch = 0
current_quadrant = "top_right"
let main_sprite = game.createSprite(2, 4)
let goal_sprite = game.createSprite(2, 0)
basic.forever(function () {
    current_roll_in_degrees = input.rotation(Rotation.Roll)
    current_pitch_in_degrees = input.rotation(Rotation.Pitch)
    determineQuadrant()
    absolute_pitch = Math.abs(current_pitch_in_degrees)
    absolute_roll = Math.abs(current_roll_in_degrees)
    direction = Math.atan(absolute_roll / absolute_pitch) * 57.2958
    if (current_quadrant == "top_right") {
        direction = direction
    } else if (current_quadrant == "bottom_right") {
        direction = direction + 90
    } else if (current_quadrant == "bottom_left") {
        direction = 270 - direction
    } else {
        direction = 270 + direction
    }
    main_sprite.set(LedSpriteProperty.Direction, direction)
    main_sprite.move(1)
})
basic.forever(function () {
    basic.pause(800)
    goal_sprite.delete()
    basic.pause(800)
    goal_sprite = game.createSprite(2, 0)
})
